// ============================================================
// INIT DB SCRIPT — Creates tables and seeds default admin
// Run with: node scripts/init-db.js
// ============================================================
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { getDb } = require('../config/database');

async function initDb() {
  console.log('🔧 Initializing database...\n');

  const db = getDb();

  const adminEmail    = process.env.ADMIN_EMAIL    || 'admin@arutala.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName     = process.env.ADMIN_NAME     || 'Admin Arutala';

  // Check if admin already exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);

  if (existing) {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`);
  } else {
    const hash = await bcrypt.hash(adminPassword, 12);
    const id   = crypto.randomBytes(16).toString('hex');

    db.prepare(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, 'admin')"
    ).run(id, adminName, adminEmail, hash);

    console.log(`✅ Admin created:`);
    console.log(`   Email   : ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   ⚠️  Change this password in production!\n`);
  }

  console.log('✅ Database initialization complete!');
  process.exit(0);
}

initDb().catch(err => {
  console.error('❌ Init error:', err);
  process.exit(1);
});
