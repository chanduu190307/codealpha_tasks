/**
 * Posts Module: Post Creation, Rendering, 3D Tilt, Lightbox, Editing & Deleting
 */

const Posts = {
  /**
   * Create a new post
   */
  async createPost(content, imageFile) {
    if (!content.trim() && !imageFile) {
      Utils.showToast('Please enter some text or attach an image.', 'error');
      return null;
    }

    const formData = new FormData();
    if (content.trim()) {
      formData.append('content', content.trim());
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const res = await API.post('/posts/', formData);
      Utils.showToast('Post published successfully!', 'success');
      return res.post;
    } catch (err) {
      const errorMsg = err.data?.errors?.content?.[0] || err.data?.errors?.image?.[0] || err.message || 'Failed to create post';
      Utils.showToast(errorMsg, 'error');
      throw err;
    }
  },

  /**
   * Render a single post card safely using DOM methods with 3D tilt and animation
   */
  renderPostElement(post) {
    const card = document.createElement('article');
    card.className = 'post-card animate-enter';
    card.id = `post-${post.id}`;
    card.dataset.postId = post.id;

    // Apply interactive 3D perspective tilt
    Utils.apply3DTilt(card);

    // 1. Post Header
    const header = document.createElement('div');
    header.className = 'post-header';

    const authorInfo = document.createElement('div');
    authorInfo.className = 'post-author-info';

    const avatarLink = document.createElement('a');
    avatarLink.href = `javascript:void(0);`;
    avatarLink.onclick = () => ProfileModule.viewUserProfile(post.author.username);

    const avatarImg = document.createElement('img');
    avatarImg.className = 'post-author-avatar';
    const rawAvatar = post.author?.avatar;
    avatarImg.src = Utils.normalizeImageUrl(rawAvatar, CONFIG.DEFAULT_AVATAR);
    avatarImg.alt = `${post.author?.username || 'user'}'s avatar`;
    avatarImg.onerror = function() {
      this.onerror = null;
      this.src = CONFIG.DEFAULT_AVATAR;
    };
    avatarLink.appendChild(avatarImg);

    const namesWrap = document.createElement('div');
    namesWrap.className = 'post-author-names';

    const displayName = document.createElement('a');
    displayName.className = 'post-display-name';
    displayName.textContent = post.author.display_name || post.author.username;
    displayName.href = `javascript:void(0);`;
    displayName.onclick = () => ProfileModule.viewUserProfile(post.author.username);

    const meta = document.createElement('div');
    meta.className = 'post-meta';

    const handleSpan = document.createElement('span');
    handleSpan.textContent = `@${post.author.username}`;

    const dot = document.createElement('span');
    dot.textContent = '•';

    const timeSpan = document.createElement('span');
    timeSpan.textContent = Utils.formatRelativeTime(post.created_at);

    meta.appendChild(handleSpan);
    meta.appendChild(dot);
    meta.appendChild(timeSpan);

    namesWrap.appendChild(displayName);
    namesWrap.appendChild(meta);

    authorInfo.appendChild(avatarLink);
    authorInfo.appendChild(namesWrap);
    header.appendChild(authorInfo);

    // Always show post options menu button (•••)
    const menuBtn = document.createElement('button');
    menuBtn.className = 'post-menu-btn';
    menuBtn.innerHTML = '⋮';
    menuBtn.title = 'Post Options';
    menuBtn.setAttribute('aria-label', 'Post Options');
    menuBtn.onclick = (e) => {
      e.stopPropagation();
      Posts.showPostOptionsModal(post);
    };
    header.appendChild(menuBtn);

    card.appendChild(header);

    // 2. Post Content
    if (post.content) {
      const contentEl = document.createElement('div');
      contentEl.className = 'post-content';
      contentEl.textContent = post.content;
      card.appendChild(contentEl);
    }

    // 3. Post Image (with Lightbox Zoom & Graceful Error Handling)
    if (post.image) {
      const normPostImage = Utils.normalizeImageUrl(post.image);
      if (normPostImage) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'post-image-container';
        imgContainer.title = 'Click to zoom in';

        const img = document.createElement('img');
        img.src = normPostImage;
        img.alt = 'Post attachment';
        img.loading = 'lazy';
        img.onerror = function() {
          imgContainer.style.display = 'none';
        };

        imgContainer.onclick = () => Lightbox.open(normPostImage);
        imgContainer.appendChild(img);
        card.appendChild(imgContainer);
      }
    }

    // 4. Post Action Bar (Like & Comment buttons)
    const actionsBar = document.createElement('div');
    actionsBar.className = 'post-actions-bar';

    // Like Button
    const likeBtn = document.createElement('button');
    likeBtn.className = `action-btn ${post.is_liked ? 'liked' : ''}`;
    likeBtn.id = `like-btn-${post.id}`;

    const likeIcon = document.createElement('span');
    likeIcon.className = 'action-icon';
    likeIcon.textContent = post.is_liked ? '♥' : '♡';

    const likeCount = document.createElement('span');
    likeCount.className = 'action-count';
    likeCount.id = `like-count-${post.id}`;
    likeCount.textContent = post.likes_count;

    likeBtn.appendChild(likeIcon);
    likeBtn.appendChild(likeCount);

    likeBtn.onclick = () => Likes.toggleLike(post.id);

    // Comment Toggle Button
    const commentBtn = document.createElement('button');
    commentBtn.className = 'action-btn';
    commentBtn.id = `comment-toggle-btn-${post.id}`;

    const commentIcon = document.createElement('span');
    commentIcon.className = 'action-icon';
    commentIcon.textContent = '💬';

    const commentCount = document.createElement('span');
    commentCount.className = 'action-count';
    commentCount.id = `comment-count-${post.id}`;
    commentCount.textContent = post.comments_count;

    commentBtn.appendChild(commentIcon);
    commentBtn.appendChild(commentCount);

    commentBtn.onclick = () => Comments.toggleComments(post.id);

    actionsBar.appendChild(likeBtn);
    actionsBar.appendChild(commentBtn);
    card.appendChild(actionsBar);

    // 5. Comments Section (Accordion container)
    const commentsSection = document.createElement('div');
    commentsSection.className = 'comments-section';
    commentsSection.id = `comments-section-${post.id}`;
    card.appendChild(commentsSection);

    return card;
  },

  /**
   * Show contextual options modal for post (owner actions vs visitor actions)
   */
  showPostOptionsModal(post) {
    const modal = document.getElementById('post-options-modal');
    const list = document.getElementById('post-options-list');
    if (!modal || !list) return;

    list.innerHTML = '';

    // Robust ownership resolution: check server-provided is_author or fallback to client auth state
    const isOwner = Boolean(
      post.is_author ||
      (Auth.currentUser && post.author && (
        (post.author.id && Auth.currentUser.id === post.author.id) ||
        (post.author.username && Auth.currentUser.username === post.author.username)
      ))
    );

    // If current user is author/owner, provide Edit and Delete options
    if (isOwner) {
      // Edit Post
      const editBtn = document.createElement('button');
      editBtn.className = 'post-option-item';
      editBtn.innerHTML = '<span class="post-option-icon">✏️</span><span>Edit Post</span>';
      editBtn.onclick = () => {
        modal.classList.remove('active');
        Posts.openEditModal(post.id, post.content || '');
      };
      list.appendChild(editBtn);

      // Delete Post (Danger)
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'post-option-item danger';
      deleteBtn.id = `post-option-delete-btn-${post.id}`;
      deleteBtn.innerHTML = '<span class="post-option-icon">🗑️</span><span>Delete Post</span>';
      deleteBtn.onclick = () => {
        modal.classList.remove('active');
        Posts.deletePost(post.id);
      };
      list.appendChild(deleteBtn);
    }

    // Save / Bookmark Post (All users)
    const bookmarkBtn = document.createElement('button');
    bookmarkBtn.className = 'post-option-item';
    bookmarkBtn.innerHTML = `<span class="post-option-icon">🔖</span><span>${post.is_bookmarked ? 'Unsave Post' : 'Save Post'}</span>`;
    bookmarkBtn.onclick = async () => {
      modal.classList.remove('active');
      await Posts.toggleBookmark(post);
    };
    list.appendChild(bookmarkBtn);

    // Copy Link (All users)
    const copyBtn = document.createElement('button');
    copyBtn.className = 'post-option-item';
    copyBtn.innerHTML = '<span class="post-option-icon">📋</span><span>Copy Link</span>';
    copyBtn.onclick = () => {
      modal.classList.remove('active');
      Posts.copyPostLink(post.id);
    };
    list.appendChild(copyBtn);

    // Visitor actions (Non-owners only)
    if (!isOwner) {
      // Hide Post
      const hideBtn = document.createElement('button');
      hideBtn.className = 'post-option-item';
      hideBtn.innerHTML = '<span class="post-option-icon">🚫</span><span>Hide Post</span>';
      hideBtn.onclick = () => {
        modal.classList.remove('active');
        Posts.hidePost(post.id);
      };
      list.appendChild(hideBtn);

      // Not Interested
      const notIntBtn = document.createElement('button');
      notIntBtn.className = 'post-option-item';
      notIntBtn.innerHTML = '<span class="post-option-icon">👎</span><span>Not Interested</span>';
      notIntBtn.onclick = () => {
        modal.classList.remove('active');
        Posts.notInterestedPost(post.id);
      };
      list.appendChild(notIntBtn);

      // Report Post
      const reportBtn = document.createElement('button');
      reportBtn.className = 'post-option-item danger';
      reportBtn.innerHTML = '<span class="post-option-icon">🚩</span><span>Report Post</span>';
      reportBtn.onclick = () => {
        modal.classList.remove('active');
        Posts.openReportModal(post.id);
      };
      list.appendChild(reportBtn);
    }

    modal.dataset.postId = post.id;
    modal.dataset.postContent = post.content || '';
    modal.classList.add('active');
  },

  /**
   * Open Edit Post Modal
   */
  openEditModal(postId, currentContent) {
    const editModal = document.getElementById('edit-post-modal');
    const textarea = document.getElementById('edit-post-textarea');
    if (!editModal || !textarea) return;

    editModal.dataset.postId = postId;
    textarea.value = currentContent;
    editModal.classList.add('active');
    setTimeout(() => textarea.focus(), 50);
  },

  /**
   * Save edited post
   */
  async saveEditedPost(postId, newContent) {
    if (!newContent.trim()) {
      Utils.showToast('Post content cannot be empty.', 'error');
      return;
    }

    try {
      const res = await API.patch(`/posts/${postId}/`, { content: newContent.trim() });
      Utils.showToast('Post updated successfully!', 'success');

      // Update in DOM
      const card = document.getElementById(`post-${postId}`);
      if (card) {
        const contentEl = card.querySelector('.post-content');
        if (contentEl) {
          contentEl.textContent = res.post.content;
        }
      }

      document.getElementById('edit-post-modal')?.classList.remove('active');
    } catch (err) {
      Utils.showToast(err.message || 'Failed to update post', 'error');
    }
  },

  /**
   * Delete post using Accessible Custom Confirm Modal
   */
  async deletePost(postId) {
    document.getElementById('post-options-modal')?.classList.remove('active');

    const confirmed = await Utils.confirm({
      title: 'Delete Post',
      message: 'Are you sure you want to permanently delete this post? This action cannot be undone.',
      confirmText: 'Delete Post',
      isDanger: true
    });

    if (!confirmed) return;

    try {
      await API.delete(`/posts/${postId}/`);
      Utils.showToast('Post deleted successfully.', 'info');

      // Remove from DOM with smooth fade
      const card = document.getElementById(`post-${postId}`);
      if (card) {
        card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.92) translateY(-10px)';
        setTimeout(() => card.remove(), 350);
      }

      // Update post counter if on profile page
      const countEl = document.getElementById('profile-posts-count');
      if (countEl) {
        const currentCount = parseInt(countEl.textContent, 10);
        if (!isNaN(currentCount) && currentCount > 0) {
          countEl.textContent = currentCount - 1;
        }
      }
    } catch (err) {
      Utils.showToast(err.message || 'Failed to delete post', 'error');
    }
  },

  /**
   * Toggle Bookmark / Save Post
   */
  async toggleBookmark(post) {
    const endpoint = post.is_bookmarked ? `/posts/${post.id}/unbookmark/` : `/posts/${post.id}/bookmark/`;
    try {
      await API.post(endpoint);
      post.is_bookmarked = !post.is_bookmarked;
      Utils.showToast(post.is_bookmarked ? 'Post saved to bookmarks.' : 'Post removed from bookmarks.', 'success');
    } catch (err) {
      Utils.showToast(err.message || 'Failed to bookmark post', 'error');
    }
  },

  /**
   * Copy direct link to post
   */
  copyPostLink(postId) {
    const url = `${window.location.origin}/#post-${postId}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => Utils.showToast('Post link copied to clipboard!', 'success'))
        .catch(() => Utils.showToast('Failed to copy link', 'error'));
    } else {
      Utils.showToast('Direct link: ' + url, 'info');
    }
  },

  /**
   * Hide Post from Feed
   */
  async hidePost(postId) {
    try {
      await API.post(`/discovery/posts/${postId}/hide/`);
      Utils.showToast('Post hidden from your feed.', 'info');
      const card = document.getElementById(`post-${postId}`);
      if (card) {
        card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.92) translateY(-10px)';
        setTimeout(() => card.remove(), 350);
      }
    } catch (err) {
      Utils.showToast(err.message || 'Failed to hide post', 'error');
    }
  },

  /**
   * Signal Not Interested in Post
   */
  async notInterestedPost(postId) {
    try {
      await API.post(`/discovery/posts/${postId}/not-interested/`);
      Utils.showToast("We'll tune your feed to show less like this.", 'info');
      const card = document.getElementById(`post-${postId}`);
      if (card) {
        card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.92) translateY(-10px)';
        setTimeout(() => card.remove(), 350);
      }
    } catch (err) {
      Utils.showToast(err.message || 'Failed to submit preference', 'error');
    }
  },

  /**
   * Open Report Post Modal
   */
  openReportModal(postId) {
    const modal = document.getElementById('report-post-modal');
    const form = document.getElementById('report-post-form');
    if (!modal || !form) return;

    form.dataset.postId = postId;
    form.reset();
    modal.classList.add('active');
  },

  /**
   * Submit Report for a Post
   */
  async submitReport(postId, reason, description) {
    try {
      await API.post('/moderation/reports/', {
        target_type: 'post',
        target_id: postId,
        reason: reason,
        description: description || ''
      });
      Utils.showToast('Thank you. Your report has been submitted to moderators.', 'success');
      document.getElementById('report-post-modal')?.classList.remove('active');
    } catch (err) {
      Utils.showToast(err.message || 'Failed to submit report', 'error');
    }
  }
};

window.Posts = Posts;
