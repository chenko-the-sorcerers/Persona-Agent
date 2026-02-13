// ============================================================
// DATABASE CONFIG — better-sqlite3 (synchronous, zero-config)
// ============================================================
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../database/arutala.db');
const SCHEMA_PATH = path.join(__dirname, '../../database/schema.sql');

let db;

/**
 * Get (or create) the database connection.
 * Called once on startup; subsequent calls return the cached instance.
 */
function getDb() {
  if (db) return db;

  // Ensure db directory exists
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(DB_PATH, {
    verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
  });

  // WAL mode = faster concurrent reads
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Run schema (idempotent — uses CREATE IF NOT EXISTS)
  if (fs.existsSync(SCHEMA_PATH)) {
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    db.exec(schema);
    console.log('✅ Database schema applied');
  } else {
    console.warn('⚠️  Schema file not found at', SCHEMA_PATH);
  }

  console.log(`✅ Database connected: ${DB_PATH}`);
  return db;
}

module.exports = { getDb };
