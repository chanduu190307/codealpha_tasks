/**
 * Likes Module: Toggle Post Like/Unlike
 */

const Likes = {
  inFlight: new Set(),

  async toggleLike(postId) {
    if (!Auth.isAuthenticated) {
      Utils.showToast('Please log in to like posts.', 'info');
      return;
    }

    if (this.inFlight.has(postId)) return;
    this.inFlight.add(postId);

    const btn = document.getElementById(`like-btn-${postId}`);
    const countEl = document.getElementById(`like-count-${postId}`);
    if (!btn || !countEl) {
      this.inFlight.delete(postId);
      return;
    }

    const isCurrentlyLiked = btn.classList.contains('liked');
    const endpoint = isCurrentlyLiked ? `/posts/${postId}/unlike/` : `/posts/${postId}/like/`;

    // Optimistic UI update
    const currentCount = parseInt(countEl.textContent, 10) || 0;
    const nextLiked = !isCurrentlyLiked;
    const nextCount = nextLiked ? currentCount + 1 : Math.max(0, currentCount - 1);

    btn.classList.toggle('liked', nextLiked);
    const icon = btn.querySelector('.action-icon');
    if (icon) icon.textContent = nextLiked ? '♥' : '♡';
    countEl.textContent = nextCount;

    try {
      const res = await API.post(endpoint, {});
      // Reconcile with exact server counts
      if (res.likes_count !== undefined) {
        countEl.textContent = res.likes_count;
      }
      if (res.is_liked !== undefined) {
        btn.classList.toggle('liked', res.is_liked);
        if (icon) icon.textContent = res.is_liked ? '♥' : '♡';
      }
    } catch (err) {
      // Revert on failure
      btn.classList.toggle('liked', isCurrentlyLiked);
      if (icon) icon.textContent = isCurrentlyLiked ? '♥' : '♡';
      countEl.textContent = currentCount;
      Utils.showToast(err.message || 'Could not update like status', 'error');
    } finally {
      this.inFlight.delete(postId);
    }
  }
};

window.Likes = Likes;
