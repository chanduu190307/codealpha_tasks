import { api } from './api.js';
import { wsManager } from './ws.js';
import { toast, escapeHTML } from './utils.js';

export class NotificationController {
  constructor() {
    this.badgeElement = document.getElementById('notif-badge');
    this.dropdownElement = document.getElementById('notif-dropdown');
    this.listElement = document.getElementById('notif-list');
  }

  async init() {
    this.bindEvents();
    await this.loadNotifications();

    // Listen for live real-time notifications via WebSocket
    wsManager.connectNotifications((data) => {
      if (data.type === 'notification') {
        toast(`${data.notification.actor.username} ${data.notification.verb}`, 'info');
        this.loadNotifications();
      }
    });
  }

  bindEvents() {
    const toggleBtn = document.getElementById('notif-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleDropdown());
    }

    const markAllBtn = document.getElementById('notif-mark-all-btn');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', () => this.markAllRead());
    }
  }

  toggleDropdown() {
    if (this.dropdownElement) {
      this.dropdownElement.classList.toggle('active');
    }
  }

  async loadNotifications() {
    try {
      const res = await api.get('/api/notifications/');
      if (res && res.results) {
        this.updateBadge(res.unread_count);
        this.renderList(res.results);
      }
    } catch (e) {
      console.warn("Could not load notifications", e);
    }
  }

  updateBadge(count) {
    if (!this.badgeElement) return;
    if (count > 0) {
      this.badgeElement.textContent = count > 99 ? '99+' : count;
      this.badgeElement.style.display = 'inline-flex';
    } else {
      this.badgeElement.style.display = 'none';
    }
  }

  renderList(notifications) {
    if (!this.listElement) return;
    this.listElement.innerHTML = '';

    if (notifications.length === 0) {
      this.listElement.innerHTML = '<p class="empty-state">No notifications yet.</p>';
      return;
    }

    notifications.forEach((item) => {
      const el = document.createElement('div');
      el.className = `notif-item ${item.is_read ? 'read' : 'unread'}`;
      const avatarSrc = item.actor?.avatar || '/static/css/default-avatar.png';

      el.innerHTML = `
        <img src="${avatarSrc}" class="notif-avatar" />
        <div class="notif-content">
          <p><strong>${escapeHTML(item.actor.username)}</strong> ${escapeHTML(item.verb)}</p>
          <span class="notif-time">${new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      `;

      el.onclick = () => this.markRead(item.id, el);
      this.listElement.appendChild(el);
    });
  }

  async markRead(id, element) {
    try {
      await api.patch(`/api/notifications/${id}/read/`);
      element.classList.remove('unread');
      element.classList.add('read');
      this.loadNotifications();
    } catch (err) {}
  }

  async markAllRead() {
    try {
      await api.post('/api/notifications/read-all/');
      this.loadNotifications();
    } catch (err) {
      toast('Failed to mark all as read', 'error');
    }
  }
}

export const notificationController = new NotificationController();
