import { api } from './api.js';
import { wsManager } from './ws.js';
import { toast, escapeHTML } from './utils.js';

export class ChatController {
  constructor() {
    this.conversations = [];
    this.activeConversationId = null;
    this.drawerElement = document.getElementById('chat-drawer');
    this.messagesListElement = document.getElementById('chat-messages-list');
    this.convListElement = document.getElementById('chat-conversations-list');
    this.typingTimeout = null;
  }

  async init() {
    if (!this.drawerElement) return;
    this.bindEvents();
    await this.loadConversations();
  }

  bindEvents() {
    const chatToggleBtn = document.getElementById('chat-toggle-btn') || document.getElementById('chat-launcher-btn');
    if (chatToggleBtn) {
      chatToggleBtn.addEventListener('click', () => this.toggleDrawer());
    }

    const closeChatBtn = document.getElementById('close-chat-btn');
    if (closeChatBtn) {
      closeChatBtn.addEventListener('click', () => this.toggleDrawer(false));
    }

    const messageForm = document.getElementById('chat-message-form');
    if (messageForm) {
      messageForm.addEventListener('submit', (e) => this.handleSendMessage(e));
    }

    const messageInput = document.getElementById('chat-message-input');
    if (messageInput) {
      messageInput.addEventListener('input', () => this.handleTyping());
    }
  }

  toggleDrawer(forceState) {
    if (!this.drawerElement) return;
    if (typeof forceState === 'boolean') {
      this.drawerElement.classList.toggle('active', forceState);
    } else {
      this.drawerElement.classList.toggle('active');
    }
  }

  async loadConversations() {
    try {
      const res = await api.get('/api/conversations/');
      if (Array.isArray(res)) {
        this.conversations = res;
        this.renderConversationsList();
      }
    } catch (e) {
      console.warn("Could not load conversations", e);
    }
  }

  renderConversationsList() {
    if (!this.convListElement) return;
    this.convListElement.innerHTML = '';

    if (this.conversations.length === 0) {
      this.convListElement.innerHTML = '<p class="empty-state">No conversations yet.</p>';
      return;
    }

    this.conversations.forEach((conv) => {
      const item = document.createElement('div');
      item.className = `conv-item ${conv.id === this.activeConversationId ? 'active' : ''}`;
      const otherUser = conv.other_user || { username: 'Chat' };
      const avatarSrc = otherUser.avatar || '/static/css/default-avatar.png';
      const lastText = conv.last_message ? conv.last_message.content : 'No messages yet';

      item.innerHTML = `
        <img src="${avatarSrc}" class="conv-avatar" />
        <div class="conv-info">
          <span class="conv-name">${escapeHTML(otherUser.username)}</span>
          <span class="conv-preview">${escapeHTML(lastText)}</span>
        </div>
      `;

      item.onclick = () => this.selectConversation(conv.id);
      this.convListElement.appendChild(item);
    });
  }

  async selectConversation(convId) {
    this.activeConversationId = convId;
    this.renderConversationsList();

    // Connect WebSocket for this room
    wsManager.connectChat(convId, (event) => this.handleWebSocketEvent(event));

    // Load message history
    try {
      const res = await api.get(`/api/conversations/${convId}/messages/`);
      const messages = res.results || res;
      this.renderMessages(messages);
      wsManager.sendReadReceipt(convId);
    } catch (err) {
      toast('Failed to load messages', 'error');
    }
  }

  renderMessages(messages) {
    if (!this.messagesListElement) return;
    this.messagesListElement.innerHTML = '';

    messages.forEach((msg) => {
      this.appendMessage(msg);
    });

    this.scrollToBottom();
  }

  appendMessage(msg) {
    if (!this.messagesListElement) return;
    const msgEl = document.createElement('div');
    const currentUsername = window.Auth?.currentUser?.username || window.currentUser?.username;
    const isSelf = msg.sender?.username && currentUsername && (msg.sender.username === currentUsername);
    msgEl.className = `chat-bubble ${isSelf ? 'outgoing' : 'incoming'}`;
    msgEl.innerHTML = `
      <div class="bubble-text">${escapeHTML(msg.content)}</div>
      <span class="bubble-time">${new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    `;
    this.messagesListElement.appendChild(msgEl);
    this.scrollToBottom();
  }

  handleWebSocketEvent(event) {
    if (event.type === 'message') {
      this.appendMessage(event.message);
    } else if (event.type === 'typing') {
      this.showTypingIndicator(event.username, event.is_typing);
    }
  }

  handleSendMessage(e) {
    e.preventDefault();
    if (!this.activeConversationId) return;

    const input = document.getElementById('chat-message-input');
    const content = input.value.trim();
    if (!content) return;

    // Send via WebSocket
    const sent = wsManager.sendChatMessage(this.activeConversationId, content);
    if (!sent) {
      // Fallback to REST API
      api.post(`/api/conversations/${this.activeConversationId}/messages/`, { content })
        .then((res) => this.appendMessage(res))
        .catch(() => toast('Failed to send message', 'error'));
    }

    input.value = '';
  }

  handleTyping() {
    if (!this.activeConversationId) return;
    wsManager.sendTypingIndicator(this.activeConversationId, true);

    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      wsManager.sendTypingIndicator(this.activeConversationId, false);
    }, 2000);
  }

  showTypingIndicator(username, isTyping) {
    const indicator = document.getElementById('chat-typing-indicator');
    if (!indicator) return;
    if (isTyping) {
      indicator.textContent = `${escapeHTML(username)} is typing...`;
      indicator.style.display = 'block';
    } else {
      indicator.style.display = 'none';
    }
  }

  scrollToBottom() {
    if (this.messagesListElement) {
      this.messagesListElement.scrollTop = this.messagesListElement.scrollHeight;
    }
  }
}

export const chatController = new ChatController();
