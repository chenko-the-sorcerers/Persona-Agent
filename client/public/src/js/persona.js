// ═══════════════════════════════════════════════════════════
// PERSONA MANAGER - Persona Management & Utilities
// ═══════════════════════════════════════════════════════════

/**
 * Persona Manager Class
 */
class PersonaManager {
  constructor() {
    this.personas = personas || {};
    this.favorites = this.loadFavorites();
  }

  /**
   * Get persona by ID
   */
  getPersona(id) {
    return this.personas[id] || null;
  }

  /**
   * Get all personas
   */
  getAllPersonas() {
    return Object.entries(this.personas).map(([id, persona]) => ({
      id: Number(id),
      ...persona
    }));
  }

  /**
   * Get personas by category
   */
  getPersonasByCategory(category) {
    const categoryMap = {
      'indonesia': [1, 2, 3, 4, 5, 6, 7, 8],
      'jawa': [9, 10, 11, 12, 13, 14, 15, 16],
      'campuran': [17, 18],
      'sunda': [19, 20, 21]
    };

    const ids = categoryMap[category] || [];
    return ids.map(id => ({ id, ...this.personas[id] })).filter(p => p.name);
  }

  /**
   * Search personas by keyword
   */
  searchPersonas(keyword) {
    const query = keyword.toLowerCase();
    return this.getAllPersonas().filter(persona => 
      persona.name.toLowerCase().includes(query) ||
      persona.region.toLowerCase().includes(query) ||
      persona.desc.toLowerCase().includes(query)
    );
  }

  /**
   * Get random persona
   */
  getRandomPersona() {
    const ids = Object.keys(this.personas);
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    return {
      id: Number(randomId),
      ...this.personas[randomId]
    };
  }

  /**
   * Add to favorites
   */
  addFavorite(personaId) {
    if (!this.favorites.includes(personaId)) {
      this.favorites.push(personaId);
      this.saveFavorites();
      
      // Track favorite event
      if (typeof trackEvent === 'function') {
        trackEvent('persona_favorite', personaId);
      }
      
      return true;
    }
    return false;
  }

  /**
   * Remove from favorites
   */
  removeFavorite(personaId) {
    const index = this.favorites.indexOf(personaId);
    if (index > -1) {
      this.favorites.splice(index, 1);
      this.saveFavorites();
      
      // Track unfavorite event
      if (typeof trackEvent === 'function') {
        trackEvent('persona_unfavorite', personaId);
      }
      
      return true;
    }
    return false;
  }

  /**
   * Toggle favorite
   */
  toggleFavorite(personaId) {
    if (this.isFavorite(personaId)) {
      return this.removeFavorite(personaId);
    } else {
      return this.addFavorite(personaId);
    }
  }

  /**
   * Check if persona is favorite
   */
  isFavorite(personaId) {
    return this.favorites.includes(Number(personaId));
  }

  /**
   * Get favorite personas
   */
  getFavorites() {
    return this.favorites
      .map(id => ({ id, ...this.personas[id] }))
      .filter(p => p.name);
  }

  /**
   * Load favorites from localStorage
   */
  loadFavorites() {
    try {
      const stored = localStorage.getItem('persona_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load favorites:', error);
      return [];
    }
  }

  /**
   * Save favorites to localStorage
   */
  saveFavorites() {
    try {
      localStorage.setItem('persona_favorites', JSON.stringify(this.favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }

  /**
   * Get persona statistics
   */
  getStats() {
    return {
      total: Object.keys(this.personas).length,
      indonesia: this.getPersonasByCategory('indonesia').length,
      jawa: this.getPersonasByCategory('jawa').length,
      campuran: this.getPersonasByCategory('campuran').length,
      sunda: this.getPersonasByCategory('sunda').length,
      favorites: this.favorites.length
    };
  }

  /**
   * Get category name
   */
  getCategoryName(personaId) {
    const id = Number(personaId);
    if (id >= 1 && id <= 8) return 'Bahasa Indonesia';
    if (id >= 9 && id <= 16) return 'Bahasa Jawa & Osing';
    if (id >= 17 && id <= 18) return 'Campuran / Mixed';
    if (id >= 19 && id <= 21) return 'Sunda & Perbatasan';
    return 'Unknown';
  }

  /**
   * Get category color
   */
  getCategoryColor(personaId) {
    const id = Number(personaId);
    if (id >= 1 && id <= 8) return '#6366f1'; // Indigo
    if (id >= 9 && id <= 16) return '#f59e0b'; // Amber
    if (id >= 17 && id <= 18) return '#10b981'; // Green
    if (id >= 19 && id <= 21) return '#06b6d4'; // Cyan
    return '#64748b'; // Slate
  }
}

/**
 * Persona Usage Tracker
 */
class PersonaUsageTracker {
  constructor() {
    this.usage = this.loadUsage();
  }

  /**
   * Track persona usage
   */
  track(personaId) {
    const id = String(personaId);
    
    if (!this.usage[id]) {
      this.usage[id] = {
        count: 0,
        lastUsed: null,
        firstUsed: new Date().toISOString()
      };
    }

    this.usage[id].count++;
    this.usage[id].lastUsed = new Date().toISOString();
    
    this.saveUsage();
  }

  /**
   * Get usage count for persona
   */
  getCount(personaId) {
    const id = String(personaId);
    return this.usage[id]?.count || 0;
  }

  /**
   * Get most used personas
   */
  getMostUsed(limit = 5) {
    return Object.entries(this.usage)
      .map(([id, data]) => ({ id: Number(id), ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get recently used personas
   */
  getRecentlyUsed(limit = 5) {
    return Object.entries(this.usage)
      .map(([id, data]) => ({ id: Number(id), ...data }))
      .filter(p => p.lastUsed)
      .sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed))
      .slice(0, limit);
  }

  /**
   * Get total usage across all personas
   */
  getTotalUsage() {
    return Object.values(this.usage).reduce((sum, p) => sum + p.count, 0);
  }

  /**
   * Load usage from localStorage
   */
  loadUsage() {
    try {
      const stored = localStorage.getItem('persona_usage');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to load usage:', error);
      return {};
    }
  }

  /**
   * Save usage to localStorage
   */
  saveUsage() {
    try {
      localStorage.setItem('persona_usage', JSON.stringify(this.usage));
    } catch (error) {
      console.error('Failed to save usage:', error);
    }
  }

  /**
   * Clear all usage data
   */
  clearUsage() {
    this.usage = {};
    this.saveUsage();
  }
}

// Initialize global instances
const personaManager = new PersonaManager();
const usageTracker = new PersonaUsageTracker();

/**
 * Helper function to populate persona selector
 */
function populatePersonaSelector(selectElement, options = {}) {
  if (!selectElement) return;

  const {
    includeAll = false,
    selectedId = null,
    groupByCategory = true
  } = options;

  selectElement.innerHTML = '';

  if (includeAll) {
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = '-- Pilih Persona --';
    selectElement.appendChild(allOption);
  }

  if (groupByCategory) {
    const categories = [
      { name: 'Bahasa Indonesia', ids: [1, 2, 3, 4, 5, 6, 7, 8] },
      { name: 'Bahasa Jawa & Osing', ids: [9, 10, 11, 12, 13, 14, 15, 16] },
      { name: 'Campuran / Mixed', ids: [17, 18] },
      { name: 'Sunda & Perbatasan', ids: [19, 20, 21] }
    ];

    categories.forEach(category => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = category.name;

      category.ids.forEach(id => {
        const persona = personas[id];
        if (persona) {
          const option = document.createElement('option');
          option.value = id;
          option.textContent = `${persona.icon} ${persona.name} - ${persona.region}`;
          if (selectedId && Number(selectedId) === id) {
            option.selected = true;
          }
          optgroup.appendChild(option);
        }
      });

      selectElement.appendChild(optgroup);
    });
  } else {
    Object.entries(personas).forEach(([id, persona]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = `${persona.icon} ${persona.name} - ${persona.region}`;
      if (selectedId && Number(selectedId) === Number(id)) {
        option.selected = true;
      }
      selectElement.appendChild(option);
    });
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    PersonaManager, 
    PersonaUsageTracker,
    personaManager, 
    usageTracker,
    populatePersonaSelector
  };
}
