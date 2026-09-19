/**
 * Follows Module: User Relationships & Modal Views
 */

const Follows = {
  inFlight: new Set(),

  /**
   * Toggle follow/unfollow for target user
   */
  async toggleFollow(username, followBtn) {
    if (!Auth.isAuthenticated) {
      Utils.showToast('Please log in to follow users.', 'info');
      return;
    }

    if (this.inFlight.has(username)) return;
    this.inFlight.add(username);

    const isFollowing = followBtn.classList.contains('following');
    const endpoint = isFollowing ? `/users/${username}/unfollow/` : `/users/${username}/follow/`;

    // Disable button while processing
    followBtn.disabled = true;

    try {
      const res = await API.post(endpoint, {});
      const nextFollowingState = res.is_following;

      followBtn.classList.toggle('following', nextFollowingState);
      followBtn.classList.toggle('btn-primary', !nextFollowingState);
      followBtn.classList.toggle('btn-secondary', nextFollowingState);
      followBtn.textContent = nextFollowingState ? 'Following' : 'Follow';

      // Update follower count in profile header if visible
      const followerCountEl = document.getElementById('profile-follower-count');
      if (followerCountEl && res.followers_count !== undefined) {
        followerCountEl.textContent = res.followers_count;
      }

      Utils.showToast(res.detail, 'success');
    } catch (err) {
      Utils.showToast(err.message || 'Action failed', 'error');
    } finally {
      followBtn.disabled = false;
      this.inFlight.delete(username);
    }
  },

  /**
   * Show Followers Modal
   */
  async showFollowersModal(username) {
    this.openUserListModal(`Followers of @${username}`, `/users/${username}/followers/`);
  },

  /**
   * Show Following Modal
   */
  async showFollowingModal(username) {
    this.openUserListModal(`Users followed by @${username}`, `/users/${username}/following/`);
  },

  /**
   * Fetch and display user list in a modal
   */
  async openUserListModal(title, endpoint) {
    const modal = document.getElementById('user-list-modal');
    const titleEl = document.getElementById('user-list-modal-title');
    const bodyEl = document.getElementById('user-list-modal-body');
    if (!modal || !bodyEl) return;

    if (titleEl) titleEl.textContent = title;
    bodyEl.innerHTML = '<div style="text-align: center; padding: 2rem;"><div class="spinner"></div></div>';
    modal.classList.add('active');

    try {
      const res = await API.get(endpoint);
      const profiles = res.results || [];

      bodyEl.innerHTML = '';
      if (profiles.length === 0) {
        bodyEl.innerHTML = '<div class="empty-state"><p>No users found.</p></div>';
        return;
      }

      profiles.forEach(p => {
        const card = document.createElement('div');
        card.className = 'user-list-card';

        const left = document.createElement('div');
        left.className = 'user-list-left';

        const avatar = document.createElement('img');
        avatar.className = 'avatar-sm';
        avatar.src = Utils.normalizeImageUrl(p.avatar, CONFIG.DEFAULT_AVATAR);
        avatar.alt = `${p.username}'s avatar`;
        avatar.onerror = function() {
          this.onerror = null;
          this.src = CONFIG.DEFAULT_AVATAR;
        };

        const info = document.createElement('div');
        const name = document.createElement('a');
        name.style.fontWeight = '700';
        name.style.fontSize = '0.9rem';
        name.style.display = 'block';
        name.textContent = p.display_name || p.username;
        name.href = 'javascript:void(0);';
        name.onclick = () => {
          modal.classList.remove('active');
          ProfileModule.viewUserProfile(p.username);
        };

        const handle = document.createElement('span');
        handle.style.fontSize = '0.8rem';
        handle.style.color = 'var(--text-muted)';
        handle.textContent = `@${p.username}`;

        info.appendChild(name);
        info.appendChild(handle);
        left.appendChild(avatar);
        left.appendChild(info);
        card.appendChild(left);

        // Follow button if not self and authenticated
        if (Auth.isAuthenticated && !p.is_self) {
          const btn = document.createElement('button');
          btn.className = `btn btn-sm ${p.is_following ? 'btn-secondary following' : 'btn-primary'}`;
          btn.textContent = p.is_following ? 'Following' : 'Follow';
          btn.onclick = () => Follows.toggleFollow(p.username, btn);
          card.appendChild(btn);
        }

        bodyEl.appendChild(card);
      });
    } catch (err) {
      bodyEl.innerHTML = '<div style="color: var(--error); padding: 1rem;">Failed to load users.</div>';
    }
  }
};

window.Follows = Follows;
