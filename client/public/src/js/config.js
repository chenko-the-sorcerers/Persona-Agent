// ═══════════════════════════════════════════════════════════
// FRONTEND CONFIGURATION
// ═══════════════════════════════════════════════════════════

/**
 * Application Configuration
 */
const CONFIG = {
  // App Info
  app: {
    name: 'Arutala Persona Agent',
    version: '1.0.0',
    description: 'Pilih Gaya Bicaramu - 21 Persona AI untuk Keberagaman Bahasa Indonesia'
  },

  // API Configuration
  api: {
    baseURL: window.location.hostname === 'localhost' 
      ? 'http://localhost:3000/api'
      : '/api',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },

  // Feature Flags
  features: {
    authentication: true,
    analytics: true,
    streaming: true,
    favorites: true,
    history: true,
    offlineMode: false
  },

  // UI Configuration
  ui: {
    theme: 'light',
    animations: true,
    soundEffects: false,
    notifications: true,
    autoScroll: true
  },

  // Chat Configuration
  chat: {
    maxMessageLength: 2000,
    typingIndicatorDelay: 500,
    messageRetention: 100, // Keep last 100 messages in memory
    autoSaveInterval: 30000, // 30 seconds
    defaultPersonaId: 3 // Non-Baku Harian
  },

  // Analytics Configuration
  analytics: {
    enabled: true,
    trackingId: 'UA-XXXXXXXXX-X', // Replace with actual GA ID
    events: {
      pageView: true,
      personaSwitch: true,
      messageSent: true,
      favorite: true,
      share: true
    }
  },

  // Storage Configuration
  storage: {
    prefix: 'arutala_',
    keys: {
      auth: 'auth_token',
      favorites: 'persona_favorites',
      usage: 'persona_usage',
      preferences: 'user_preferences',
      conversations: 'conversations',
      theme: 'theme_preference'
    }
  },

  // Persona Categories
  categories: {
    indonesia: {
      name: 'Bahasa Indonesia',
      ids: [1, 2, 3, 4, 5, 6, 7, 8],
      color: '#6366f1',
      icon: '🇮🇩'
    },
    jawa: {
      name: 'Bahasa Jawa & Osing',
      ids: [9, 10, 11, 12, 13, 14, 15, 16],
      color: '#f59e0b',
      icon: '🎭'
    },
    campuran: {
      name: 'Campuran / Mixed',
      ids: [17, 18],
      color: '#10b981',
      icon: '🌐'
    },
    sunda: {
      name: 'Sunda & Perbatasan',
      ids: [19, 20, 21],
      color: '#06b6d4',
      icon: '🏔️'
    }
  },

  // Routes
  routes: {
    home: 'index.html',
    chat: 'chatbot.html',
    about: 'about.html',
    login: 'login.html',
    dashboard: 'dashboard.html'
  },

  // Social Links
  social: {
    website: 'https://www.arutalaaksara.com',
    github: null,
    twitter: null,
    instagram: null
  },

  // Validation Rules
  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecial: false
    },
    message: {
      minLength: 1,
      maxLength: 2000
    }
  },

  // Error Messages
  errors: {
    network: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
    timeout: 'Permintaan terlalu lama. Silakan coba lagi.',
    unauthorized: 'Sesi Anda telah berakhir. Silakan login kembali.',
    notFound: 'Data tidak ditemukan.',
    serverError: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
    validation: 'Data yang Anda masukkan tidak valid.',
    unknown: 'Terjadi kesalahan yang tidak diketahui.'
  },

  // Success Messages
  success: {
    login: 'Berhasil masuk!',
    logout: 'Berhasil keluar.',
    register: 'Akun berhasil dibuat!',
    update: 'Data berhasil diperbarui.',
    delete: 'Data berhasil dihapus.',
    save: 'Perubahan berhasil disimpan.',
    copy: 'Berhasil disalin ke clipboard!'
  }
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
