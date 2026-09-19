import { api } from './api.js';
import { toast, escapeHTML } from './utils.js';

export class CommunitiesController {
  constructor() {
    this.container = document.getElementById('communities-view');
    this.listElement = document.getElementById('communities-list');
  }

  async init() {
    this.bindEvents();
  }

  bindEvents() {
    const navLink = document.getElementById('sidebar-communities-link');
    if (navLink) {
      navLink.addEventListener('click', () => this.showCommunities());
    }

    const createForm = document.getElementById('create-community-form');
    if (createForm) {
      createForm.addEventListener('submit', (e) => this.handleCreateCommunity(e));
    }
  }

  async showCommunities() {
    const mainFeed = document.getElementById('main-feed-view');
    const profileView = document.getElementById('main-profile-view');
    if (mainFeed) mainFeed.style.display = 'none';
    if (profileView) profileView.style.display = 'none';
    if (this.container) this.container.style.display = 'block';

    await this.loadCommunities();
  }

  async loadCommunities() {
    if (!this.listElement) return;
    try {
      const res = await api.get('/api/communities/');
      const items = res.results || res;
      this.listElement.innerHTML = '';

      if (items.length === 0) {
        this.listElement.innerHTML = '<p class="empty-hint">No communities created yet. Be the first!</p>';
        return;
      }

      items.forEach((com) => {
        const card = document.createElement('div');
        card.className = 'community-card';
        const avatarSrc = com.avatar || '/static/css/default-avatar.png';

        card.innerHTML = `
          <div class="community-banner-img"></div>
          <div class="community-card-body">
            <div class="community-header-row">
              <img src="${avatarSrc}" class="community-avatar-img" />
              <div>
                <div class="community-title">c/${escapeHTML(com.name)}</div>
                <span class="community-type-badge">${com.type}</span>
              </div>
            </div>
            <p class="community-desc">${escapeHTML(com.description || 'Welcome to this community!')}</p>
            <div class="community-stats-row">
              <span>👥 ${com.member_count} members</span>
              <button class="btn btn-sm btn-primary join-btn" data-slug="${com.slug}">
                ${com.user_role ? 'Joined' : 'Join'}
              </button>
            </div>
          </div>
        `;

        const joinBtn = card.querySelector('.join-btn');
        joinBtn.onclick = async () => {
          try {
            const result = await api.post(`/api/communities/${com.slug}/join-leave/`);
            if (result.status === 'joined') {
              joinBtn.textContent = 'Joined';
              toast(`Joined c/${com.name}!`, 'success');
            } else if (result.status === 'request_submitted') {
              joinBtn.textContent = 'Requested';
              toast('Join request submitted to moderators.', 'info');
            } else {
              joinBtn.textContent = 'Join';
              toast(`Left c/${com.name}.`, 'info');
            }
          } catch (err) {
            toast('Failed to update membership.', 'error');
          }
        };

        this.listElement.appendChild(card);
      });
    } catch (e) {
      console.warn("Could not load communities", e);
    }
  }

  async handleCreateCommunity(e) {
    e.preventDefault();
    const name = document.getElementById('community-name-input')?.value;
    const description = document.getElementById('community-desc-input')?.value;
    const type = document.getElementById('community-type-select')?.value;

    try {
      await api.post('/api/communities/', { name, description, type });
      toast(`Created c/${name}!`, 'success');
      document.getElementById('create-community-modal')?.classList.remove('active');
      this.loadCommunities();
    } catch (err) {
      toast('Failed to create community.', 'error');
    }
  }
}

export const communitiesController = new CommunitiesController();
