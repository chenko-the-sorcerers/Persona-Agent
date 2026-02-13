// ============================================================
// AUTH SERVICE — Real API (no more mock)
// Connects to /api/auth/* endpoints
// ============================================================

(function () {
    'use strict';
  
    const API_BASE = (typeof CONFIG !== 'undefined' && CONFIG.api?.baseURL)
      ? CONFIG.api.baseURL
      : (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api');
  
    const TOKEN_KEY = 'arutala_token';
    const USER_KEY  = 'arutala_user';
  
    // ── Helpers ────────────────────────────────────────────────
    function saveAuth(token, user) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  
    function clearAuth() {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
    }
  
    function getToken() {
      return localStorage.getItem(TOKEN_KEY);
    }
  
    function getStoredUser() {
      try {
        return JSON.parse(localStorage.getItem(USER_KEY));
      } catch (_) {
        return null;
      }
    }
  
    async function apiFetch(endpoint, options = {}) {
      const token = getToken();
      const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
      if (token) headers['Authorization'] = `Bearer ${token}`;
  
      const res = await fetch(API_BASE + endpoint, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
  
      const data = await res.json().catch(() => ({ success: false, message: 'Server error' }));
  
      if (res.status === 401) {
        clearAuth();
      }
  
      if (!res.ok && !data.success) {
        throw new Error(data.message || `HTTP ${res.status}`);
      }
  
      return data;
    }
  
    // ── AuthService object ─────────────────────────────────────
    const authService = {
      // ── State ─────────────────────────────────────────────
      _token: getToken(),
      _user:  getStoredUser(),
  
      // ── Getters ───────────────────────────────────────────
      getToken()  { return this._token; },
      getUser()   { return this._user; },
      isAuthenticated() { return !!(this._token && this._user); },
      isAdmin()   { return this._user?.role === 'admin'; },
  
      // ── setAuth / clearAuth ───────────────────────────────
      setAuth(token, user) {
        this._token = token;
        this._user  = user;
        saveAuth(token, user);
      },
      clearAuth() {
        this._token = null;
        this._user  = null;
        clearAuth();
      },
  
      // ── Register ──────────────────────────────────────────
      async register(name, email, password) {
        try {
          const data = await apiFetch('/auth/register', {
            method: 'POST',
            body: { name, email, password },
          });
          if (data.success) {
            this.setAuth(data.token, data.user);
            if (window.toast) window.toast.success('Akun berhasil dibuat!');
          }
          return data;
        } catch (err) {
          return { success: false, message: err.message };
        }
      },
  
      // ── Login (user) ──────────────────────────────────────
      async login(email, password) {
        try {
          const data = await apiFetch('/auth/login', {
            method: 'POST',
            body: { email, password },
          });
          if (data.success) {
            this.setAuth(data.token, data.user);
            if (window.toast) window.toast.success('Berhasil masuk!');
          }
          return data;
        } catch (err) {
          return { success: false, message: err.message };
        }
      },
  
      // ── Admin login ───────────────────────────────────────
      async adminLogin(email, password) {
        try {
          const data = await apiFetch('/auth/admin/login', {
            method: 'POST',
            body: { email, password },
          });
          if (data.success) {
            this.setAuth(data.token, data.user);
          }
          return data;
        } catch (err) {
          return { success: false, message: err.message };
        }
      },
  
      // ── Logout ────────────────────────────────────────────
      async logout() {
        try {
          await apiFetch('/auth/logout', { method: 'POST' });
        } catch (_) {/* ignore */}
        this.clearAuth();
        if (window.toast) window.toast.success('Berhasil logout.');
      },
  
      // ── Validate token (optional check on page load) ──────
      async validateToken() {
        if (!this._token) return false;
        try {
          const data = await apiFetch('/auth/validate', { method: 'POST' });
          if (data.success) {
            this._user = data.user;
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          }
          return data.success;
        } catch (_) {
          this.clearAuth();
          return false;
        }
      },
  
      // ── Redirect guards ───────────────────────────────────
      requireAuth(loginUrl) {
        if (!this.isAuthenticated()) {
          const dest = loginUrl || this._resolveLoginUrl();
          window.location.href = dest;
          return false;
        }
        return true;
      },
  
      requireAdmin() {
        if (!this.isAuthenticated() || !this.isAdmin()) {
          window.location.href = '/403.html';
          return false;
        }
        return true;
      },
  
      // ── Internal helper: figure out correct login url ─────
      _resolveLoginUrl() {
        const p = window.location.pathname;
        if (p.includes('/admin/')) return '../admin/admin-login.html';
        if (p.includes('/src/pages/')) return 'login.html';
        return 'src/pages/login.html';
      },
    };
  
    // ── Legacy helpers (used by old pages) ────────────────────
    window.isAuthenticated = () => authService.isAuthenticated();
    window.login = async (email, password) => {
      const r = await authService.login(email, password);
      return r.success;
    };
    window.logout = async () => authService.logout();
  
    // ── Export global ──────────────────────────────────────────
    window.authService = authService;
  
    console.log('🔐 Auth service ready', authService.isAuthenticated() ? '(logged in)' : '(logged out)');
  })();
  