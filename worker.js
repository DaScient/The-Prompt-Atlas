/**
 * The Prompt Atlas — Edge-Native API
 * Cloudflare Workers entrypoint.
 *
 * Bindings (see wrangler.toml):
 *   - ATLAS_DB   : D1 database
 *   - ATLAS_KV   : KV namespace (rate-limit + monthly quotas + ephemeral cache)
 *   - RAG_KV     : KV namespace (composed-prompt cache, retrieval hints)
 *   - ATLAS_R2   : R2 bucket (long-form artifacts, optional)
 *
 * Vars / Secrets:
 *   - ENVIRONMENT  : "dev" | "prod"            (var, public)
 *   - API_KEYS     : comma-separated keys      (SECRET — set with `wrangler secret put API_KEYS`)
 *   - ALLOW_ORIGIN : optional CORS allow-list  (var; defaults to "*")
 *
 * Free tier limits (per IP, per minute):     60 requests
 * Authenticated tier limits (per key, per month): 10,000 compose calls
 */

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

// ──────────────────────────────────────────────────────────────────────────────
// Entrypoint
// ──────────────────────────────────────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS pre-flight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env, request) });
    }

    try {
      const res = await route(request, url, env, ctx);
      return withCors(res, env, request);
    } catch (err) {
      // Log full detail server-side; never echo error internals to the client.
      console.error("unhandled", err?.stack ?? err);
      return withCors(json({ error: "internal_error" }, 500), env, request);
    }
  },
};

// ──────────────────────────────────────────────────────────────────────────────
// Router
// ──────────────────────────────────────────────────────────────────────────────
async function route(request, url, env, ctx) {
  const { pathname } = url;
  const method = request.method.toUpperCase();

  // Public, no-auth, no-rate-limit
  if (pathname === "/" || pathname === "/health") {
    return json({
      service: "prompt-atlas-api",
      status: "ok",
      environment: env.ENVIRONMENT || "prod",
      time: new Date().toISOString(),
      version: "1.1.0",
    });
  }

  // Per-IP rate limit for everything below /v1/*
  if (pathname.startsWith("/v1/")) {
    const rl = await rateLimitByIp(request, env);
    if (!rl.ok) return rl.response;
  }

  // Public, anonymous-readable endpoints
  if (method === "GET" && pathname === "/v1/atlas/categories") {
    return await listCategories(env);
  }
  if (method === "GET" && pathname === "/v1/atlas/prompts") {
    return await listPrompts(url, env);
  }
  const promptMatch = pathname.match(/^\/v1\/atlas\/prompts\/([A-Za-z0-9_\-]+)$/);
  if (method === "GET" && promptMatch) {
    return await getPrompt(promptMatch[1], env);
  }

  // Authenticated endpoints
  if (method === "POST" && pathname === "/v1/atlas/compose") {
    const auth = await requireApiKey(request, env);
    if (!auth.ok) return auth.response;
    const quota = await consumeMonthlyQuota(auth.keyId, env);
    if (!quota.ok) return quota.response;
    return await composePrompt(request, env, ctx);
  }

  if (method === "POST" && pathname === "/v1/atlas/lineage/start") {
    return await lineageStart(request, env);
  }
  const lineageMatch = pathname.match(/^\/v1\/atlas\/lineage\/([A-Za-z0-9_\-]+)\/continue$/);
  if (method === "POST" && lineageMatch) {
    return await lineageContinue(lineageMatch[1], request, env);
  }

  if (method === "DELETE" && pathname === "/v1/mirror/data") {
    return await mirrorWipe(request, env);
  }

  return json({ error: "not_found", path: pathname }, 404);
}

// ──────────────────────────────────────────────────────────────────────────────
// Handlers
// ──────────────────────────────────────────────────────────────────────────────
async function listCategories(env) {
  const rs = await env.ATLAS_DB
    .prepare("SELECT id, name, COALESCE(sort, 0) AS sort FROM categories ORDER BY sort ASC, name ASC")
    .all();
  return json({ categories: rs.results || [] });
}

async function listPrompts(url, env) {
  const q       = (url.searchParams.get("q") || "").trim();
  const tags    = (url.searchParams.get("tags") || "").split(",").map(s => s.trim()).filter(Boolean);
  const category = (url.searchParams.get("category") || "").trim();
  const limit   = clampInt(url.searchParams.get("limit"), 1, 100, 20);
  const offset  = clampInt(url.searchParams.get("offset"), 0, 10000, 0);

  // Anonymous list endpoint: only expose rows explicitly flagged public.
  const where = ["COALESCE(visibility, 'public') = 'public'"];
  const binds = [];
  if (q) {
    where.push("(title LIKE ? OR body LIKE ?)");
    binds.push(`%${q}%`, `%${q}%`);
  }
  if (category) {
    where.push("category = ?");
    binds.push(category);
  }
  for (const t of tags) {
    where.push("(',' || COALESCE(tags,'') || ',') LIKE ?");
    binds.push(`%,${t},%`);
  }

  const sql =
    "SELECT id, title, body, category, tags, " +
    "       COALESCE(visibility, 'public')              AS visibility, " +
    "       COALESCE(source,     'Prompt Atlas')        AS source, " +
    "       COALESCE(license,    'All rights reserved') AS license, " +
    "       created_at, " +
    "       COALESCE(updated_at, created_at)            AS updated_at " +
    "FROM prompts " +
    "WHERE " + where.join(" AND ") + " " +
    "ORDER BY created_at DESC LIMIT ? OFFSET ?";
  binds.push(limit, offset);

  const rs = await env.ATLAS_DB.prepare(sql).bind(...binds).all();
  return json({
    prompts: (rs.results || []).map(normalizePrompt),
    paging: { limit, offset, count: (rs.results || []).length },
  });
}

async function getPrompt(id, env) {
  const row = await env.ATLAS_DB
    .prepare(
      "SELECT id, title, body, category, tags, " +
      "       COALESCE(visibility, 'public')              AS visibility, " +
      "       COALESCE(source,     'Prompt Atlas')        AS source, " +
      "       COALESCE(license,    'All rights reserved') AS license, " +
      "       created_at, " +
      "       COALESCE(updated_at, created_at)            AS updated_at " +
      "FROM prompts " +
      "WHERE id = ? AND COALESCE(visibility, 'public') = 'public' " +
      "LIMIT 1"
    )
    .bind(id)
    .first();
  if (!row) return json({ error: "not_found", id }, 404);
  return json({ prompt: normalizePrompt(row) });
}

async function composePrompt(request, env, ctx) {
  const body = await readJson(request);
  if (!body) return json({ error: "invalid_json" }, 400);

  const goal        = strField(body.goal, "goal");
  if (goal.error)   return json(goal.error, 400);
  const audience    = optStr(body.audience);
  const tone        = optStr(body.tone);
  const constraints = Array.isArray(body.constraints)
    ? body.constraints.map(String).slice(0, 32)
    : [];

  const composed = renderComposedPrompt({
    goal: goal.value,
    audience,
    tone,
    constraints,
  });

  const id = `cmp_${crypto.randomUUID()}`;

  // Cache the composed prompt for ~24h (best-effort, non-blocking).
  if (env.RAG_KV) {
    ctx.waitUntil(env.RAG_KV.put(`compose:${id}`, JSON.stringify({
      id, goal: goal.value, audience, tone, constraints, composed,
      created_at: Date.now(),
    }), { expirationTtl: 60 * 60 * 24 }));
  }

  return json({ id, composed, goal: goal.value, audience, tone, constraints });
}

async function lineageStart(request, env) {
  const body = await readJson(request);
  if (!body) return json({ error: "invalid_json" }, 400);
  const title = strField(body.title, "title");
  if (title.error) return json(title.error, 400);

  const threadId = `thr_${crypto.randomUUID()}`;
  await env.ATLAS_DB
    .prepare("INSERT INTO lineage_threads (id, title) VALUES (?, ?)")
    .bind(threadId, title.value)
    .run();

  // Optional seed node
  let rootNodeId = null;
  if (body.prompt && typeof body.prompt === "string") {
    rootNodeId = `node_${crypto.randomUUID()}`;
    await env.ATLAS_DB
      .prepare("INSERT INTO lineage_nodes (id, thread_id, parent_id, prompt, summary) VALUES (?, ?, NULL, ?, ?)")
      .bind(rootNodeId, threadId, body.prompt, optStr(body.summary))
      .run();
  }

  return json({ thread: { id: threadId, title: title.value }, root_node_id: rootNodeId }, 201);
}

async function lineageContinue(threadId, request, env) {
  const body = await readJson(request);
  if (!body) return json({ error: "invalid_json" }, 400);

  const prompt = strField(body.prompt, "prompt");
  if (prompt.error) return json(prompt.error, 400);

  const thread = await env.ATLAS_DB
    .prepare("SELECT id FROM lineage_threads WHERE id = ? LIMIT 1")
    .bind(threadId)
    .first();
  if (!thread) return json({ error: "thread_not_found", thread_id: threadId }, 404);

  const parentId = typeof body.parent_id === "string" && body.parent_id ? body.parent_id : null;
  if (parentId) {
    const parent = await env.ATLAS_DB
      .prepare("SELECT id FROM lineage_nodes WHERE id = ? AND thread_id = ? LIMIT 1")
      .bind(parentId, threadId)
      .first();
    if (!parent) return json({ error: "parent_not_in_thread" }, 400);
  }

  const nodeId = `node_${crypto.randomUUID()}`;
  await env.ATLAS_DB
    .prepare("INSERT INTO lineage_nodes (id, thread_id, parent_id, prompt, summary) VALUES (?, ?, ?, ?, ?)")
    .bind(nodeId, threadId, parentId, prompt.value, optStr(body.summary))
    .run();

  return json({
    node: { id: nodeId, thread_id: threadId, parent_id: parentId, prompt: prompt.value },
  }, 201);
}

async function mirrorWipe(request, env) {
  // Stateless wipe: clears all KV entries scoped to the caller's IP / key.
  const scope = await callerScope(request, env);
  const prefix = `mirror:${scope}:`;
  let cursor;
  let removed = 0;
  // KV's list() is paginated; iterate until the listing reports it is complete.
  // `list_complete === true` means there are no more keys; otherwise `cursor`
  // carries the continuation token for the next page.
  while (true) {
    const page = await env.ATLAS_KV.list({ prefix, cursor });
    for (const k of page.keys) {
      await env.ATLAS_KV.delete(k.name);
      removed++;
    }
    if (page.list_complete) break;
    cursor = page.cursor;
    if (!cursor) break; // defensive: avoid an infinite loop on malformed pages
  }
  return json({ wiped: true, scope, removed });
}

// ──────────────────────────────────────────────────────────────────────────────
// Compose: deterministic template (no external LLM call)
// ──────────────────────────────────────────────────────────────────────────────
function renderComposedPrompt({ goal, audience, tone, constraints }) {
  const lines = [];
  lines.push(`# Goal`);
  lines.push(goal);
  lines.push("");
  if (audience) { lines.push(`# Audience`); lines.push(audience); lines.push(""); }
  if (tone)     { lines.push(`# Tone`);     lines.push(tone);     lines.push(""); }
  if (constraints && constraints.length) {
    lines.push(`# Constraints`);
    for (const c of constraints) lines.push(`- ${c}`);
    lines.push("");
  }
  lines.push(`# Instructions`);
  lines.push(
    "Respond as a thoughtful collaborator. Structure your answer in three parts: " +
    "(1) the core idea distilled in two sentences, " +
    "(2) a concrete plan or sketch grounded in the constraints above, and " +
    "(3) one provocative question that opens the next iteration."
  );
  return lines.join("\n");
}

// ──────────────────────────────────────────────────────────────────────────────
// Auth + rate-limit + quotas (all KV-backed)
// ──────────────────────────────────────────────────────────────────────────────
async function requireApiKey(request, env) {
  const presented = extractKey(request);
  if (!presented) {
    return { ok: false, response: json({ error: "unauthorized", reason: "missing_api_key" }, 401) };
  }
  const allowed = String(env.API_KEYS || "")
    .split(",").map(s => s.trim()).filter(Boolean);
  if (!allowed.length || !allowed.includes(presented)) {
    return { ok: false, response: json({ error: "unauthorized", reason: "bad_api_key" }, 401) };
  }
  return { ok: true, keyId: await hashKey(presented) };
}

function extractKey(request) {
  const auth = request.headers.get("authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (m) return m[1].trim();
  return (request.headers.get("x-api-key") || "").trim() || null;
}

async function hashKey(key) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

async function rateLimitByIp(request, env) {
  if (!env.ATLAS_KV) return { ok: true };
  const ip = request.headers.get("cf-connecting-ip") || "anon";
  const minute = Math.floor(Date.now() / 60000);
  const key = `rl:ip:${ip}:${minute}`;
  const current = parseInt(await env.ATLAS_KV.get(key) || "0", 10);
  if (current >= 60) {
    return {
      ok: false,
      response: json({ error: "rate_limited", retry_after_seconds: 60 - (Math.floor(Date.now() / 1000) % 60) }, 429),
    };
  }
  await env.ATLAS_KV.put(key, String(current + 1), { expirationTtl: 90 });
  return { ok: true };
}

async function consumeMonthlyQuota(keyId, env) {
  if (!env.ATLAS_KV) return { ok: true };
  const yyyymm = new Date().toISOString().slice(0, 7);
  const key = `quota:${keyId}:${yyyymm}`;
  const current = parseInt(await env.ATLAS_KV.get(key) || "0", 10);
  if (current >= 10000) {
    return { ok: false, response: json({ error: "quota_exceeded", period: yyyymm, limit: 10000 }, 429) };
  }
  await env.ATLAS_KV.put(key, String(current + 1), { expirationTtl: 60 * 60 * 24 * 40 });
  return { ok: true };
}

async function callerScope(request, env) {
  const presented = extractKey(request);
  if (presented) return `k_${await hashKey(presented)}`;
  return `ip_${request.headers.get("cf-connecting-ip") || "anon"}`;
}

// ──────────────────────────────────────────────────────────────────────────────
// Small utilities
// ──────────────────────────────────────────────────────────────────────────────
function json(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

async function readJson(request) {
  try {
    const text = await request.text();
    if (!text) return {};
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function strField(v, name) {
  if (typeof v !== "string" || !v.trim()) {
    return { error: { error: "invalid_field", field: name, reason: "must be a non-empty string" } };
  }
  if (v.length > 8000) {
    return { error: { error: "invalid_field", field: name, reason: "exceeds 8000 chars" } };
  }
  return { value: v.trim() };
}

function optStr(v) {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, 8000) : null;
}

function clampInt(raw, min, max, dflt) {
  const n = parseInt(raw, 10);
  if (Number.isNaN(n)) return dflt;
  return Math.max(min, Math.min(max, n));
}

function normalizePrompt(row) {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    category: row.category,
    tags: typeof row.tags === "string" && row.tags
      ? row.tags.split(",").map(s => s.trim()).filter(Boolean)
      : [],
    visibility: row.visibility || "public",
    source: row.source || "Prompt Atlas",
    license: row.license || "All rights reserved",
    created_at: row.created_at,
    updated_at: row.updated_at ?? row.created_at,
  };
}

function corsHeaders(env, request) {
  const allow = String(env.ALLOW_ORIGIN || "*");
  const origin = request.headers.get("origin") || "";
  return {
    "access-control-allow-origin": allow === "*" ? "*" : (allow.split(",").map(s => s.trim()).includes(origin) ? origin : ""),
    "access-control-allow-methods": "GET,POST,DELETE,OPTIONS",
    "access-control-allow-headers": "authorization,content-type,x-api-key",
    "access-control-max-age": "86400",
    "vary": "origin",
  };
}

function withCors(res, env, request) {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(corsHeaders(env, request))) headers.set(k, v);
  return new Response(res.body, { status: res.status, headers });
}
