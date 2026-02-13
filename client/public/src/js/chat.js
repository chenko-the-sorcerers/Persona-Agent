// ═══════════════════════════════════════════════════════════
// CHAT MANAGER - Chat Functionality
// ═══════════════════════════════════════════════════════════

/**
 * Chat Manager Class
 */
class ChatManager {
  constructor() {
    this.currentPersonaId = null;
    this.currentConversationId = null;
    this.messages = [];
    this.isStreaming = false;
    this.elements = {};
  }

  /**
   * Initialize chat manager
   */
  init(containerSelector) {
    this.elements = {
      container: document.querySelector(containerSelector),
      messagesContainer: document.querySelector('.chat-messages'),
      inputField: document.querySelector('.chat-input input'),
      sendButton: document.querySelector('.chat-send-btn'),
      personaSelector: document.querySelector('#persona-select')
    };

    this.attachEventListeners();
    this.loadFromURL();
    this.loadConversationHistory();
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Send button click
    if (this.elements.sendButton) {
      this.elements.sendButton.addEventListener('click', () => this.sendMessage());
    }

    // Enter key to send
    if (this.elements.inputField) {
      this.elements.inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }

    // Persona selector change
    if (this.elements.personaSelector) {
      this.elements.personaSelector.addEventListener('change', (e) => {
        this.changePersona(e.target.value);
      });
    }
  }

  /**
   * Load persona from URL parameter
   */
  loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const personaId = params.get('persona');
    
    if (personaId && this.elements.personaSelector) {
      this.elements.personaSelector.value = personaId;
      this.currentPersonaId = personaId;
    } else if (this.elements.personaSelector) {
      this.currentPersonaId = this.elements.personaSelector.value;
    }
  }

  /**
   * Change persona
   */
  changePersona(personaId) {
    this.currentPersonaId = personaId;
    this.currentConversationId = null;
    this.clearMessages();
    
    // Track persona change
    if (typeof trackEvent === 'function') {
      trackEvent('persona_change', personaId);
    }

    // Show welcome message
    this.showWelcomeMessage(personaId);
  }

  /**
   * Show welcome message from persona
   */
  showWelcomeMessage(personaId) {
    const persona = personas[personaId];
    if (!persona) return;

    const welcomeMessages = {
      1: "Selamat datang. Saya siap membantu Anda dengan bahasa formal dan profesional.",
      2: "Hii! Aku ready nih buat ngobrol. What's on your mind?",
      3: "Hai! Ada yang bisa aku bantu? Yuk ngobrol!",
      4: "Yo bestie! What's good? Spill the tea sis!",
      5: "Sigma grindset activated. Chat me up bro! W or L?",
      6: "Selamat datang. Mari kita diskusikan agenda Anda hari ini.",
      // Add more welcome messages for other personas
    };

    const welcomeMsg = welcomeMessages[personaId] || persona.sample;
    
    this.addMessage({
      role: 'assistant',
      content: welcomeMsg,
      persona_id: personaId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send user message
   */
  async sendMessage() {
    const input = this.elements.inputField;
    const message = input.value.trim();

    if (!message || this.isStreaming) return;
    if (!this.currentPersonaId) {
      this.showError('Please select a persona first');
      return;
    }

    // Clear input
    input.value = '';
    input.style.height = 'auto';

    // Add user message to UI
    this.addMessage({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });

    // Track message sent
    if (typeof trackEvent === 'function') {
      trackEvent('message_sent', {
        persona_id: this.currentPersonaId,
        message_length: message.length
      });
    }

    // Show typing indicator
    const typingId = this.showTypingIndicator();

    try {
      // Use streaming if available, otherwise regular API call
      const useStreaming = typeof API.chat.streamMessage === 'function';

      if (useStreaming) {
        await this.sendStreamingMessage(message, typingId);
      } else {
        await this.sendRegularMessage(message, typingId);
      }
    } catch (error) {
      console.error('Send message error:', error);
      this.removeMessage(typingId);
      this.showError(handleAPIError(error));
    }
  }

  /**
   * Send message with streaming
   */
  async sendStreamingMessage(message, typingId) {
    this.isStreaming = true;
    let fullResponse = '';
    let responseMessageId = null;

    try {
      await API.chat.streamMessage(
        this.currentPersonaId,
        message,
        this.currentConversationId,
        (chunk) => {
          if (chunk.conversation_id && !this.currentConversationId) {
            this.currentConversationId = chunk.conversation_id;
          }

          if (chunk.content) {
            fullResponse += chunk.content;
            
            // Remove typing indicator and show response
            if (!responseMessageId) {
              this.removeMessage(typingId);
              responseMessageId = this.addMessage({
                role: 'assistant',
                content: fullResponse,
                persona_id: this.currentPersonaId,
                timestamp: new Date().toISOString()
              });
            } else {
              this.updateMessage(responseMessageId, fullResponse);
            }
          }
        }
      );
    } finally {
      this.isStreaming = false;
    }
  }

  /**
   * Send message without streaming
   */
  async sendRegularMessage(message, typingId) {
    const response = await API.chat.sendMessage(
      this.currentPersonaId,
      message,
      this.currentConversationId
    );

    if (response.conversation_id) {
      this.currentConversationId = response.conversation_id;
    }

    // Remove typing indicator
    this.removeMessage(typingId);

    // Add AI response
    this.addMessage({
      role: 'assistant',
      content: response.response || response.message,
      persona_id: this.currentPersonaId,
      timestamp: response.timestamp || new Date().toISOString()
    });
  }

  /**
   * Add message to chat
   */
  addMessage(messageData) {
    const messageId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    messageData.id = messageId;
    
    this.messages.push(messageData);

    const messageEl = this.createMessageElement(messageData);
    this.elements.messagesContainer.appendChild(messageEl);
    this.scrollToBottom();

    return messageId;
  }

  /**
   * Update existing message
   */
  updateMessage(messageId, newContent) {
    const messageEl = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageEl) {
      const contentEl = messageEl.querySelector('.message-content');
      if (contentEl) {
        contentEl.textContent = newContent;
      }
    }

    const message = this.messages.find(m => m.id === messageId);
    if (message) {
      message.content = newContent;
    }
  }

  /**
   * Remove message
   */
  removeMessage(messageId) {
    const messageEl = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageEl) {
      messageEl.remove();
    }

    this.messages = this.messages.filter(m => m.id !== messageId);
  }

  /**
   * Create message HTML element
   */
  createMessageElement(messageData) {
    const div = document.createElement('div');
    div.className = `message message-${messageData.role}`;
    div.setAttribute('data-message-id', messageData.id);

    if (messageData.role === 'assistant') {
      const persona = personas[messageData.persona_id];
      const icon = persona ? persona.icon : '🤖';
      
      div.innerHTML = `
        <div class="message-avatar">${icon}</div>
        <div class="message-bubble">
          <div class="message-content">${this.escapeHtml(messageData.content)}</div>
          <div class="message-time">${this.formatTime(messageData.timestamp)}</div>
        </div>
      `;
    } else {
      div.innerHTML = `
        <div class="message-bubble">
          <div class="message-content">${this.escapeHtml(messageData.content)}</div>
          <div class="message-time">${this.formatTime(messageData.timestamp)}</div>
        </div>
        <div class="message-avatar">👤</div>
      `;
    }

    return div;
  }

  /**
   * Show typing indicator
   */
  showTypingIndicator() {
    const typingId = 'typing-' + Date.now();
    const persona = personas[this.currentPersonaId];
    const icon = persona ? persona.icon : '🤖';

    const div = document.createElement('div');
    div.className = 'message message-assistant typing-indicator';
    div.setAttribute('data-message-id', typingId);
    div.innerHTML = `
      <div class="message-avatar">${icon}</div>
      <div class="message-bubble">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;

    this.elements.messagesContainer.appendChild(div);
    this.scrollToBottom();

    return typingId;
  }

  /**
   * Show error message
   */
  showError(message) {
    const div = document.createElement('div');
    div.className = 'message message-error';
    div.innerHTML = `
      <div class="message-bubble">
        <div class="message-content">⚠️ ${this.escapeHtml(message)}</div>
      </div>
    `;

    this.elements.messagesContainer.appendChild(div);
    this.scrollToBottom();

    // Auto remove after 5 seconds
    setTimeout(() => div.remove(), 5000);
  }

  /**
   * Clear all messages
   */
  clearMessages() {
    this.messages = [];
    if (this.elements.messagesContainer) {
      this.elements.messagesContainer.innerHTML = '';
    }
  }

  /**
   * Load conversation history
   */
  async loadConversationHistory() {
    if (!this.currentConversationId) return;

    try {
      const conversation = await API.chat.getConversation(this.currentConversationId);
      
      this.clearMessages();
      conversation.messages.forEach(msg => {
        this.addMessage(msg);
      });
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  }

  /**
   * Scroll chat to bottom
   */
  scrollToBottom() {
    if (this.elements.messagesContainer) {
      this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
    }
  }

  /**
   * Format timestamp
   */
  formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize chat manager when DOM is ready
let chatManager;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.chat-container')) {
      chatManager = new ChatManager();
      chatManager.init('.chat-container');
    }
  });
} else {
  if (document.querySelector('.chat-container')) {
    chatManager = new ChatManager();
    chatManager.init('.chat-container');
  }
}
