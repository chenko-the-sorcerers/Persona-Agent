// ═══════════════════════════════════════════════════════════
// MAIN - Global Utilities & Initialization
// ═══════════════════════════════════════════════════════════

/**
 * Global App Configuration
 */
window.APP_CONFIG = {
  name: 'Arutala Persona Agent',
  version: '1.0.0',
  environment: window.location.hostname === 'localhost' ? 'development' : 'production',
  features: {
    analytics: true,
    authentication: true,
    streaming: true
  }
};

/**
 * Toast Notification System
 */
class ToastManager {
  constructor() {
    this.container = this.createContainer();
  }

  createContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(container);
    }
    return container;
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };

    toast.style.cssText = `
      background: white;
      border-left: 4px solid ${colors[type]};
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 300px;
      max-width: 400px;
      animation: slideIn 0.3s ease;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
    `;

    toast.innerHTML = `
      <span style="font-size: 20px;">${icons[type]}</span>
      <span style="flex: 1; color: #1f2937;">${message}</span>
      <button onclick="this.parentElement.remove()" style="
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        font-size: 20px;
        line-height: 1;
        padding: 0;
      ">×</button>
    `;

    this.container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  success(message, duration) {
    this.show(message, 'success', duration);
  }

  error(message, duration) {
    this.show(message, 'error', duration);
  }

  warning(message, duration) {
    this.show(message, 'warning', duration);
  }

  info(message, duration) {
    this.show(message, 'info', duration);
  }
}

// Add toast animations
if (!document.getElementById('toast-styles')) {
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Global toast instance
window.toast = new ToastManager();

/**
 * Loading Spinner Manager
 */
class LoadingManager {
  constructor() {
    this.overlay = null;
  }

  show(message = 'Loading...') {
    this.hide(); // Remove any existing overlay

    this.overlay = document.createElement('div');
    this.overlay.id = 'loading-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(4px);
    `;

    this.overlay.innerHTML = `
      <div style="
        background: white;
        padding: 32px 48px;
        border-radius: 16px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      ">
        <div class="loading-spinner" style="
          width: 48px;
          height: 48px;
          border: 4px solid #e5e7eb;
          border-top-color: #0891b2;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        "></div>
        <p style="
          margin: 0;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          color: #1f2937;
          font-size: 16px;
        ">${message}</p>
      </div>
    `;

    document.body.appendChild(this.overlay);

    // Add spin animation if not exists
    if (!document.getElementById('spin-animation')) {
      const style = document.createElement('style');
      style.id = 'spin-animation';
      style.textContent = `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  hide() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
  }
}

// Global loading instance
window.loading = new LoadingManager();

/**
 * Utility Functions
 */
window.utils = {
  /**
   * Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Copy text to clipboard
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
      return true;
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy');
      return false;
    }
  },

  /**
   * Format number with separators
   */
  formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
  },

  /**
   * Format date
   */
  formatDate(date, options = {}) {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(new Date(date));
  },

  /**
   * Format relative time (e.g., "2 minutes ago")
   */
  formatRelativeTime(date) {
    const now = new Date();
    const then = new Date(date);
    const diff = now - then;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} hari yang lalu`;
    if (hours > 0) return `${hours} jam yang lalu`;
    if (minutes > 0) return `${minutes} menit yang lalu`;
    return 'Baru saja';
  },

  /**
   * Truncate text
   */
  truncate(text, length = 100) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  },

  /**
   * Generate random ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * Check if mobile device
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  /**
   * Scroll to element smoothly
   */
  scrollTo(element, offset = 0) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

/**
 * Global Error Handler
 */
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  if (window.APP_CONFIG.environment === 'production') {
    // In production, show user-friendly message
    toast.error('Something went wrong. Please try again.');
  }
});

/**
 * Global Unhandled Promise Rejection Handler
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  if (window.APP_CONFIG.environment === 'production') {
    toast.error('An unexpected error occurred.');
  }
});

/**
 * Performance Monitoring
 */
if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      
      if (typeof trackEvent === 'function') {
        trackEvent('page_load_time', {
          load_time: loadTime,
          page: window.location.pathname
        });
      }
      
      console.log(`Page loaded in ${loadTime}ms`);
    }, 0);
  });
}

/**
 * Initialize App
 */
function initializeApp() {
  console.log(`🚀 ${window.APP_CONFIG.name} v${window.APP_CONFIG.version}`);
  console.log(`📍 Environment: ${window.APP_CONFIG.environment}`);

  // Add mobile viewport meta tag if missing
  if (!document.querySelector('meta[name="viewport"]')) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(meta);
  }

  // Initialize persona selector if exists
  const personaSelect = document.getElementById('persona-select');
  if (personaSelect && typeof populatePersonaSelector === 'function') {
    populatePersonaSelector(personaSelect, { 
      groupByCategory: true,
      includeAll: false 
    });
  }

  console.log('✅ App initialized');
}

// Run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
