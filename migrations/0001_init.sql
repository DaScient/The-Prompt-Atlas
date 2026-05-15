-- The Prompt Atlas — D1 canonical initial schema.
-- Run with: wrangler d1 migrations apply prompt_atlas_db --remote

PRAGMA foreign_keys = ON;

-- ─── Categories ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id   TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort INTEGER DEFAULT 0
);

-- ─── Prompts ─────────────────────────────────────────────────────────────────
-- Columns mirror 0002_seed_public_prompts.sql so the seed file applies cleanly.
CREATE TABLE IF NOT EXISTS prompts (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  category    TEXT NOT NULL,
  tags        TEXT,
  visibility  TEXT DEFAULT 'public',
  source      TEXT DEFAULT 'Prompt Atlas',
  license     TEXT DEFAULT 'All rights reserved',
  created_at  INTEGER DEFAULT (strftime('%s','now') * 1000),
  updated_at  INTEGER DEFAULT (strftime('%s','now') * 1000),
  FOREIGN KEY (category) REFERENCES categories(id)
);

CREATE INDEX IF NOT EXISTS idx_prompts_category   ON prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_created    ON prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_visibility ON prompts(visibility);

-- ─── Lineage threads & nodes ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lineage_threads (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s','now') * 1000)
);

CREATE TABLE IF NOT EXISTS lineage_nodes (
  id         TEXT PRIMARY KEY,
  thread_id  TEXT NOT NULL,
  parent_id  TEXT,
  prompt     TEXT NOT NULL,
  summary    TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now') * 1000),
  FOREIGN KEY (thread_id) REFERENCES lineage_threads(id),
  FOREIGN KEY (parent_id) REFERENCES lineage_nodes(id)
);

CREATE INDEX IF NOT EXISTS idx_lineage_thread  ON lineage_nodes(thread_id);
CREATE INDEX IF NOT EXISTS idx_lineage_parent  ON lineage_nodes(parent_id);

-- ─── Default categories (idempotent) ─────────────────────────────────────────
INSERT OR IGNORE INTO categories (id, name, sort) VALUES
  ('business',    'Business & Strategy',  10),
  ('science',     'Science & Discovery',  20),
  ('writing',     'Writing & Expression', 30),
  ('engineering', 'Engineering Toolbelt', 40);
