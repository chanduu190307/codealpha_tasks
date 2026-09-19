/**
 * Comments Module: Viewing, Adding, Editing & Deleting Comments with Custom Dialogs
 */

const Comments = {
  /**
   * Toggle and load comments for a post
   */
  async toggleComments(postId) {
    const container = document.getElementById(`comments-section-${postId}`);
    if (!container) return;

    if (container.classList.contains('open')) {
      container.classList.remove('open');
      return;
    }

    container.classList.add('open');
    container.innerHTML = `
      <div style="padding: 0.5rem 0;">
        <div class="skeleton-card" style="padding: 0.75rem; margin-bottom: 0.5rem;">
          <div class="skeleton-header" style="margin-bottom: 0;">
            <div class="skeleton-avatar skeleton-shimmer" style="width: 28px; height: 28px;"></div>
            <div class="skeleton-lines">
              <div class="skeleton-line skeleton-shimmer" style="height: 10px; width: 60%;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    try {
      const data = await API.get(`/posts/${postId}/comments/`);
      this.renderCommentsSection(postId, data.results || [], container);
    } catch (err) {
      container.innerHTML = '<div style="color: var(--error); padding: 0.5rem; font-size: 0.85rem;">Failed to load comments.</div>';
    }
  },

  /**
   * Render comment container with input form and comment list
   */
  renderCommentsSection(postId, comments, container) {
    container.innerHTML = '';

    // Input form (if authenticated)
    if (Auth.isAuthenticated) {
      const formWrap = document.createElement('form');
      formWrap.className = 'comment-input-wrap';
      formWrap.onsubmit = (e) => {
        e.preventDefault();
        const input = formWrap.querySelector('.comment-input');
        const submitBtn = formWrap.querySelector('button[type="submit"]');
        if (input && input.value.trim()) {
          Comments.addComment(postId, input.value.trim(), input, submitBtn);
        }
      };

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'comment-input';
      input.placeholder = 'Write a comment...';
      input.maxLength = 1000;
      input.autocomplete = 'off';

      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.className = 'btn btn-primary btn-sm';
      submitBtn.textContent = 'Post';

      formWrap.appendChild(input);
      formWrap.appendChild(submitBtn);
      container.appendChild(formWrap);
    } else {
      const loginPrompt = document.createElement('div');
      loginPrompt.style.fontSize = '0.85rem';
      loginPrompt.style.color = 'var(--text-muted)';
      loginPrompt.style.marginBottom = '1rem';
      loginPrompt.innerHTML = '<a href="/login/" style="color: var(--accent-primary); font-weight: 600;">Log in</a> to join the conversation.';
      container.appendChild(loginPrompt);
    }

    // Comment list
    const list = document.createElement('div');
    list.className = 'comment-list';
    list.id = `comment-list-${postId}`;

    if (comments.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-comment-msg';
      empty.style.color = 'var(--text-muted)';
      empty.style.fontSize = '0.85rem';
      empty.style.padding = '0.5rem 0';
      empty.textContent = 'No comments yet. Be the first to comment!';
      list.appendChild(empty);
    } else {
      comments.forEach(comment => {
        list.appendChild(this.renderCommentItem(comment));
      });
    }

    container.appendChild(list);
  },

  /**
   * Render single comment item safely
   */
  renderCommentItem(comment) {
    const item = document.createElement('div');
    item.className = 'comment-item animate-enter';
    item.id = `comment-${comment.id}`;

    const avatar = document.createElement('img');
    avatar.className = 'comment-avatar';
    avatar.src = Utils.normalizeImageUrl(comment.author?.avatar, CONFIG.DEFAULT_AVATAR);
    avatar.alt = `${comment.author?.username || 'user'}'s avatar`;
    avatar.onerror = function() {
      this.onerror = null;
      this.src = CONFIG.DEFAULT_AVATAR;
    };

    const bubble = document.createElement('div');
    bubble.className = 'comment-bubble';

    const row = document.createElement('div');
    row.className = 'comment-author-row';

    const authorName = document.createElement('a');
    authorName.className = 'comment-author-name';
    authorName.textContent = comment.author.display_name || comment.author.username;
    authorName.href = 'javascript:void(0);';
    authorName.onclick = () => ProfileModule.viewUserProfile(comment.author.username);

    const time = document.createElement('span');
    time.className = 'comment-time';
    time.textContent = Utils.formatRelativeTime(comment.created_at);

    row.appendChild(authorName);
    row.appendChild(time);
    bubble.appendChild(row);

    const text = document.createElement('div');
    text.className = 'comment-text';
    text.textContent = comment.content;
    bubble.appendChild(text);

    // Comment Actions (Edit / Delete if author)
    if (comment.is_author) {
      const actions = document.createElement('div');
      actions.className = 'comment-actions';

      const editBtn = document.createElement('span');
      editBtn.className = 'comment-action-btn';
      editBtn.textContent = 'Edit';
      editBtn.onclick = () => Comments.promptEditComment(comment.id, comment.content);

      const delBtn = document.createElement('span');
      delBtn.className = 'comment-action-btn';
      delBtn.textContent = 'Delete';
      delBtn.style.color = 'var(--error)';
      delBtn.onclick = () => Comments.deleteComment(comment.id, comment.post);

      actions.appendChild(editBtn);
      actions.appendChild(document.createTextNode(' • '));
      actions.appendChild(delBtn);
      bubble.appendChild(actions);
    }

    item.appendChild(avatar);
    item.appendChild(bubble);
    return item;
  },

  /**
   * Add a new comment with loading state and counter sync
   */
  async addComment(postId, content, inputElement, submitBtn) {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '...';
    }

    try {
      const res = await API.post(`/posts/${postId}/comments/`, { content });
      if (inputElement) inputElement.value = '';

      const list = document.getElementById(`comment-list-${postId}`);
      if (list) {
        const emptyMsg = list.querySelector('.empty-comment-msg');
        if (emptyMsg) emptyMsg.remove();

        const newEl = this.renderCommentItem(res.comment);
        list.appendChild(newEl);
      }

      // Update post comment counter
      const counter = document.getElementById(`comment-count-${postId}`);
      if (counter) {
        const current = parseInt(counter.textContent, 10) || 0;
        counter.textContent = current + 1;
      }
      Utils.showToast('Comment added!', 'success');
    } catch (err) {
      Utils.showToast(err.message || 'Failed to add comment', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post';
      }
    }
  },

  /**
   * Prompt to edit comment using accessible Custom Prompt Modal
   */
  async promptEditComment(commentId, currentContent) {
    const updated = await Utils.prompt({
      title: 'Edit Comment',
      message: 'Update your comment text below:',
      defaultValue: currentContent,
      placeholder: 'Enter updated comment...'
    });

    if (updated !== null && updated.trim() && updated.trim() !== currentContent) {
      this.editComment(commentId, updated.trim());
    }
  },

  /**
   * Save edited comment
   */
  async editComment(commentId, newContent) {
    try {
      const res = await API.patch(`/comments/${commentId}/`, { content: newContent });
      Utils.showToast('Comment updated successfully', 'success');

      const el = document.getElementById(`comment-${commentId}`);
      if (el) {
        const textEl = el.querySelector('.comment-text');
        if (textEl) {
          textEl.textContent = res.comment.content;
          textEl.style.animation = 'postEnter 0.3s ease';
        }
      }
    } catch (err) {
      Utils.showToast(err.message || 'Failed to edit comment', 'error');
    }
  },

  /**
   * Delete comment using Accessible Custom Confirm Modal
   */
  async deleteComment(commentId, postId) {
    const confirmed = await Utils.confirm({
      title: 'Delete Comment',
      message: 'Are you sure you want to delete this comment? This cannot be undone.',
      confirmText: 'Delete',
      isDanger: true
    });

    if (!confirmed) return;

    try {
      await API.delete(`/comments/${commentId}/`);
      Utils.showToast('Comment deleted successfully', 'info');

      const el = document.getElementById(`comment-${commentId}`);
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-8px)';
        setTimeout(() => el.remove(), 300);
      }

      // Decrement comment counter
      const counter = document.getElementById(`comment-count-${postId}`);
      if (counter) {
        const current = parseInt(counter.textContent, 10) || 0;
        if (current > 0) counter.textContent = current - 1;
      }
    } catch (err) {
      Utils.showToast(err.message || 'Failed to delete comment', 'error');
    }
  }
};

window.Comments = Comments;
