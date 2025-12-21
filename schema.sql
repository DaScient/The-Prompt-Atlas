-- Prompt Atlas: D1 Schema
-- Run this once to initialize your persistent store.

PRAGMA foreign_keys = ON;

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort INTEGER DEFAULT 0
);

-- Prompts
CREATE TABLE IF NOT EXISTS prompts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  FOREIGN KEY(category) REFERENCES categories(id)
);

CREATE INDEX IF NOT EXISTS idx_prompts_category
ON prompts(category);

CREATE INDEX IF NOT EXISTS idx_prompts_created
ON prompts(created_at DESC);

-- Lineage: threads & nodes
CREATE TABLE IF NOT EXISTS lineage_threads (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS lineage_nodes (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL,
  parent_id TEXT,
  prompt TEXT NOT NULL,
  summary TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  FOREIGN KEY(thread_id) REFERENCES lineage_threads(id),
  FOREIGN KEY(parent_id) REFERENCES lineage_nodes(id)
);

CREATE INDEX IF NOT EXISTS idx_lineage_thread
ON lineage_nodes(thread_id);

CREATE INDEX IF NOT EXISTS idx_lineage_parent
ON lineage_nodes(parent_id);
