// ═══════════════════════════════════════════════════════════
// API CLIENT - Backend Communication Layer
// ═══════════════════════════════════════════════════════════

/**
 * API Configuration
 */
const API_CONFIG = {
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : '/api',
  timeout: 30000, // 30 seconds for AI responses
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Get auth token from localStorage
 */
function getAuthToken() {
  return localStorage.getItem('auth_token');
}

/**
 * Set auth token to localStorage
 */
function setAuthToken(token) {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

/**
 * HTTP Request wrapper with error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json') 
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || data.error || 'Request failed',
        data: data
      };
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw { status: 408, message: 'Request timeout' };
    }
    
    console.error('API Request Error:', error);
    throw error;
  }
}

/**
 * API Methods
 */
const API = {
  
  // ===== AUTH =====
  
  auth: {
    /**
     * Login user
     */
    login: async (email, password) => {
      return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    },

    /**
     * Register new user
     */
    register: async (name, email, password) => {
      return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
    },

    /**
     * Logout user
     */
    logout: async () => {
      const result = await request('/auth/logout', { method: 'POST' });
      setAuthToken(null);
      return result;
    },

    /**
     * Get current user info
     */
    me: async () => {
      return request('/auth/me');
    }
  },

  // ===== PERSONAS =====
  
  personas: {
    /**
     * Get all personas
     */
    getAll: async () => {
      return request('/personas');
    },

    /**
     * Get single persona by ID
     */
    getById: async (id) => {
      return request(`/personas/${id}`);
    },

    /**
     * Get personas by category
     */
    getByCategory: async (category) => {
      return request(`/personas/category/${category}`);
    }
  },

  // ===== CHAT =====
  
  chat: {
    /**
     * Send message to AI
     */
    sendMessage: async (personaId, message, conversationId = null) => {
      return request('/chat/message', {
        method: 'POST',
        body: JSON.stringify({
          persona_id: personaId,
          message: message,
          conversation_id: conversationId
        })
      });
    },

    /**
     * Stream message from AI (for real-time responses)
     */
    streamMessage: async (personaId, message, conversationId = null, onChunk) => {
      const url = `${API_CONFIG.baseURL}/chat/stream`;
      const token = getAuthToken();

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...API_CONFIG.headers,
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          persona_id: personaId,
          message: message,
          conversation_id: conversationId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw { status: response.status, message: error.message || 'Stream failed' };
      }

      // Read the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                return;
              }
              try {
                const parsed = JSON.parse(data);
                if (onChunk) onChunk(parsed);
              } catch (e) {
                console.error('Failed to parse chunk:', e);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    },

    /**
     * Get conversation history
     */
    getConversation: async (conversationId) => {
      return request(`/chat/conversation/${conversationId}`);
    },

    /**
     * Get user's conversations
     */
    getConversations: async () => {
      return request('/chat/conversations');
    },

    /**
     * Delete conversation
     */
    deleteConversation: async (conversationId) => {
      return request(`/chat/conversation/${conversationId}`, {
        method: 'DELETE'
      });
    }
  },

  // ===== ANALYTICS =====
  
  analytics: {
    /**
     * Track event
     */
    track: async (eventName, eventData) => {
      return request('/analytics/track', {
        method: 'POST',
        body: JSON.stringify({
          event_name: eventName,
          event_data: eventData,
          timestamp: new Date().toISOString()
        })
      });
    }
  },

  // ===== USER =====
  
  user: {
    /**
     * Get user profile
     */
    getProfile: async () => {
      return request('/user/profile');
    },

    /**
     * Update user profile
     */
    updateProfile: async (data) => {
      return request('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },

    /**
     * Get user statistics
     */
    getStats: async () => {
      return request('/user/stats');
    }
  }
};

/**
 * Error handling helper
 */
function handleAPIError(error) {
  if (error.status === 401) {
    // Unauthorized - redirect to login
    setAuthToken(null);
    window.location.href = '/login.html';
    return 'Session expired. Please login again.';
  } else if (error.status === 403) {
    return 'You do not have permission to perform this action.';
  } else if (error.status === 404) {
    return 'Resource not found.';
  } else if (error.status === 408) {
    return 'Request timeout. Please try again.';
  } else if (error.status === 429) {
    return 'Too many requests. Please slow down.';
  } else if (error.status >= 500) {
    return 'Server error. Please try again later.';
  } else {
    return error.message || 'An error occurred. Please try again.';
  }
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
  return !!getAuthToken();
}

/**
 * Require authentication (redirect if not logged in)
 */
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
    return false;
  }
  return true;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API, handleAPIError, isAuthenticated, requireAuth, setAuthToken, getAuthToken };
}
