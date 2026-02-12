// Simple front-end–only "admin" auth.
// Catatan: ini hanya untuk menyembunyikan dashboard dari publik,
// BUKAN pengganti auth backend yang aman.

const AUTH_STORAGE_KEY = 'arutalaAdminSession';
const AUTH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari

// Ganti username / password ini sesuai kebutuhanmu.
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'arutala2026!';

function isAuthenticated() {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data.token || !data.createdAt) return false;
    const age = Date.now() - Number(data.createdAt);
    if (age > AUTH_MAX_AGE_MS) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function login(username, password) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const payload = {
        token: 'admin-' + Math.random().toString(36).slice(2),
        createdAt: Date.now(),
      };
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
    }
    return true;
  }
  return false;
}

function logout() {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

// Ekspos ke window
if (typeof window !== 'undefined') {
  window.isAuthenticated = isAuthenticated;
  window.login = login;
  window.logout = logout;
}

