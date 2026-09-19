import { api } from './api.js';
import { toast, escapeHTML } from './utils.js';

export class SettingsV2Controller {
  constructor() {
    this.modalElement = document.getElementById('settings-modal');
    this.blockedListElement = document.getElementById('blocked-users-list');
  }

  async init() {
    this.bindEvents();
  }

  bindEvents() {
    const settingsToggleBtn = document.getElementById('settings-toggle-btn');
    if (settingsToggleBtn) {
      settingsToggleBtn.addEventListener('click', () => this.openModal());
    }

    const closeBtn = document.getElementById('close-settings-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    const privacyForm = document.getElementById('privacy-settings-form');
    if (privacyForm) {
      privacyForm.addEventListener('submit', (e) => this.handleSavePrivacy(e));
    }
  }

  async openModal() {
    if (!this.modalElement) return;
    this.modalElement.classList.add('active');
    await Promise.all([
      this.loadPrivacySettings(),
      this.loadBlockedUsers()
    ]);
  }

  closeModal() {
    if (this.modalElement) {
      this.modalElement.classList.remove('active');
    }
  }

  async loadPrivacySettings() {
    try {
      const res = await api.get('/api/privacy/settings/');
      if (res) {
        const isPrivateCheckbox = document.getElementById('setting-is-private');
        const messageSelect = document.getElementById('setting-who-message');
        if (isPrivateCheckbox) isPrivateCheckbox.checked = !!res.is_private;
        if (messageSelect) messageSelect.value = res.who_can_message || 'everyone';
      }
    } catch (e) {
      console.warn("Could not load privacy settings", e);
    }
  }

  async handleSavePrivacy(e) {
    e.preventDefault();
    const isPrivate = document.getElementById('setting-is-private')?.checked;
    const whoCanMessage = document.getElementById('setting-who-message')?.value;

    try {
      await api.patch('/api/privacy/settings/', {
        is_private: isPrivate,
        who_can_message: whoCanMessage
      });
      toast('Privacy settings updated!', 'success');
    } catch (err) {
      toast('Failed to update privacy settings', 'error');
    }
  }

  async loadBlockedUsers() {
    if (!this.blockedListElement) return;
    try {
      const res = await api.get('/api/users/blocked/');
      const items = res.results || res;
      this.blockedListElement.innerHTML = '';

      if (items.length === 0) {
        this.blockedListElement.innerHTML = '<span class="empty-hint">No blocked users</span>';
        return;
      }

      items.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'blocked-user-row';
        row.innerHTML = `
          <span>@${escapeHTML(item.blocked.username)}</span>
          <button class="btn btn-sm btn-outline unblock-btn">Unblock</button>
        `;

        row.querySelector('.unblock-btn').onclick = async () => {
          try {
            await api.post(`/api/users/${item.blocked.username}/unblock/`);
            toast(`Unblocked @${item.blocked.username}`, 'info');
            this.loadBlockedUsers();
          } catch (err) {
            toast('Failed to unblock user', 'error');
          }
        };

        this.blockedListElement.appendChild(row);
      });
    } catch (e) {
      console.warn("Could not load blocked users", e);
    }
  }
}

export const settingsV2Controller = new SettingsV2Controller();
