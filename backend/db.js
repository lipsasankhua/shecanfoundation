// db.js — creates and initialises the SQLite database
// The file "shecan.db" is auto-created in the backend folder on first run.

const Database = require('better-sqlite3');
const path     = require('path');

const db = new Database(path.join(__dirname, 'shecan.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// ── Create tables ──────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS volunteers (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name   TEXT    NOT NULL,
    last_name    TEXT    NOT NULL,
    email        TEXT    NOT NULL,
    phone        TEXT,
    interest     TEXT    NOT NULL,
    availability TEXT,
    city         TEXT,
    message      TEXT,
    status       TEXT    DEFAULT 'pending',   -- pending | approved | rejected
    created_at   TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admins (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    username     TEXT    NOT NULL UNIQUE,
    password     TEXT    NOT NULL             -- plain text for simplicity (mini project)
  );
`);

// ── Seed a default admin if none exists ───────────────────
// Change these credentials in your .env file
const existing = db.prepare('SELECT id FROM admins WHERE username = ?').get('admin');
if (!existing) {
  db.prepare(`
    INSERT INTO admins (username, password) VALUES (?, ?)
  `).run(
    process.env.ADMIN_USER || 'admin',
    process.env.ADMIN_PASS || 'shecan2025'
  );
  console.log('✅ Default admin created: admin / shecan2025');
}

module.exports = db;