import { api } from './api.js';
import { toast, escapeHTML } from './utils.js';

export class AccountCenterController {
  constructor() {
    this.modal = document.getElementById('account-center-modal');
  }

  async init() {
    this.bindEvents();
  }

  bindEvents() {
    const openBtn = document.getElementById('account-center-btn');
    if (openBtn) {
      openBtn.addEventListener('click', () => this.openModal());
    }

    const closeBtn = document.getElementById('close-account-center-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.handleDataExport());
    }

    const privacyForm = document.getElementById('privacy-settings-form');
    if (privacyForm) {
      privacyForm.addEventListener('submit', (e) => this.handleSavePrivacy(e));
    }

    const changePwdForm = document.getElementById('change-password-form');
    if (changePwdForm) {
      changePwdForm.addEventListener('submit', (e) => this.handleChangePassword(e));
    }

    const verificationForm = document.getElementById('verification-request-form');
    if (verificationForm) {
      verificationForm.addEventListener('submit', (e) => this.handleVerificationRequest(e));
    }

    const deleteForm = document.getElementById('delete-account-form');
    if (deleteForm) {
      deleteForm.addEventListener('submit', (e) => this.handleDeleteAccount(e));
    }
  }

  async openModal() {
    if (this.modal) {
      this.modal.classList.add('active');
      await Promise.all([
        this.loadPrivacySettings(),
        this.loadBlockedUsers()
      ]);
    }
  }

  closeModal() {
    if (this.modal) this.modal.classList.remove('active');
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
      toast('Privacy settings updated successfully!', 'success');
    } catch (err) {
      toast(err.message || 'Failed to update privacy settings', 'error');
    }
  }

  async handleChangePassword(e) {
    e.preventDefault();
    const current_password = document.getElementById('change-pwd-current')?.value;
    const new_password = document.getElementById('change-pwd-new')?.value;
    const confirm_password = document.getElementById('change-pwd-confirm')?.value;

    if (!current_password || !new_password || !confirm_password) {
      toast('All password fields are required.', 'error');
      return;
    }

    if (new_password !== confirm_password) {
      toast('New passwords do not match.', 'error');
      return;
    }

    try {
      const res = await api.post('/api/auth/change-password/', {
        current_password,
        new_password,
        confirm_password
      });
      toast(res.detail || 'Password updated successfully!', 'success');
      e.target.reset();
    } catch (err) {
      toast(err.message || 'Failed to update password', 'error');
    }
  }

  async handleVerificationRequest(e) {
    e.preventDefault();
    const category = document.getElementById('verification-category')?.value;
    const reason = document.getElementById('verification-reason')?.value;

    try {
      const res = await api.post('/api/verification/request/', {
        category,
        reason
      });
      toast(res.detail || 'Verification request submitted!', 'success');
      e.target.reset();
    } catch (err) {
      toast(err.message || 'Failed to submit verification request', 'error');
    }
  }

  async loadBlockedUsers() {
    const listEl = document.getElementById('account-blocked-users-list');
    if (!listEl) return;

    try {
      const res = await api.get('/api/users/blocked/');
      const items = res.results || res || [];
      listEl.innerHTML = '';

      if (!Array.isArray(items) || items.length === 0) {
        listEl.innerHTML = '<span class="empty-hint" style="color: var(--text-muted); font-size: 13px;">No blocked users</span>';
        return;
      }

      items.forEach((item) => {
        const username = item.blocked?.username || item.username || item.blocked_username;
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.justifyContent = 'space-between';
        row.style.padding = '6px 0';
        row.style.borderBottom = '1px solid var(--border-glass)';
        row.innerHTML = `
          <span style="font-size: 13px; font-weight: 500;">@${escapeHTML(username)}</span>
          <button class="btn btn-sm btn-outline unblock-action-btn">Unblock</button>
        `;

        row.querySelector('.unblock-action-btn').onclick = async () => {
          try {
            await api.post(`/api/users/${username}/unblock/`);
            toast(`Unblocked @${username}`, 'info');
            this.loadBlockedUsers();
          } catch (err) {
            toast('Failed to unblock user', 'error');
          }
        };

        listEl.appendChild(row);
      });
    } catch (e) {
      console.warn("Could not load blocked users", e);
    }
  }

  async handleDataExport() {
    try {
      toast('Generating your data export...', 'info');
      const res = await api.get('/api/users/export-data/');
      if (res) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `pulse_data_archive_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        toast('Data archive downloaded successfully!', 'success');
      }
    } catch (err) {
      toast('Failed to generate export archive', 'error');
    }
  }

  async handleDeleteAccount(e) {
    e.preventDefault();
    const password = document.getElementById('delete-account-password')?.value;
    if (!password) {
      toast('Password confirmation required', 'error');
      return;
    }

    if (!confirm('Are you absolutely sure you want to permanently delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      await api.post('/api/users/delete-account/', { password });
      toast('Your account has been deleted.', 'info');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (err) {
      toast('Invalid password confirmation', 'error');
    }
  }
}

export const accountCenterController = new AccountCenterController();
