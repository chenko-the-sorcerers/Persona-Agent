// ═══════════════════════════════════════════════════════════
// HELPER UTILITIES
// ═══════════════════════════════════════════════════════════

/**
 * Storage Helper
 */
const storage = {
  /**
   * Get item from localStorage
   */
  get(key) {
    try {
      const item = localStorage.getItem(CONFIG.storage.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  /**
   * Set item to localStorage
   */
  set(key, value) {
    try {
      localStorage.setItem(CONFIG.storage.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key) {
    try {
      localStorage.removeItem(CONFIG.storage.prefix + key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },

  /**
   * Clear all app data from localStorage
   */
  clear() {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CONFIG.storage.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }
};

/**
 * URL Helper
 */
const urlHelper = {
  /**
   * Get query parameter from URL
   */
  getParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  },

  /**
   * Get all query parameters
   */
  getAllParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  },

  /**
   * Set query parameter
   */
  setParam(name, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
  },

  /**
   * Remove query parameter
   */
  removeParam(name) {
    const url = new URL(window.location.href);
    url.searchParams.delete(name);
    window.history.pushState({}, '', url);
  },

  /**
   * Navigate to URL with params
   */
  navigate(path, params = {}) {
    const url = new URL(path, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.location.href = url.toString();
  }
};

/**
 * Date Helper
 */
const dateHelper = {
  /**
   * Format date to Indonesian locale
   */
  format(date, format = 'full') {
    const d = new Date(date);
    const options = {
      full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      long: { year: 'numeric', month: 'long', day: 'numeric' },
      short: { year: 'numeric', month: 'short', day: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit' },
      datetime: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    };
    
    return new Intl.DateTimeFormat('id-ID', options[format] || options.long).format(d);
  },

  /**
   * Get relative time (e.g., "2 jam yang lalu")
   */
  relative(date) {
    const now = new Date();
    const then = new Date(date);
    const diff = now - then;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} tahun yang lalu`;
    if (months > 0) return `${months} bulan yang lalu`;
    if (days > 0) return `${days} hari yang lalu`;
    if (hours > 0) return `${hours} jam yang lalu`;
    if (minutes > 0) return `${minutes} menit yang lalu`;
    if (seconds > 10) return `${seconds} detik yang lalu`;
    return 'Baru saja';
  },

  /**
   * Check if date is today
   */
  isToday(date) {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  },

  /**
   * Check if date is yesterday
   */
  isYesterday(date) {
    const d = new Date(date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return d.toDateString() === yesterday.toDateString();
  }
};

/**
 * Validation Helper
 */
const validator = {
  /**
   * Validate email
   */
  email(email) {
    return CONFIG.validation.email.test(email);
  },

  /**
   * Validate password
   */
  password(password) {
    const rules = CONFIG.validation.password;
    const errors = [];

    if (password.length < rules.minLength) {
      errors.push(`Password minimal ${rules.minLength} karakter`);
    }
    if (rules.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password harus mengandung huruf besar');
    }
    if (rules.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password harus mengandung huruf kecil');
    }
    if (rules.requireNumber && !/\d/.test(password)) {
      errors.push('Password harus mengandung angka');
    }
    if (rules.requireSpecial && !/[!@#$%^&*]/.test(password)) {
      errors.push('Password harus mengandung karakter spesial');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Validate message length
   */
  message(message) {
    const rules = CONFIG.validation.message;
    const length = message.trim().length;

    if (length < rules.minLength) {
      return { valid: false, error: 'Pesan tidak boleh kosong' };
    }
    if (length > rules.maxLength) {
      return { valid: false, error: `Pesan maksimal ${rules.maxLength} karakter` };
    }

    return { valid: true };
  },

  /**
   * Validate required field
   */
  required(value) {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  }
};

/**
 * Text Helper
 */
const textHelper = {
  /**
   * Truncate text
   */
  truncate(text, length = 100, suffix = '...') {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + suffix;
  },

  /**
   * Capitalize first letter
   */
  capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  /**
   * Title case
   */
  titleCase(text) {
    return text.split(' ')
      .map(word => this.capitalize(word))
      .join(' ');
  },

  /**
   * Slugify text
   */
  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  /**
   * Escape HTML
   */
  escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Strip HTML tags
   */
  stripHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  },

  /**
   * Count words
   */
  wordCount(text) {
    return text.trim().split(/\s+/).length;
  }
};

/**
 * Number Helper
 */
const numberHelper = {
  /**
   * Format number with thousand separators
   */
  format(num) {
    return new Intl.NumberFormat('id-ID').format(num);
  },

  /**
   * Format currency (IDR)
   */
  currency(num) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  },

  /**
   * Format percentage
   */
  percentage(num, decimals = 0) {
    return (num * 100).toFixed(decimals) + '%';
  },

  /**
   * Abbreviate large numbers (e.g., 1.2K, 3.4M)
   */
  abbreviate(num) {
    if (num < 1000) return num.toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    return (num / 1000000000).toFixed(1) + 'B';
  }
};

/**
 * Device Helper
 */
const deviceHelper = {
  /**
   * Check if mobile device
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  /**
   * Check if tablet
   */
  isTablet() {
    return /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent);
  },

  /**
   * Check if desktop
   */
  isDesktop() {
    return !this.isMobile() && !this.isTablet();
  },

  /**
   * Get viewport size
   */
  getViewport() {
    return {
      width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
  },

  /**
   * Check if online
   */
  isOnline() {
    return navigator.onLine;
  }
};

// Export all helpers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    storage,
    urlHelper,
    dateHelper,
    validator,
    textHelper,
    numberHelper,
    deviceHelper
  };
}
