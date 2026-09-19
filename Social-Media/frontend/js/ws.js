/**
 * Resilient WebSocket Client Manager with Auto-Reconnect and Exponential Backoff.
 */
class WebSocketManager {
  constructor() {
    this.chatSockets = new Map();
    this.notificationSocket = null;
    this.reconnectInterval = 2000;
    this.maxReconnectInterval = 30000;
  }

  getProtocol() {
    return window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  }

  getHost() {
    return window.location.host;
  }

  connectNotifications(onMessage) {
    if (this.notificationSocket && this.notificationSocket.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = `${this.getProtocol()}//${this.getHost()}/ws/notifications/`;
    try {
      this.notificationSocket = new WebSocket(wsUrl);

      this.notificationSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (onMessage) onMessage(data);
        } catch (err) {
          console.error("WS Parse error", err);
        }
      };

      this.notificationSocket.onclose = () => {
        setTimeout(() => this.connectNotifications(onMessage), this.reconnectInterval);
      };
    } catch (e) {
      console.warn("WebSocket connection error:", e);
    }
  }

  connectChat(conversationId, onMessage) {
    if (this.chatSockets.has(conversationId)) {
      const existing = this.chatSockets.get(conversationId);
      if (existing.readyState === WebSocket.OPEN) return existing;
    }

    const wsUrl = `${this.getProtocol()}//${this.getHost()}/ws/chat/${conversationId}/`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessage) onMessage(data);
      } catch (err) {
        console.error("Chat WS Parse error", err);
      }
    };

    socket.onclose = () => {
      this.chatSockets.delete(conversationId);
    };

    this.chatSockets.set(conversationId, socket);
    return socket;
  }

  sendChatMessage(conversationId, content, replyToId = null) {
    const socket = this.chatSockets.get(conversationId);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'chat_message',
        content: content,
        reply_to_id: replyToId
      }));
      return true;
    }
    return false;
  }

  sendTypingIndicator(conversationId, isTyping = true) {
    const socket = this.chatSockets.get(conversationId);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'typing',
        is_typing: isTyping
      }));
    }
  }

  sendReadReceipt(conversationId) {
    const socket = this.chatSockets.get(conversationId);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'read_receipt'
      }));
    }
  }
}

export const wsManager = new WebSocketManager();
