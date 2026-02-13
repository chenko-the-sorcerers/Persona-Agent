-- ================================================================
-- ARUTALA PERSONA AGENT — DATABASE SCHEMA
-- Database: SQLite (development) / PostgreSQL (production)
-- ================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,           -- bcrypt hash
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar      TEXT,
  is_active   INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Sessions table (JWT blacklist / active sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,    -- SHA-256 hash of JWT
  ip_address  TEXT,
  user_agent  TEXT,
  expires_at  TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id     TEXT REFERENCES users(id) ON DELETE SET NULL,
  persona_id  INTEGER NOT NULL,
  session_key TEXT,                    -- anonymous session key if no user_id
  started_at  TEXT NOT NULL DEFAULT (datetime('now')),
  ended_at    TEXT,
  message_count INTEGER NOT NULL DEFAULT 0
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content         TEXT NOT NULL,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id     TEXT REFERENCES users(id) ON DELETE SET NULL,
  event_type  TEXT NOT NULL,
  event_data  TEXT,                    -- JSON string
  ip_address  TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email     ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_user   ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_hash   ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_conv_user       ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conv_persona    ON conversations(persona_id);
CREATE INDEX IF NOT EXISTS idx_msg_conv        ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_analytics_type  ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_date  ON analytics_events(created_at);

-- ================================================================
-- SEED DATA — Default Admin Account
-- Password: admin123  (change immediately in production!)
-- Hash generated with: bcrypt.hashSync('admin123', 12)
-- ================================================================
INSERT OR IGNORE INTO users (id, name, email, password, role)
VALUES (
  'admin_000000000000000000000000000001',
  'Admin Arutala',
  'admin@arutala.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lsb5KJNzBnQAuqfUS',
  'admin'
);
