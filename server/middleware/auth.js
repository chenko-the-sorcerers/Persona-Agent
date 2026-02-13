// ============================================================
// AUTH MIDDLEWARE — JWT verification
// ============================================================
const jwt = require('jsonwebtoken');
const { getDb } = require('../config/database');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

/**
 * Verify JWT and attach user to req.user
 * Returns 401 if token missing/invalid/expired
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Autentikasi diperlukan.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    
    // Look up user in DB (ensures user still exists and is active)
    const db = getDb();
    const user = db.prepare(
      'SELECT id, name, email, role, avatar, is_active FROM users WHERE id = ?'
    ).get(payload.sub);

    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: 'Sesi tidak valid.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Sesi kadaluarsa. Silakan login ulang.' });
    }
    return res.status(401).json({ success: false, message: 'Token tidak valid.' });
  }
}

/**
 * Same as requireAuth but only for admin role
 */
function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Akses ditolak. Admin only.' });
    }
    next();
  });
}

/**
 * Optional auth — attaches user if token present, but doesn't block
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : req.cookies?.token;

  if (!token) return next();

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const db = getDb();
    const user = db.prepare(
      'SELECT id, name, email, role, avatar, is_active FROM users WHERE id = ?'
    ).get(payload.sub);
    if (user && user.is_active) req.user = user;
  } catch (_) {/* ignore */}
  
  next();
}

module.exports = { requireAuth, requireAdmin, optionalAuth };
