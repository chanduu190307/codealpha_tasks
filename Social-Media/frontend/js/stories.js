import { api } from './api.js';
import { toast, escapeHTML, normalizeImageUrl } from './utils.js';

export class StoryController {
  constructor() {
    this.trayElement = document.getElementById('stories-tray');
    this.modalElement = document.getElementById('story-viewer-modal');
    this.createModalElement = document.getElementById('story-create-modal');
    this.activeStories = [];
    this.currentStoryIndex = 0;
    this.timer = null;
  }

  async init() {
    if (!this.trayElement) return;
    await this.loadStories();
    this.bindEvents();
  }

  bindEvents() {
    const addStoryBtn = document.getElementById('add-story-btn');
    if (addStoryBtn) {
      addStoryBtn.addEventListener('click', () => this.openCreateModal());
    }

    const createForm = document.getElementById('story-create-form');
    if (createForm) {
      createForm.addEventListener('submit', (e) => this.handleCreateStory(e));
    }
  }

  async loadStories() {
    try {
      const res = await api.get('/api/stories/feed/');
      if (res && Array.isArray(res)) {
        this.activeStories = res;
        this.renderTray();
      }
    } catch (e) {
      console.warn("Could not load stories feed", e);
    }
  }

  renderTray() {
    if (!this.trayElement) return;
    this.trayElement.innerHTML = '';

    // "Your Story / Add" button
    const addCard = document.createElement('div');
    addCard.className = 'story-bubble add-story-bubble';
    addCard.innerHTML = `
      <div class="story-avatar-wrap add-wrap">
        <span class="plus-icon">+</span>
      </div>
      <span class="story-username">Add Story</span>
    `;
    addCard.onclick = () => this.openCreateModal();
    this.trayElement.appendChild(addCard);

    // Group stories by author
    this.activeStories.forEach((story, idx) => {
      const bubble = document.createElement('div');
      bubble.className = `story-bubble ${story.has_viewed ? 'viewed' : 'unviewed'}`;
      const defaultAvatar = (typeof CONFIG !== 'undefined' && CONFIG.DEFAULT_AVATAR) ? CONFIG.DEFAULT_AVATAR : '';
      const authorAvatar = story.author?.avatar || story.avatar;
      const authorName = story.author?.username || story.username || 'user';
      const avatarSrc = normalizeImageUrl ? normalizeImageUrl(authorAvatar, defaultAvatar) : (authorAvatar || defaultAvatar);

      bubble.innerHTML = `
        <div class="story-avatar-wrap">
          <img src="${avatarSrc}" alt="${escapeHTML(authorName)}" class="story-avatar-img" onerror="this.onerror=null;this.src='${defaultAvatar}';" />
        </div>
        <span class="story-username">${escapeHTML(authorName)}</span>
      `;

      bubble.onclick = () => this.openViewer(idx);
      this.trayElement.appendChild(bubble);
    });
  }

  openCreateModal() {
    if (this.createModalElement) {
      this.createModalElement.classList.add('active');
    }
  }

  closeCreateModal() {
    if (this.createModalElement) {
      this.createModalElement.classList.remove('active');
    }
  }

  async handleCreateStory(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      await api.postForm('/api/stories/', formData);
      toast('Story created successfully!', 'success');
      this.closeCreateModal();
      form.reset();
      await this.loadStories();
    } catch (err) {
      toast(err.message || 'Failed to upload story', 'error');
    }
  }

  openViewer(index) {
    this.currentStoryIndex = index;
    if (!this.modalElement || !this.activeStories[index]) return;

    this.modalElement.classList.add('active');
    this.renderCurrentStory();
  }

  closeViewer() {
    if (this.modalElement) {
      this.modalElement.classList.remove('active');
    }
    clearTimeout(this.timer);
  }

  renderCurrentStory() {
    const story = this.activeStories[this.currentStoryIndex];
    if (!story) {
      this.closeViewer();
      return;
    }

    const container = document.getElementById('story-viewer-content');
    if (!container) return;

    const defaultAvatar = (typeof CONFIG !== 'undefined' && CONFIG.DEFAULT_AVATAR) ? CONFIG.DEFAULT_AVATAR : '';
    const authorAvatar = story.author?.avatar || story.avatar;
    const authorName = story.author?.username || story.username || 'user';
    const avatarSrc = normalizeImageUrl ? normalizeImageUrl(authorAvatar, defaultAvatar) : (authorAvatar || defaultAvatar);
    const mediaSrc = normalizeImageUrl ? normalizeImageUrl(story.media, '') : story.media;

    container.innerHTML = `
      <div class="story-progress-bar"><div class="story-progress-fill"></div></div>
      <div class="story-viewer-header">
        <img src="${avatarSrc}" class="story-viewer-avatar" alt="${escapeHTML(authorName)}" onerror="this.onerror=null;this.src='${defaultAvatar}';" />
        <span class="story-viewer-author">${escapeHTML(authorName)}</span>
        <button class="story-close-btn" id="story-close-btn">&times;</button>
      </div>
      <div class="story-viewer-body">
        <img src="${mediaSrc}" class="story-media-img" alt="Story media" onerror="this.style.display='none';" />
        ${story.caption ? `<p class="story-caption">${escapeHTML(story.caption)}</p>` : ''}
      </div>
    `;

    document.getElementById('story-close-btn')?.addEventListener('click', () => this.closeViewer());

    // Record view
    api.post(`/api/stories/${story.id}/view/`).catch(() => {});

    // Auto advance after 5 seconds
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.currentStoryIndex < this.activeStories.length - 1) {
        this.currentStoryIndex++;
        this.renderCurrentStory();
      } else {
        this.closeViewer();
      }
    }, 5000);
  }
}

export const storyController = new StoryController();
