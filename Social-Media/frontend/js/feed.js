/**
 * Feed Module: Home Timeline, Explore Feed, Search, Skeletons & Transitions
 */

const FeedModule = {
  currentTab: 'following', // 'following' or 'explore'
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  selectedPostImageFile: null,

  /**
   * Initialize Feed View
   */
  async init() {
    this.setupEventListeners();
    await Auth.checkAuth();

    // Default to explore if not logged in, or following if logged in
    if (!Auth.isAuthenticated) {
      this.switchTab('explore');
    } else {
      this.switchTab('following');
    }
  },

  /**
   * Render skeleton cards during initial loading
   */
  renderSkeletonCards(container, count = 3) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="skeleton-card animate-enter">
          <div class="skeleton-header">
            <div class="skeleton-avatar skeleton-shimmer"></div>
            <div class="skeleton-lines">
              <div class="skeleton-line skeleton-shimmer short"></div>
              <div class="skeleton-line skeleton-shimmer" style="width: 25%; height: 8px;"></div>
            </div>
          </div>
          <div class="skeleton-body skeleton-shimmer"></div>
          <div class="skeleton-line skeleton-shimmer" style="width: 30%; height: 16px;"></div>
        </div>
      `;
    }
    container.innerHTML = html;
  },

  /**
   * Setup UI Event Listeners
   */
  setupEventListeners() {
    // Tab switching
    const tabFollowing = document.getElementById('tab-following');
    const tabExplore = document.getElementById('tab-explore');

    if (tabFollowing) {
      tabFollowing.onclick = () => this.switchTab('following');
    }
    if (tabExplore) {
      tabExplore.onclick = () => this.switchTab('explore');
    }

    // Create post form & image attachment
    const postFileInput = document.getElementById('post-image-input');
    const previewContainer = document.getElementById('image-preview-container');
    const previewImg = document.getElementById('image-preview-img');
    const removePreviewBtn = document.getElementById('remove-image-preview-btn');
    const createPostForm = document.getElementById('create-post-form');

    if (postFileInput) {
      postFileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          if (file.size > CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024) {
            Utils.showToast(`File is too large. Max limit is ${CONFIG.MAX_FILE_SIZE_MB}MB.`, 'error');
            postFileInput.value = '';
            return;
          }

          this.selectedPostImageFile = file;
          const reader = new FileReader();
          reader.onload = (re) => {
            previewImg.src = re.target.result;
            previewContainer.classList.add('show');
          };
          reader.readAsDataURL(file);
        }
      };
    }

    if (removePreviewBtn) {
      removePreviewBtn.onclick = () => {
        this.selectedPostImageFile = null;
        if (postFileInput) postFileInput.value = '';
        previewContainer.classList.remove('show');
        previewImg.src = '';
      };
    }

    if (createPostForm) {
      createPostForm.onsubmit = async (e) => {
        e.preventDefault();
        const textarea = document.getElementById('create-post-text');
        const submitBtn = createPostForm.querySelector('button[type="submit"]');

        if (!textarea) return;
        const text = textarea.value.trim();

        if (!text && !this.selectedPostImageFile) {
          Utils.showToast('Please enter some text or attach an image.', 'error');
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Publishing...';

        try {
          const newPost = await Posts.createPost(text, this.selectedPostImageFile);
          if (newPost) {
            textarea.value = '';
            this.selectedPostImageFile = null;
            if (postFileInput) postFileInput.value = '';
            if (previewContainer) previewContainer.classList.remove('show');

            // Prepend new post card to timeline
            const feedList = document.getElementById('posts-timeline');
            if (feedList) {
              const emptyMsg = feedList.querySelector('.empty-state');
              if (emptyMsg) emptyMsg.remove();

              const el = Posts.renderPostElement(newPost);
              feedList.prepend(el);
            }

            // Spawn 3D spatial node in Three.js universe
            if (window.threeUniverse) {
              window.threeUniverse.addPostNode(newPost);
              window.threeUniverse.rebuildConnectionLines();
              window.threeUniverse.triggerPulseAnimation();
            }
          }
        } catch (err) {
          // Handled in createPost
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Publish';
        }
      };
    }

    // Search bar with debounce
    const searchInput = document.getElementById('global-search-input');
    const searchResults = document.getElementById('search-results-overlay');

    if (searchInput && searchResults) {
      const handleSearch = Utils.debounce(async (query) => {
        if (!query.trim()) {
          searchResults.classList.remove('show');
          searchResults.innerHTML = '';
          return;
        }

        searchResults.innerHTML = '<div style="padding: 1rem; text-align: center;"><div class="spinner"></div></div>';
        searchResults.classList.add('show');

        try {
          const res = await API.get(`/search/?q=${encodeURIComponent(query.trim())}`);
          this.renderUnifiedSearchResults(res, searchResults);
        } catch (e) {
          try {
            const fallback = await API.get(`/users/search/?q=${encodeURIComponent(query.trim())}`);
            this.renderSearchResults(fallback.results || fallback || [], searchResults);
          } catch (err) {
            searchResults.innerHTML = '<div style="padding: 1rem; color: var(--error); text-align: center;">Search failed</div>';
          }
        }
      }, 300);

      searchInput.addEventListener('input', (e) => handleSearch(e.target.value));

      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
          searchResults.classList.remove('show');
        }
      });
    }

    // Modal close buttons
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      };
    });

    // Edit Post Save Button
    const saveEditPostBtn = document.getElementById('save-edit-post-btn');
    if (saveEditPostBtn) {
      saveEditPostBtn.onclick = () => {
        const modal = document.getElementById('edit-post-modal');
        const textarea = document.getElementById('edit-post-textarea');
        if (modal && textarea) {
          Posts.saveEditedPost(modal.dataset.postId, textarea.value);
        }
      };
    }

    // Post Options Modal Buttons
    const optionEditBtn = document.getElementById('post-option-edit-btn');
    const optionDeleteBtn = document.getElementById('post-option-delete-btn');
    if (optionEditBtn) {
      optionEditBtn.onclick = () => {
        const modal = document.getElementById('post-options-modal');
        if (modal) {
          const postId = modal.dataset.postId;
          const content = modal.dataset.postContent;
          modal.classList.remove('active');
          Posts.openEditModal(postId, content);
        }
      };
    }
    if (optionDeleteBtn) {
      optionDeleteBtn.onclick = () => {
        const modal = document.getElementById('post-options-modal');
        if (modal) {
          const postId = modal.dataset.postId;
          Posts.deletePost(postId);
        }
      };
    }

    // Report Post Form
    const reportPostForm = document.getElementById('report-post-form');
    if (reportPostForm) {
      reportPostForm.onsubmit = (e) => {
        e.preventDefault();
        const postId = reportPostForm.dataset.postId;
        const reason = document.getElementById('report-reason-select')?.value || 'other';
        const details = document.getElementById('report-details-input')?.value || '';
        if (postId) {
          Posts.submitReport(postId, reason, details);
        }
      };
    }

    // Edit Profile Form & Avatar preview
    const editProfileForm = document.getElementById('edit-profile-form');
    const editAvatarInput = document.getElementById('edit-avatar-input');
    const editAvatarPreview = document.getElementById('edit-avatar-preview');

    if (editAvatarInput && editAvatarPreview) {
      editAvatarInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (re) => {
            editAvatarPreview.src = re.target.result;
          };
          reader.readAsDataURL(file);
        }
      };
    }

    if (editProfileForm) {
      editProfileForm.onsubmit = async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('edit-profile-name');
        const bioInput = document.getElementById('edit-profile-bio');
        const submitBtn = editProfileForm.querySelector('button[type="submit"]');

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Saving...';
        }

        const formData = new FormData();
        if (nameInput) formData.append('display_name', nameInput.value.trim());
        if (bioInput) formData.append('bio', bioInput.value.trim());
        if (editAvatarInput && editAvatarInput.files[0]) {
          formData.append('avatar', editAvatarInput.files[0]);
        }

        await ProfileModule.saveProfile(formData);

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Save Profile';
        }
      };
    }
  },

  /**
   * Switch between Following Feed & Explore
   */
  switchTab(tab) {
    this.currentTab = tab;
    this.currentPage = 1;

    const tabFollowing = document.getElementById('tab-following');
    const tabExplore = document.getElementById('tab-explore');

    if (tabFollowing && tabExplore) {
      tabFollowing.classList.toggle('active', tab === 'following');
      tabExplore.classList.toggle('active', tab === 'explore');
    }

    this.showFeed();
    this.loadPosts(true);
  },

  /**
   * Load Saved / Bookmarked Posts
   */
  async loadSavedPosts() {
    this.currentTab = 'saved';
    this.currentPage = 1;

    const tabFollowing = document.getElementById('tab-following');
    const tabExplore = document.getElementById('tab-explore');

    if (tabFollowing && tabExplore) {
      tabFollowing.classList.remove('active');
      tabExplore.classList.remove('active');
    }

    this.showFeed();
    this.loadPosts(true);
  },

  /**
   * Load Posts filtered by Hashtag
   */
  async loadFeedByHashtag(tag) {
    this.currentTab = 'hashtag';
    this.currentHashtag = tag;
    this.currentPage = 1;

    const tabFollowing = document.getElementById('tab-following');
    const tabExplore = document.getElementById('tab-explore');

    if (tabFollowing && tabExplore) {
      tabFollowing.classList.remove('active');
      tabExplore.classList.remove('active');
    }

    this.showFeed();
    this.loadPosts(true);
  },

  /**
   * Show Main Feed view (and hide profile if active)
   */
  showFeed() {
    const feedView = document.getElementById('main-feed-view');
    const profileView = document.getElementById('main-profile-view');
    const communitiesView = document.getElementById('communities-view');
    if (communitiesView) communitiesView.style.display = 'none';
    if (feedView && profileView) {
      feedView.style.display = 'block';
      profileView.style.display = 'none';
    }
  },

  /**
   * Load posts for current tab & page
   */
  async loadPosts(reset = false) {
    if (this.isLoading) return;
    this.isLoading = true;

    const list = document.getElementById('posts-timeline');
    const loadMoreBtn = document.getElementById('load-more-posts-btn');
    if (!list) return;

    if (reset) {
      this.renderSkeletonCards(list, 3);
    }

    let endpoint = '/posts/';
    if (this.currentTab === 'following') {
      endpoint = '/feed/';
    } else if (this.currentTab === 'saved') {
      endpoint = '/posts/saved/';
    } else if (this.currentTab === 'hashtag' && this.currentHashtag) {
      endpoint = `/hashtags/${encodeURIComponent(this.currentHashtag)}/posts/`;
    }

    try {
      const res = await API.get(endpoint, { page: this.currentPage });
      const posts = res.results || [];
      this.totalPages = res.total_pages || 1;

      if (reset) {
        list.innerHTML = '';
      }

      if (posts.length === 0 && reset) {
        let emptyText = 'No posts published yet. Be the first to share something!';
        if (this.currentTab === 'following') {
          emptyText = 'Your feed is empty! Follow other users to see their posts here, or switch to the Explore tab.';
        } else if (this.currentTab === 'saved') {
          emptyText = 'You have no saved posts yet. Click the bookmark icon on any post to save it here.';
        } else if (this.currentTab === 'hashtag') {
          emptyText = `No posts found with hashtag #${this.currentHashtag}.`;
        }

        list.innerHTML = `<div class="empty-state animate-enter">
          <div class="empty-state-icon">✨</div>
          <div class="empty-state-title">No Posts Found</div>
          <p>${emptyText}</p>
        </div>`;
      } else {
        posts.forEach(post => {
          list.appendChild(Posts.renderPostElement(post));
        });
      }

      if (loadMoreBtn) {
        if (this.currentPage < this.totalPages) {
          loadMoreBtn.style.display = 'inline-flex';
        } else {
          loadMoreBtn.style.display = 'none';
        }
      }
    } catch (err) {
      if (reset) {
        list.innerHTML = '<div style="color: var(--error); padding: 1.5rem; text-align: center;">Failed to load posts.</div>';
      }
    } finally {
      this.isLoading = false;
    }
  },

  /**
   * Load next page
   */
  loadMore() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPosts(false);
    }
  },

  /**
   * Render Unified Multi-Entity Search Results (Users, Hashtags, Posts)
   */
  renderUnifiedSearchResults(data, container) {
    container.innerHTML = '';
    const users = data.users || [];
    const hashtags = data.hashtags || [];
    const posts = data.posts || [];

    if (users.length === 0 && hashtags.length === 0 && posts.length === 0) {
      container.innerHTML = '<div style="padding: 1.25rem; color: var(--text-muted); font-size: 0.9rem; text-align: center;">No matches found</div>';
      container.classList.add('show');
      return;
    }

    if (users.length > 0) {
      const heading = document.createElement('div');
      heading.style.padding = '6px 12px';
      heading.style.fontSize = '11px';
      heading.style.fontWeight = '700';
      heading.style.color = 'var(--text-muted)';
      heading.style.textTransform = 'uppercase';
      heading.textContent = 'People';
      container.appendChild(heading);

      users.forEach(u => {
        const item = document.createElement('div');
        item.className = 'search-user-item';
        const left = document.createElement('div');
        left.className = 'search-user-left';

        const avatar = document.createElement('img');
        avatar.className = 'avatar-sm';
        avatar.src = Utils.normalizeImageUrl(u.avatar, CONFIG.DEFAULT_AVATAR);
        avatar.alt = `${u.username}'s avatar`;
        avatar.onerror = function() {
          this.onerror = null;
          this.src = CONFIG.DEFAULT_AVATAR;
        };

        const details = document.createElement('div');
        const name = document.createElement('div');
        name.style.fontWeight = '700';
        name.style.fontSize = '0.9rem';
        name.textContent = u.display_name || u.username;

        const handle = document.createElement('div');
        handle.style.fontSize = '0.8rem';
        handle.style.color = 'var(--text-muted)';
        handle.textContent = `@${u.username}`;

        details.appendChild(name);
        details.appendChild(handle);
        left.appendChild(avatar);
        left.appendChild(details);
        item.appendChild(left);

        item.onclick = () => {
          container.classList.remove('show');
          ProfileModule.viewUserProfile(u.username);
        };
        container.appendChild(item);
      });
    }

    if (hashtags.length > 0) {
      const heading = document.createElement('div');
      heading.style.padding = '6px 12px';
      heading.style.fontSize = '11px';
      heading.style.fontWeight = '700';
      heading.style.color = 'var(--text-muted)';
      heading.style.textTransform = 'uppercase';
      heading.textContent = 'Hashtags';
      container.appendChild(heading);

      hashtags.forEach(tag => {
        const tagName = tag.name || tag;
        const item = document.createElement('div');
        item.className = 'search-user-item';
        item.style.padding = '8px 12px';
        item.style.cursor = 'pointer';
        item.innerHTML = `<span style="color: var(--primary-accent); font-weight: 600;">#${Utils.escapeHTML(tagName)}</span>`;
        item.onclick = () => {
          container.classList.remove('show');
          this.loadFeedByHashtag(tagName);
        };
        container.appendChild(item);
      });
    }

    if (posts.length > 0) {
      const heading = document.createElement('div');
      heading.style.padding = '6px 12px';
      heading.style.fontSize = '11px';
      heading.style.fontWeight = '700';
      heading.style.color = 'var(--text-muted)';
      heading.style.textTransform = 'uppercase';
      heading.textContent = 'Posts';
      container.appendChild(heading);

      posts.forEach(p => {
        const item = document.createElement('div');
        item.className = 'search-user-item';
        item.style.padding = '8px 12px';
        item.style.cursor = 'pointer';
        item.innerHTML = `
          <div style="font-size: 13px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 260px;">
            ${Utils.escapeHTML(p.content || '')}
          </div>
        `;
        item.onclick = () => {
          container.classList.remove('show');
          Utils.showToast(`Selected post by @${p.author?.username || 'user'}`, 'info');
        };
        container.appendChild(item);
      });
    }

    container.classList.add('show');
  },

  /**
   * Render User Search Results dropdown safely
   */
  renderSearchResults(users, container) {
    container.innerHTML = '';
    if (users.length === 0) {
      container.innerHTML = '<div style="padding: 1.25rem; color: var(--text-muted); font-size: 0.9rem; text-align: center;">No users found matching your query</div>';
      container.classList.add('show');
      return;
    }

    users.forEach(u => {
      const item = document.createElement('div');
      item.className = 'search-user-item';

      const left = document.createElement('div');
      left.className = 'search-user-left';

      const avatar = document.createElement('img');
      avatar.className = 'avatar-sm';
      avatar.src = Utils.normalizeImageUrl(u.avatar, CONFIG.DEFAULT_AVATAR);
      avatar.alt = `${u.username}'s avatar`;
      avatar.onerror = function() {
        this.onerror = null;
        this.src = CONFIG.DEFAULT_AVATAR;
      };

      const details = document.createElement('div');
      const name = document.createElement('div');
      name.style.fontWeight = '700';
      name.style.fontSize = '0.9rem';
      name.textContent = u.display_name || u.username;

      const handle = document.createElement('div');
      handle.style.fontSize = '0.8rem';
      handle.style.color = 'var(--text-muted)';
      handle.textContent = `@${u.username}`;

      details.appendChild(name);
      details.appendChild(handle);
      left.appendChild(avatar);
      left.appendChild(details);
      item.appendChild(left);

      item.onclick = () => {
        container.classList.remove('show');
        ProfileModule.viewUserProfile(u.username);
      };

      container.appendChild(item);
    });

    container.classList.add('show');
  }
};

window.FeedModule = FeedModule;
window.loadSavedPosts = () => FeedModule.loadSavedPosts();
window.loadFeedByHashtag = (tag) => FeedModule.loadFeedByHashtag(tag);

document.addEventListener('DOMContentLoaded', () => {
  FeedModule.init();
});
