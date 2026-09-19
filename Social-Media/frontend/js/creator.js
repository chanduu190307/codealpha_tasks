import { api } from './api.js';
import { toast, escapeHTML } from './utils.js';

export class CreatorController {
  constructor() {
    this.modal = document.getElementById('creator-studio-modal');
    this.metricsGrid = document.getElementById('creator-metrics-grid');
    this.draftsList = document.getElementById('creator-drafts-list');
    this.scheduledList = document.getElementById('creator-scheduled-list');
  }

  async init() {
    this.bindEvents();
  }

  bindEvents() {
    const openBtn = document.getElementById('creator-studio-btn');
    if (openBtn) {
      openBtn.addEventListener('click', () => this.openStudio());
    }

    const closeBtn = document.getElementById('close-creator-studio-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeStudio());
    }

    const daysSelect = document.getElementById('creator-timeframe-select');
    if (daysSelect) {
      daysSelect.addEventListener('change', () => this.loadOverview(daysSelect.value));
    }
  }

  async openStudio() {
    if (!this.modal) return;
    this.modal.classList.add('active');
    await Promise.all([
      this.loadOverview(30),
      this.loadDrafts(),
      this.loadScheduled()
    ]);
  }

  closeStudio() {
    if (this.modal) {
      this.modal.classList.remove('active');
    }
  }

  async loadOverview(days = 30) {
    if (!this.metricsGrid) return;
    try {
      const res = await api.get(`/api/creator/analytics/overview/?days=${days}`);
      if (res) {
        this.metricsGrid.innerHTML = `
          <div class="creator-metric-card">
            <span class="metric-label">Impressions</span>
            <span class="metric-value">${res.impressions}</span>
          </div>
          <div class="creator-metric-card">
            <span class="metric-label">Engagements</span>
            <span class="metric-value">${res.engagements}</span>
          </div>
          <div class="creator-metric-card">
            <span class="metric-label">Engagement Rate</span>
            <span class="metric-value">${res.engagement_rate_pct}%</span>
          </div>
          <div class="creator-metric-card">
            <span class="metric-label">Profile Visits</span>
            <span class="metric-value">${res.profile_visits}</span>
          </div>
          <div class="creator-metric-card">
            <span class="metric-label">New Followers</span>
            <span class="metric-value">+${res.new_followers}</span>
          </div>
        `;
      }
    } catch (e) {
      console.warn("Could not load creator overview", e);
    }
  }

  async loadDrafts() {
    if (!this.draftsList) return;
    try {
      const res = await api.get('/api/creator/drafts/');
      const items = res.results || res;
      this.draftsList.innerHTML = '';

      if (items.length === 0) {
        this.draftsList.innerHTML = '<p class="empty-hint">No saved drafts.</p>';
        return;
      }

      items.forEach((draft) => {
        const row = document.createElement('div');
        row.className = 'creator-draft-item';
        row.innerHTML = `
          <div class="item-content">${escapeHTML(draft.content || '(Empty draft)')}</div>
          <button class="btn btn-sm btn-outline load-draft-btn">Resume</button>
        `;
        row.querySelector('.load-draft-btn').onclick = () => {
          const textarea = document.getElementById('create-post-text');
          if (textarea) textarea.value = draft.content;
          this.closeStudio();
        };
        this.draftsList.appendChild(row);
      });
    } catch (e) {
      console.warn("Could not load drafts", e);
    }
  }

  async loadScheduled() {
    if (!this.scheduledList) return;
    try {
      const res = await api.get('/api/creator/scheduled/');
      const items = res.results || res;
      this.scheduledList.innerHTML = '';

      if (items.length === 0) {
        this.scheduledList.innerHTML = '<p class="empty-hint">No scheduled posts.</p>';
        return;
      }

      items.forEach((post) => {
        const row = document.createElement('div');
        row.className = 'creator-scheduled-item';
        row.innerHTML = `
          <div>
            <div class="item-content">${escapeHTML(post.content)}</div>
            <span class="item-date">Scheduled for: ${new Date(post.scheduled_time).toLocaleString()} (${post.status})</span>
          </div>
          ${post.status === 'scheduled' ? `<button class="btn btn-sm btn-primary publish-now-btn">Publish Now</button>` : ''}
        `;
        const pubBtn = row.querySelector('.publish-now-btn');
        if (pubBtn) {
          pubBtn.onclick = async () => {
            try {
              await api.post(`/api/creator/scheduled/${post.id}/publish-now/`);
              toast('Post published successfully!', 'success');
              this.loadScheduled();
            } catch (err) {
              toast('Failed to publish scheduled post', 'error');
            }
          };
        }
        this.scheduledList.appendChild(row);
      });
    } catch (e) {
      console.warn("Could not load scheduled posts", e);
    }
  }
}

export const creatorController = new CreatorController();
