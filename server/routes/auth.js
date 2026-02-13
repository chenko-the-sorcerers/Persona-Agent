// ============================================================
// AUTH ROUTES — /api/auth/*
// ============================================================
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getDb } = require('../config/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');
require('dotenv').config();

const JWT_SECRET  = process.env.JWT_SECRET  || 'dev_secret_change_me';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 12;

// ─────────────────────────────────────────────────────────────
// Helper: generate JWT
// ─────────────────────────────────────────────────────────────
function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

// ─────────────────────────────────────────────────────────────
// Helper: safe user object (no password)
// ─────────────────────────────────────────────────────────────
function safeUser(user) {
  const { password, reset_token, reset_token_expires, ...safe } = user;
  return safe;
}

// ─────────────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
    }

    const db = getDb();

    // Check duplicate email
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar.' });
    }

    const hash  = await bcrypt.hash(password, SALT_ROUNDS);
    const id    = crypto.randomBytes(16).toString('hex');

    db.prepare(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)'
    ).run(id, name.trim(), email.toLowerCase(), hash, 'user');

    const user  = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    const token = signToken(user);

    return res.status(201).json({ success: true, token, user: safeUser(user) });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error saat registrasi.' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
    }

    const db   = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND is_active = 1').get(email.toLowerCase());

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const token = signToken(user);
    return res.json({ success: true, token, user: safeUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error saat login.' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/auth/forgot-password
// ─────────────────────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email wajib diisi.' });
    }

    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND is_active = 1').get(email.toLowerCase());

    // Selalu return success untuk keamanan (tidak memberitahu apakah email ada atau tidak)
    if (!user) {
      return res.json({ 
        success: true, 
        message: 'Jika email terdaftar, link reset password akan dikirim.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now

    // Update user dengan reset token
    db.prepare(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?'
    ).run(resetToken, tokenExpiry, user.id);

    // TODO: Kirim email dengan link reset (untuk production)
    // Untuk development, kita log token
    console.log(`Reset token for ${email}: ${resetToken}`);
    console.log(`Reset link: http://localhost:3000/reset-password.html?token=${resetToken}`);

    return res.json({ 
      success: true, 
      message: 'Jika email terdaftar, link reset password akan dikirim.',
      // DEVELOPMENT ONLY - hapus di production
      devToken: resetToken 
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/auth/reset-password
// ─────────────────────────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token dan password baru wajib diisi.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
    }

    const db = getDb();
    const user = db.prepare(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > datetime("now")'
    ).get(token);

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token tidak valid atau sudah kadaluarsa.' });
    }

    // Hash password baru
    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password dan hapus reset token
    db.prepare(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?'
    ).run(hash, user.id);

    console.log(`Password reset successful for user: ${user.email}`);

    return res.json({ 
      success: true, 
      message: 'Password berhasil direset. Silakan login dengan password baru.' 
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/auth/admin/login
// ─────────────────────────────────────────────────────────────
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
    }

    const db   = getDb();
    const user = db.prepare(
      "SELECT * FROM users WHERE email = ? AND role = 'admin' AND is_active = 1"
    ).get(email.toLowerCase());

    if (!user) {
      return res.status(401).json({ success: false, message: 'Kredensial admin tidak valid.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Kredensial admin tidak valid.' });
    }

    const token = signToken(user);
    console.log(`🔐 Admin login: ${user.email}`);
    return res.json({ success: true, token, user: safeUser(user) });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ success: false, message: 'Server error saat admin login.' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/auth/validate  (requires auth header)
// ─────────────────────────────────────────────────────────────
router.post('/validate', requireAuth, (req, res) => {
  res.json({ success: true, user: safeUser(req.user) });
});

// ─────────────────────────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  // Stateless JWT — just acknowledge.  Client will clear storage.
  res.clearCookie('token');
  res.json({ success: true, message: 'Berhasil logout.' });
});

// ─────────────────────────────────────────────────────────────
// GET /api/auth/me  (current user info)
// ─────────────────────────────────────────────────────────────
router.get('/me', requireAuth, (req, res) => {
  res.json({ success: true, user: safeUser(req.user) });
});

// ─────────────────────────────────────────────────────────────
// GET /api/auth/users  (admin only — list all users)
// ─────────────────────────────────────────────────────────────
router.get('/users', requireAdmin, (req, res) => {
  const db    = getDb();
  const users = db.prepare(
    'SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC'
  ).all();
  res.json({ success: true, users });
});

// ─────────────────────────────────────────────────────────────
// GET /api/auth/stats  (admin only — dashboard stats)
// ─────────────────────────────────────────────────────────────
router.get('/stats', requireAdmin, (req, res) => {
  const db = getDb();

  const totalUsers    = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'user'").get().c;
  const totalMessages = db.prepare("SELECT COUNT(*) as c FROM messages").get().c;
  const totalConvs    = db.prepare("SELECT COUNT(*) as c FROM conversations").get().c;

  // Users registered in last 30 days per day
  const daily = db.prepare(`
    SELECT date(created_at) as day, COUNT(*) as count
    FROM users
    WHERE created_at >= datetime('now', '-30 days')
    GROUP BY day
    ORDER BY day ASC
  `).all();

  // Top 10 personas by conversation count
  const topPersonas = db.prepare(`
    SELECT persona_id, COUNT(*) as count
    FROM conversations
    GROUP BY persona_id
    ORDER BY count DESC
    LIMIT 10
  `).all();

  res.json({ success: true, stats: { totalUsers, totalMessages, totalConvs, daily, topPersonas } });
});

module.exports = router;