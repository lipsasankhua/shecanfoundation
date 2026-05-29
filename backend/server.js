// server.js — She Can Foundation API
// Endpoints:
//   POST /api/volunteer        → submit volunteer application
//   POST /api/admin/login      → admin login (returns session token)
//   GET  /api/applications     → list all applications (admin only)
//   PATCH /api/applications/:id → update status (admin only)

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const db      = require('./db');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: '*', // restrict to your domain in production
}));
app.use(express.json());


// ── Simple token store (in-memory, fine for mini project) ──
// In production you would use JWT or sessions.
const activeSessions = new Set();

function generateToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function requireAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token || !activeSessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorised. Please log in.' });
  }
  next();
}


// ══════════════════════════════════════════════════════════
//  PUBLIC ROUTES
// ══════════════════════════════════════════════════════════

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'She Can Foundation API is running 🚀' });
});


// ── POST /api/volunteer ────────────────────────────────────
// Body: { firstName, lastName, email, phone, interest, availability, city, message }
app.post('/api/volunteer', (req, res) => {
  const {
    firstName, lastName, email,
    phone, interest, availability, city, message,
  } = req.body;

  // Basic server-side validation
  if (!firstName || !lastName || !email || !interest) {
    return res.status(400).json({
      error: 'firstName, lastName, email and interest are required.',
    });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO volunteers
        (first_name, last_name, email, phone, interest, availability, city, message)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      firstName.trim(),
      lastName.trim(),
      email.trim().toLowerCase(),
      phone    || '',
      interest,
      availability || '',
      city     || '',
      message  || '',
    );

    res.status(201).json({
      message: 'Application submitted successfully!',
      id: result.lastInsertRowid,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});


// ── POST /api/admin/login ──────────────────────────────────
// Body: { username, password }
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const admin = db.prepare(
    'SELECT * FROM admins WHERE username = ? AND password = ?'
  ).get(username, password);

  if (!admin) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const token = generateToken();
  activeSessions.add(token);

  // Token expires after 2 hours
  setTimeout(() => activeSessions.delete(token), 2 * 60 * 60 * 1000);

  res.json({ message: 'Login successful.', token });
});


// ══════════════════════════════════════════════════════════
//  ADMIN ROUTES (require x-admin-token header)
// ══════════════════════════════════════════════════════════

// ── GET /api/applications ──────────────────────────────────
// Optional query params: ?status=pending|approved|rejected
app.get('/api/applications', requireAuth, (req, res) => {
  const { status } = req.query;

  let query = 'SELECT * FROM volunteers ORDER BY created_at DESC';
  let rows;

  if (status && ['pending','approved','rejected'].includes(status)) {
    query = 'SELECT * FROM volunteers WHERE status = ? ORDER BY created_at DESC';
    rows  = db.prepare(query).all(status);
  } else {
    rows = db.prepare(query).all();
  }

  res.json({ total: rows.length, applications: rows });
});


// ── PATCH /api/applications/:id ────────────────────────────
// Body: { status: "approved" | "rejected" | "pending" }
app.patch('/api/applications/:id', requireAuth, (req, res) => {
  const { id }     = req.params;
  const { status } = req.body;

  if (!['pending','approved','rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be pending, approved, or rejected.' });
  }

  const result = db.prepare(
    'UPDATE volunteers SET status = ? WHERE id = ?'
  ).run(status, id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  res.json({ message: `Status updated to "${status}".` });
});


// ── DELETE /api/applications/:id ───────────────────────────
app.delete('/api/applications/:id', requireAuth, (req, res) => {
  const { id } = req.params;

  const result = db.prepare('DELETE FROM volunteers WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  res.json({ message: 'Application deleted.' });
});


// ── POST /api/admin/logout ─────────────────────────────────
app.post('/api/admin/logout', requireAuth, (req, res) => {
  const token = req.headers['x-admin-token'];
  activeSessions.delete(token);
  res.json({ message: 'Logged out.' });
});


// ── Start server ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 She Can Foundation API running at http://localhost:${PORT}`);
  console.log(`📋 Admin login: POST http://localhost:${PORT}/api/admin/login`);
  console.log(`   Default credentials → username: admin  password: shecan2025\n`);
});