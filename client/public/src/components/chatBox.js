// ═══════════════════════════════════════════════════════════
// CHAT BOX COMPONENT
// ═══════════════════════════════════════════════════════════

/**
 * Chat Box Component
 * Reusable chat interface component
 */
class ChatBoxComponent {
  constructor(options = {}) {
    this.options = {
      containerId: options.containerId || 'chat-box',
      personaId: options.personaId || null,
      autoScroll: options.autoScroll !== false,
      showAvatar: options.showAvatar !== false,
      showTimestamp: options.showTimestamp !== false,
      placeholder: options.placeholder || 'Type your message...',
      ...options
    };

    this.messages = [];
    this.container = null;
  }

  /**
   * Render the chat box
   */
  render() {
    const container = document.getElementById(this.options.containerId);
    if (!container) {
      console.error(`Container #${this.options.containerId} not found`);
      return;
    }

    this.container = container;
    container.innerHTML = this.getHTML();
    this.attachEventListeners();
  }

  /**
   * Get chat box HTML
   */
  getHTML() {
    return `
      <div class="chat-box-wrapper">
        <div class="chat-messages" id="chat-messages-${this.options.containerId}">
          ${this.messages.map(msg => this.getMessageHTML(msg)).join('')}
        </div>
        <div class="chat-input-wrapper">
          <textarea 
            class="chat-input" 
            placeholder="${this.options.placeholder}"
            rows="1"
            id="chat-input-${this.options.containerId}"
          ></textarea>
          <button class="chat-send-btn" id="chat-send-${this.options.containerId}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Get message HTML
   */
  getMessageHTML(message) {
    const isUser = message.role === 'user';
    const persona = !isUser && message.persona_id ? personas[message.persona_id] : null;
    const avatar = isUser ? '👤' : (persona ? persona.icon : '🤖');

    return `
      <div class="chat-message ${isUser ? 'user-message' : 'assistant-message'}" data-id="${message.id}">
        ${this.options.showAvatar ? `<div class="chat-avatar">${avatar}</div>` : ''}
        <div class="chat-bubble">
          <div class="chat-content">${this.escapeHTML(message.content)}</div>
          ${this.options.showTimestamp ? `<div class="chat-timestamp">${this.formatTime(message.timestamp)}</div>` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    const sendBtn = document.getElementById(`chat-send-${this.options.containerId}`);
    const input = document.getElementById(`chat-input-${this.options.containerId}`);

    if (sendBtn) {
      sendBtn.addEventListener('click', () => this.handleSend());
    }

    if (input) {
      // Auto-resize textarea
      input.addEventListener('input', (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
      });

      // Send on Enter (but allow Shift+Enter for new line)
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSend();
        }
      });
    }
  }

  /**
   * Handle send message
   */
  handleSend() {
    const input = document.getElementById(`chat-input-${this.options.containerId}`);
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    this.addMessage({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });

    // Clear input
    input.value = '';
    input.style.height = 'auto';

    // Trigger custom event
    this.container.dispatchEvent(new CustomEvent('message-send', {
      detail: { message, personaId: this.options.personaId }
    }));
  }

  /**
   * Add message to chat
   */
  addMessage(message) {
    message.id = message.id || this.generateId();
    this.messages.push(message);

    const messagesContainer = document.getElementById(`chat-messages-${this.options.containerId}`);
    if (messagesContainer) {
      messagesContainer.insertAdjacentHTML('beforeend', this.getMessageHTML(message));
      
      if (this.options.autoScroll) {
        this.scrollToBottom();
      }
    }

    return message.id;
  }

  /**
   * Update message content
   */
  updateMessage(messageId, newContent) {
    const message = this.messages.find(m => m.id === messageId);
    if (message) {
      message.content = newContent;
    }

    const messageEl = this.container.querySelector(`[data-id="${messageId}"] .chat-content`);
    if (messageEl) {
      messageEl.textContent = newContent;
    }
  }

  /**
   * Remove message
   */
  removeMessage(messageId) {
    this.messages = this.messages.filter(m => m.id !== messageId);
    
    const messageEl = this.container.querySelector(`[data-id="${messageId}"]`);
    if (messageEl) {
      messageEl.remove();
    }
  }

  /**
   * Clear all messages
   */
  clear() {
    this.messages = [];
    const messagesContainer = document.getElementById(`chat-messages-${this.options.containerId}`);
    if (messagesContainer) {
      messagesContainer.innerHTML = '';
    }
  }

  /**
   * Scroll to bottom
   */
  scrollToBottom() {
    const messagesContainer = document.getElementById(`chat-messages-${this.options.containerId}`);
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  /**
   * Show typing indicator
   */
  showTyping() {
    const typingId = 'typing-' + Date.now();
    const persona = this.options.personaId ? personas[this.options.personaId] : null;
    const avatar = persona ? persona.icon : '🤖';

    const messagesContainer = document.getElementById(`chat-messages-${this.options.containerId}`);
    if (messagesContainer) {
      messagesContainer.insertAdjacentHTML('beforeend', `
        <div class="chat-message assistant-message typing-indicator" data-id="${typingId}">
          ${this.options.showAvatar ? `<div class="chat-avatar">${avatar}</div>` : ''}
          <div class="chat-bubble">
            <div class="typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      `);
      this.scrollToBottom();
    }

    return typingId;
  }

  /**
   * Hide typing indicator
   */
  hideTyping(typingId) {
    this.removeMessage(typingId);
  }

  /**
   * Utility: Generate ID
   */
  generateId() {
    return 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Utility: Format time
   */
  formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Utility: Escape HTML
   */
  escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChatBoxComponent;
}
