// ═══════════════════════════════════════════════════════════
// PERSONA AGENT - APPLICATION LOGIC
// ═══════════════════════════════════════════════════════════

// Color mapping for each persona
const colorMap = {
  1: 'indigo', 2: 'purple', 3: 'cyan', 4: 'pink', 5: 'violet', 6: 'navy', 7: 'sky', 8: 'steel',
  9: 'gold', 10: 'red', 11: 'green', 12: 'slate', 13: 'teal', 14: 'bronze', 15: 'forest',
  16: 'ocean', 17: 'cyan', 18: 'rose', 19: 'lime', 20: 'ember', 21: 'sky'
};

// Section mapping
const sectionMap = {
  1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1,  // Indonesia
  9: 2, 10: 2, 11: 2, 12: 2, 13: 2, 14: 2, 15: 2, 16: 2,  // Jawa
  17: 3, 18: 3,  // Campuran
  19: 4, 20: 4, 21: 4  // Sunda
};

/**
 * Generate character element using PNG assets
 * Mapping: persona 1–12 -> character 1–12, lalu diulang lagi
 * Khusus: karena file `character 9.png` tidak ada,
 * persona yang mestinya pakai 9 akan diarahkan ke 10.
 */
function generateCharacterSVG(id, colors) {
  const numId = Number(id) || 1;

  // Hitung index dasar 1..12 berulang
  let index = ((numId - 1) % 12) + 1;

  // Override untuk index yang tidak punya file
  if (index === 9) index = 10; // fallback ke character 10.png

  return `
    <img 
      src="character new arutala/character ${index}.png" 
      alt="Persona character illustration #${index}" 
      class="char-svg"
    />
  `;
}

/**
 * Create persona card HTML
 */
function createPersonaCard(id, persona) {
  const colorClass = colorMap[id] || 'purple';
  const charSVG = generateCharacterSVG(id, persona.color);
  
  return `
    <div class="card fade-in" data-color="${colorClass}" data-id="${id}" onclick="openModal(${id})">
      <div class="char-area">
        <div class="char-bg"></div>
        <div class="char-geo"></div>
        ${charSVG}
      </div>
      <div class="card-body">
        <div class="card-top">
          <div class="card-icon">${persona.icon}</div>
          <div class="card-num">#${String(id).padStart(2, '0')}</div>
        </div>
        <div class="card-name">${persona.name}</div>
        <div class="card-region">${persona.region}</div>
        <div class="card-desc">${persona.desc}</div>
        <button class="card-try" onclick="event.stopPropagation(); goToChat(${id})">
          Try Chat
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

// Navigate langsung ke halaman chat dengan persona terpilih
function goToChat(id) {
  const url = new URL('chatbot.html', window.location.href);
  url.searchParams.set('persona', id);
  window.location.href = url.toString();
}

/**
 * Render all persona cards
 */
function renderPersonas() {
  Object.keys(personas).forEach(id => {
    const persona = personas[id];
    const sectionId = sectionMap[id];
    const gridContainer = document.getElementById(`grid-${sectionId}`);
    
    if (gridContainer) {
      gridContainer.innerHTML += createPersonaCard(id, persona);
    }
  });
}

/**
 * Open modal with persona details
 */
function openModal(id) {
  const p = personas[id];
  if (!p) return;

  // Track persona dibuka dari grid
  if (typeof trackEvent === 'function') {
    trackEvent('persona_open', id);
  }
  
  // Set header gradient
  const headerBg = document.getElementById('modal-header-bg');
  headerBg.style.background = `linear-gradient(145deg, ${p.color[0]}, ${p.color[1]})`;
  headerBg.style.opacity = '0.18';

  // Set character
  const modalChar = document.getElementById('modal-char');
  modalChar.innerHTML = generateCharacterSVG(id, p.color);

  // Set icon
  const icon = document.getElementById('modal-icon');
  icon.style.background = `linear-gradient(135deg, ${p.color[0]}, ${p.color[1]})`;
  icon.textContent = p.icon;

  // Set text content
  document.getElementById('modal-name').textContent = p.name;
  document.getElementById('modal-region').style.color = p.color[0];
  document.getElementById('modal-region').textContent = p.region;
  document.getElementById('modal-desc').textContent = p.desc;
  document.getElementById('modal-sample').style.borderLeftColor = p.color[0];
  document.getElementById('modal-sample-text').textContent = p.sample;

  // Set Try Chat button di dalam modal
  const tryBtn = document.getElementById('modal-try-btn');
  if (tryBtn) {
    tryBtn.onclick = function () {
      goToChat(id);
    };
  }

  // Show modal
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * Close modal
 */
function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.fade-in').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 5) * 0.08}s`;
    observer.observe(el);
  });
}

/**
 * Initialize keyboard shortcuts
 */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

/**
 * Initialize application
 */
function init() {
  renderPersonas();
  initScrollAnimations();
  initKeyboardShortcuts();
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
