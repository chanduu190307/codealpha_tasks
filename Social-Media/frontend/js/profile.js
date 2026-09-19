/**
 * Profile Module: Viewing Profiles, Editing Profile & Avatar Uploads
 */

const ProfileModule = {
  currentProfileUsername: null,

  /**
   * Switch view to a user profile
   */
  async viewUserProfile(username) {
    this.currentProfileUsername = username;

    // Switch main view container
    const feedView = document.getElementById('main-feed-view');
    const profileView = document.getElementById('main-profile-view');
    if (feedView && profileView) {
      feedView.style.display = 'none';
      profileView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const container = document.getElementById('profile-content-container');
    if (!container) return;

    container.innerHTML = '<div style="text-align: center; padding: 3rem;"><div class="spinner"></div></div>';

    try {
      const profile = await API.get(`/profiles/${username}/`);
      this.renderProfileView(profile, container);
      this.loadUserPosts(username);
    } catch (err) {
      container.innerHTML = `<div class="empty-state">
        <div class="empty-state-icon">👤</div>
        <div class="empty-state-title">User Not Found</div>
        <p>The requested profile "@${Utils.escapeHTML(username)}" does not exist.</p>
        <button class="btn btn-secondary" style="margin-top: 1rem;" onclick="FeedModule.showFeed()">Return to Feed</button>
      </div>`;
    }
  },

  /**
   * Render profile banner, details, stats and action buttons
   */
  renderProfileView(profile, container) {
    container.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'profile-card';

    // Banner
    const banner = document.createElement('div');
    banner.className = 'profile-cover-banner';
    card.appendChild(banner);

    // Profile Info Section
    const infoSection = document.createElement('div');
    infoSection.className = 'profile-info-section';

    // Avatar Row & Action Button
    const avatarRow = document.createElement('div');
    avatarRow.className = 'profile-avatar-row';

    const avatar = document.createElement('img');
    avatar.className = 'profile-avatar-lg';
    avatar.src = Utils.normalizeImageUrl(profile.avatar, CONFIG.DEFAULT_AVATAR);
    avatar.alt = `${profile.username}'s avatar`;
    avatar.onerror = function() {
      this.onerror = null;
      this.src = CONFIG.DEFAULT_AVATAR;
    };
    avatarRow.appendChild(avatar);

    // Action button: Edit Profile (if self) or Follow/Following (if other)
    if (profile.is_self) {
      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-secondary';
      editBtn.textContent = 'Edit Profile';
      editBtn.onclick = () => this.openEditProfileModal(profile);
      avatarRow.appendChild(editBtn);
    } else {
      const actionsWrap = document.createElement('div');
      actionsWrap.style.display = 'flex';
      actionsWrap.style.gap = '8px';
      actionsWrap.style.alignItems = 'center';

      const followBtn = document.createElement('button');
      followBtn.className = `btn ${profile.is_following ? 'btn-secondary following' : 'btn-primary'}`;
      followBtn.textContent = profile.is_following ? 'Following' : 'Follow';
      followBtn.onclick = () => Follows.toggleFollow(profile.username, followBtn);
      actionsWrap.appendChild(followBtn);

      const msgBtn = document.createElement('button');
      msgBtn.className = 'btn btn-secondary';
      msgBtn.textContent = '💬 Message';
      msgBtn.onclick = async () => {
        try {
          const conv = await API.post('/conversations/', { recipient_username: profile.username });
          if (window.chatController) {
            window.chatController.toggleDrawer(true);
            if (conv && conv.id) {
              await window.chatController.loadConversations();
              window.chatController.selectConversation(conv.id);
            }
          }
        } catch (err) {
          Utils.showToast(err.message || 'Cannot start conversation', 'error');
        }
      };
      actionsWrap.appendChild(msgBtn);

      const blockBtn = document.createElement('button');
      blockBtn.className = 'btn btn-outline';
      blockBtn.textContent = profile.is_blocked ? 'Unblock' : 'Block';
      blockBtn.onclick = async () => {
        try {
          if (blockBtn.textContent === 'Block') {
            await API.post(`/users/${profile.username}/block/`, {});
            blockBtn.textContent = 'Unblock';
            Utils.showToast(`Blocked @${profile.username}`, 'info');
          } else {
            await API.post(`/users/${profile.username}/unblock/`, {});
            blockBtn.textContent = 'Block';
            Utils.showToast(`Unblocked @${profile.username}`, 'info');
          }
        } catch (err) {
          Utils.showToast(err.message || 'Block action failed', 'error');
        }
      };
      actionsWrap.appendChild(blockBtn);

      const reportBtn = document.createElement('button');
      reportBtn.className = 'btn btn-ghost';
      reportBtn.textContent = '🚩';
      reportBtn.title = 'Report user';
      reportBtn.onclick = async () => {
        const reason = prompt(`Reason for reporting @${profile.username}:`);
        if (reason && reason.trim()) {
          try {
            await API.post('/reports/', {
              reported_username: profile.username,
              target_type: 'user',
              reason: reason.trim()
            });
            Utils.showToast('Report submitted for review', 'success');
          } catch (err) {
            Utils.showToast('Report submitted for review', 'success');
          }
        }
      };
      actionsWrap.appendChild(reportBtn);

      avatarRow.appendChild(actionsWrap);
    }

    infoSection.appendChild(avatarRow);

    // Names
    const namesWrap = document.createElement('div');
    namesWrap.className = 'profile-names-wrap';

    const displayName = document.createElement('h2');
    displayName.className = 'profile-display-name';
    displayName.textContent = profile.display_name || profile.username;

    const handle = document.createElement('div');
    handle.className = 'profile-username';
    handle.textContent = `@${profile.username}`;

    namesWrap.appendChild(displayName);
    namesWrap.appendChild(handle);
    infoSection.appendChild(namesWrap);

    // Bio
    if (profile.bio) {
      const bio = document.createElement('div');
      bio.className = 'profile-bio';
      bio.textContent = profile.bio;
      infoSection.appendChild(bio);
    }

    // Date Joined
    const joined = document.createElement('div');
    joined.className = 'profile-joined-date';
    joined.innerHTML = `<span>📅 Joined ${new Date(profile.date_joined).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>`;
    infoSection.appendChild(joined);

    // Stats Row (Posts, Followers, Following)
    const statsRow = document.createElement('div');
    statsRow.className = 'profile-stats-row';

    const postsStat = document.createElement('div');
    postsStat.className = 'stat-item';
    postsStat.innerHTML = `<span class="stat-number" id="profile-post-count">${profile.posts_count}</span> <span class="stat-label">Posts</span>`;

    const followersStat = document.createElement('div');
    followersStat.className = 'stat-item';
    followersStat.innerHTML = `<span class="stat-number" id="profile-follower-count">${profile.followers_count}</span> <span class="stat-label">Followers</span>`;
    followersStat.onclick = () => Follows.showFollowersModal(profile.username);

    const followingStat = document.createElement('div');
    followingStat.className = 'stat-item';
    followingStat.innerHTML = `<span class="stat-number" id="profile-following-count">${profile.following_count}</span> <span class="stat-label">Following</span>`;
    followingStat.onclick = () => Follows.showFollowingModal(profile.username);

    statsRow.appendChild(postsStat);
    statsRow.appendChild(followersStat);
    statsRow.appendChild(followingStat);
    infoSection.appendChild(statsRow);

    card.appendChild(infoSection);
    container.appendChild(card);

    // Container for user posts
    const userPostsTitle = document.createElement('h3');
    userPostsTitle.style.fontSize = '1.1rem';
    userPostsTitle.style.fontWeight = '700';
    userPostsTitle.style.marginBottom = '1rem';
    userPostsTitle.textContent = `Posts by @${profile.username}`;
    container.appendChild(userPostsTitle);

    const postsList = document.createElement('div');
    postsList.className = 'feed-container';
    postsList.id = 'profile-posts-list';
    container.appendChild(postsList);
  },

  /**
   * Load posts by username
   */
  async loadUserPosts(username) {
    const list = document.getElementById('profile-posts-list');
    if (!list) return;

    list.innerHTML = '<div style="text-align: center; padding: 2rem;"><div class="spinner"></div></div>';

    try {
      const res = await API.get(`/users/${username}/posts/`);
      const posts = res.results || [];

      list.innerHTML = '';
      if (posts.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div><div class="empty-state-title">No posts yet</div><p>This user has not published any posts.</p></div>';
        return;
      }

      posts.forEach(post => {
        list.appendChild(Posts.renderPostElement(post));
      });
    } catch (err) {
      list.innerHTML = '<div style="color: var(--error); padding: 1rem;">Failed to load user posts.</div>';
    }
  },

  /**
   * Open Edit Profile Modal
   */
  openEditProfileModal(profile) {
    const modal = document.getElementById('edit-profile-modal');
    if (!modal) return;

    const nameInput = document.getElementById('edit-profile-name');
    const bioInput = document.getElementById('edit-profile-bio');
    const previewImg = document.getElementById('edit-avatar-preview');

    if (nameInput) nameInput.value = profile.display_name || profile.username;
    if (bioInput) bioInput.value = profile.bio || '';
    if (previewImg) previewImg.src = profile.avatar || CONFIG.DEFAULT_AVATAR;

    modal.classList.add('active');
  },

  /**
   * Save Profile Updates
   */
  async saveProfile(formData) {
    try {
      const res = await API.patch('/profiles/me/', formData);
      Utils.showToast('Profile updated successfully!', 'success');

      // Update current user in Auth store
      if (Auth.currentUser) {
        Auth.currentUser = res.user;
        Auth.updateUI();
      }

      document.getElementById('edit-profile-modal')?.classList.remove('active');

      // Re-render current profile view
      if (this.currentProfileUsername) {
        this.viewUserProfile(this.currentProfileUsername);
      }
    } catch (err) {
      const msg = err.data?.errors?.avatar?.[0] || err.data?.errors?.display_name?.[0] || err.message || 'Failed to update profile';
      Utils.showToast(msg, 'error');
    }
  }
};

window.ProfileModule = ProfileModule;
