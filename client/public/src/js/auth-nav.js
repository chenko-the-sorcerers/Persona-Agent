// ============================================================
// AUTH NAV — Updates navbar login/logout links based on auth state
// Include AFTER auth.js on every page
// ============================================================
(function () {
    'use strict';
  
    function initAuthNav() {
      if (!window.authService) return;
  
      const isLoggedIn = authService.isAuthenticated();
      const user       = isLoggedIn ? authService.getUser() : null;
  
      // ── Find or create the auth slot in .nav-links ───────────
      // We look for an element with id="nav-auth-slot" first;
      // if not found we look for the static Login link and swap it.
      let slot = document.getElementById('nav-auth-slot');
  
      if (!slot) {
        // Try to find the static login link
        const loginLink = document.querySelector('.nav-links a[href*="login"]');
        if (loginLink) {
          slot = document.createElement('div');
          slot.id = 'nav-auth-slot';
          slot.style.display = 'contents';
          loginLink.parentNode.insertBefore(slot, loginLink);
          loginLink.remove();
        }
      }
  
      if (!slot) return; // No nav found
  
      if (isLoggedIn && user) {
        const name    = user.name || user.email.split('@')[0];
        const isAdmin = user.role === 'admin';
        const dashUrl = isAdmin
          ? (resolveRoot() + 'admin/dashboard.html')
          : (resolveRoot() + 'src/pages/dashboard.html');
  
        slot.innerHTML = `
          <a href="${dashUrl}" class="nav-link" style="
            background: rgba(8,145,178,.1);
            color: var(--primary);
            padding: 6px 14px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 13px;
          ">👤 ${escHtml(name)}</a>
          <button onclick="window.__authNavLogout()" style="
            background: none;
            border: 1.5px solid rgba(148,163,184,.5);
            color: var(--muted);
            padding: 6px 12px;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all .2s;
          " onmouseover="this.style.borderColor='#ef4444';this.style.color='#ef4444'"
             onmouseout="this.style.borderColor='rgba(148,163,184,.5)';this.style.color='var(--muted)'">
            Keluar
          </button>
        `;
      } else {
        const loginUrl = resolveRoot() + 'src/pages/login.html';
        slot.innerHTML = `<a href="${loginUrl}" class="nav-link">Login</a>`;
      }
  
      // Logout handler
      window.__authNavLogout = async function () {
        if (!confirm('Yakin ingin logout?')) return;
        await authService.logout();
        window.location.reload();
      };
    }
  
    // Figure out relative root path from current page
    function resolveRoot() {
      const path = window.location.pathname;
      if (path.includes('/admin/'))         return '../../';
      if (path.includes('/src/pages/'))     return '../../';
      return '';
    }
  
    function escHtml(str) {
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  
    // Run after DOM + auth is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAuthNav);
    } else {
      // auth.js may not be done yet — small delay
      setTimeout(initAuthNav, 50);
    }
  })();
  