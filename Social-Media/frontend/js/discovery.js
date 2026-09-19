import { api } from './api.js';
import { toast, escapeHTML, normalizeImageUrl } from './utils.js';

export class DiscoveryController {
  constructor() {
    this.trendingElement = document.getElementById('trending-tags-list');
    this.suggestedElement = document.getElementById('suggested-users-list');
  }

  async init() {
    await Promise.all([
      this.loadTrendingTags(),
      this.loadSuggestedUsers()
    ]);
  }

  async loadTrendingTags() {
    if (!this.trendingElement) return;
    try {
      const res = await api.get('/api/trending/hashtags/');
      if (Array.isArray(res)) {
        this.trendingElement.innerHTML = '';
        if (res.length === 0) {
          this.trendingElement.innerHTML = '<span class="empty-hint">No trending tags yet</span>';
          return;
        }
        res.forEach((tag) => {
          const item = document.createElement('a');
          item.className = 'trending-chip';
          item.href = `javascript:void(0);`;
          item.textContent = `#${tag.name}`;
          item.onclick = () => {
            if (window.loadFeedByHashtag) {
              window.loadFeedByHashtag(tag.name);
            }
          };
          this.trendingElement.appendChild(item);
        });
      }
    } catch (e) {
      console.warn("Could not load trending tags", e);
    }
  }

  async loadSuggestedUsers() {
    if (!this.suggestedElement) return;
    try {
      const res = await api.get('/api/discovery/suggestions/');
      if (Array.isArray(res)) {
        this.suggestedElement.innerHTML = '';
        if (res.length === 0) {
          this.suggestedElement.innerHTML = '<span class="empty-hint">No suggestions right now</span>';
          return;
        }
        const defaultAvatar = (typeof CONFIG !== 'undefined' && CONFIG.DEFAULT_AVATAR) ? CONFIG.DEFAULT_AVATAR : '';
        res.forEach((user) => {
          const item = document.createElement('div');
          item.className = 'suggested-user-row';
          const avatarSrc = normalizeImageUrl ? normalizeImageUrl(user.avatar, defaultAvatar) : (user.avatar || defaultAvatar);

          item.innerHTML = `
            <img src="${avatarSrc}" class="suggested-avatar" alt="${escapeHTML(user.username)}'s avatar" onerror="this.onerror=null;this.src='${defaultAvatar}';" />
            <div class="suggested-info">
              <span class="suggested-username">@${escapeHTML(user.username)}</span>
              <span class="suggested-name">${escapeHTML(user.display_name || user.username)}</span>
            </div>
            <button class="btn btn-sm btn-outline follow-btn" data-username="${user.username}">Follow</button>
          `;

          const followBtn = item.querySelector('.follow-btn');
          followBtn.onclick = async () => {
            try {
              await api.post(`/api/users/${user.username}/follow/`);
              followBtn.textContent = 'Following';
              followBtn.classList.remove('btn-outline');
              followBtn.classList.add('btn-primary');
              followBtn.disabled = true;
              toast(`You followed @${user.username}`, 'success');
              if (window.ProfileModule && ProfileModule.currentProfile && ProfileModule.currentProfile.username === user.username) {
                ProfileModule.loadUserProfile(user.username);
              }
            } catch (err) {
              toast('Follow failed', 'error');
            }
          };

          this.suggestedElement.appendChild(item);
        });
      }
    } catch (e) {
      console.warn("Could not load suggested users", e);
    }
  }
}

export const discoveryController = new DiscoveryController();
