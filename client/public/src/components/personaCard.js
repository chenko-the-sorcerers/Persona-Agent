// ═══════════════════════════════════════════════════════════
// PERSONA CARD COMPONENT
// ═══════════════════════════════════════════════════════════

/**
 * Persona Card Component
 * Reusable persona card for displaying persona information
 */
class PersonaCardComponent {
  constructor(personaId, options = {}) {
    this.personaId = personaId;
    this.persona = personas[personaId];
    this.options = {
      showFavorite: options.showFavorite !== false,
      showTryButton: options.showTryButton !== false,
      showStats: options.showStats || false,
      compact: options.compact || false,
      onClick: options.onClick || null,
      ...options
    };
  }

  /**
   * Render card HTML
   */
  render() {
    if (!this.persona) {
      return '<div class="persona-card-error">Persona not found</div>';
    }

    const colorClass = this.getColorClass();
    const isFavorite = personaManager ? personaManager.isFavorite(this.personaId) : false;
    const usageCount = usageTracker ? usageTracker.getCount(this.personaId) : 0;

    if (this.options.compact) {
      return this.renderCompact(colorClass, isFavorite);
    }

    return `
      <div class="persona-card" 
           data-persona-id="${this.personaId}" 
           data-color="${colorClass}"
           ${this.options.onClick ? 'style="cursor: pointer;"' : ''}>
        
        <!-- Character Area -->
        <div class="persona-card-char">
          <div class="char-bg"></div>
          <div class="char-geo"></div>
          ${this.getCharacterHTML()}
        </div>

        <!-- Card Body -->
        <div class="persona-card-body">
          
          <!-- Header -->
          <div class="persona-card-header">
            <div class="persona-card-icon">${this.persona.icon}</div>
            <div class="persona-card-number">#${String(this.personaId).padStart(2, '0')}</div>
            ${this.options.showFavorite ? `
              <button class="persona-favorite-btn ${isFavorite ? 'active' : ''}" 
                      onclick="event.stopPropagation(); togglePersonaFavorite(${this.personaId})">
                ${isFavorite ? '❤️' : '🤍'}
              </button>
            ` : ''}
          </div>

          <!-- Name & Region -->
          <div class="persona-card-name">${this.persona.name}</div>
          <div class="persona-card-region">${this.persona.region}</div>

          <!-- Description -->
          <div class="persona-card-desc">${this.persona.desc}</div>

          <!-- Stats (if enabled) -->
          ${this.options.showStats && usageCount > 0 ? `
            <div class="persona-card-stats">
              <span class="stat-item">
                <span class="stat-icon">💬</span>
                <span class="stat-value">${usageCount}</span>
              </span>
            </div>
          ` : ''}

          <!-- Try Button -->
          ${this.options.showTryButton ? `
            <button class="persona-try-btn" 
                    onclick="event.stopPropagation(); goToChat(${this.personaId})">
              Try Chat
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Render compact version
   */
  renderCompact(colorClass, isFavorite) {
    return `
      <div class="persona-card-compact" 
           data-persona-id="${this.personaId}"
           data-color="${colorClass}"
           ${this.options.onClick ? 'style="cursor: pointer;"' : ''}>
        <div class="persona-compact-icon">${this.persona.icon}</div>
        <div class="persona-compact-info">
          <div class="persona-compact-name">${this.persona.name}</div>
          <div class="persona-compact-region">${this.persona.region}</div>
        </div>
        ${this.options.showFavorite ? `
          <button class="persona-compact-favorite ${isFavorite ? 'active' : ''}"
                  onclick="event.stopPropagation(); togglePersonaFavorite(${this.personaId})">
            ${isFavorite ? '❤️' : '🤍'}
          </button>
        ` : ''}
      </div>
    `;
  }

  /**
   * Get character illustration HTML
   */
  getCharacterHTML() {
    const numId = Number(this.personaId) || 1;
    let index = ((numId - 1) % 12) + 1;
    if (index === 9) index = 10; // fallback

    return `
      <img 
        src="character new arutala/character ${index}.png" 
        alt="${this.persona.name}" 
        class="persona-char-img"
        loading="lazy"
      />
    `;
  }

  /**
   * Get color class based on persona ID
   */
  getColorClass() {
    const colorMap = {
      1: 'indigo', 2: 'purple', 3: 'cyan', 4: 'pink', 5: 'violet', 6: 'navy', 7: 'sky', 8: 'steel',
      9: 'gold', 10: 'red', 11: 'green', 12: 'slate', 13: 'teal', 14: 'bronze', 15: 'forest',
      16: 'ocean', 17: 'cyan', 18: 'rose', 19: 'lime', 20: 'ember', 21: 'sky'
    };
    return colorMap[this.personaId] || 'purple';
  }
}

/**
 * Persona Grid Component
 * Render multiple persona cards in a grid
 */
class PersonaGridComponent {
  constructor(personaIds, options = {}) {
    this.personaIds = personaIds;
    this.options = {
      columns: options.columns || 'auto',
      gap: options.gap || '24px',
      ...options
    };
  }

  /**
   * Render grid HTML
   */
  render() {
    const gridStyle = `
      display: grid;
      grid-template-columns: ${this.getGridColumns()};
      gap: ${this.options.gap};
    `;

    const cards = this.personaIds
      .map(id => {
        const card = new PersonaCardComponent(id, this.options);
        return card.render();
      })
      .join('');

    return `
      <div class="persona-grid" style="${gridStyle}">
        ${cards}
      </div>
    `;
  }

  /**
   * Get grid columns CSS
   */
  getGridColumns() {
    if (this.options.columns === 'auto') {
      return 'repeat(auto-fill, minmax(280px, 1fr))';
    }
    return `repeat(${this.options.columns}, 1fr)`;
  }
}

/**
 * Global helper function to toggle favorite
 */
function togglePersonaFavorite(personaId) {
  if (!personaManager) {
    console.error('PersonaManager not initialized');
    return;
  }

  const isFavorite = personaManager.toggleFavorite(personaId);
  
  // Update all favorite buttons for this persona
  const buttons = document.querySelectorAll(`[data-persona-id="${personaId}"] .persona-favorite-btn, [data-persona-id="${personaId}"] .persona-compact-favorite`);
  buttons.forEach(btn => {
    btn.classList.toggle('active', isFavorite);
    btn.textContent = isFavorite ? '❤️' : '🤍';
  });

  // Show toast
  if (window.toast) {
    if (isFavorite) {
      toast.success('Added to favorites!');
    } else {
      toast.info('Removed from favorites');
    }
  }
}

/**
 * Render persona cards into container
 */
function renderPersonaCards(containerSelector, personaIds, options = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error(`Container ${containerSelector} not found`);
    return;
  }

  const grid = new PersonaGridComponent(personaIds, options);
  container.innerHTML = grid.render();

  // Attach click handlers if onClick is provided
  if (options.onClick) {
    container.querySelectorAll('.persona-card, .persona-card-compact').forEach(card => {
      const personaId = card.getAttribute('data-persona-id');
      card.addEventListener('click', () => options.onClick(personaId));
    });
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    PersonaCardComponent, 
    PersonaGridComponent,
    renderPersonaCards,
    togglePersonaFavorite
  };
}
