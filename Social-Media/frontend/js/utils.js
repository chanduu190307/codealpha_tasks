/**
 * Utilities, Theme Manager, 3D Canvas, Card Tilt & Modal Helpers
 */

const Utils = {
  /**
   * Escape string for safe HTML rendering
   */
  escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Get cookie value by name (e.g. csrftoken)
   */
  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  },

  /**
   * Formats ISO timestamp to human friendly relative time
   */
  formatRelativeTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  },

  /**
   * Debounce helper
   */
  debounce(func, delay = 300) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  },

  /**
   * Toast notification display
   */
  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconMap = {
      success: '✓',
      error: '✕',
      info: 'ℹ'
    };

    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.textContent = iconMap[type] || 'ℹ';

    const msg = document.createElement('span');
    msg.className = 'toast-message';
    msg.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(msg);
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 350);
    }, 4000);
  },

  /**
   * Promise-based Accessible Custom Confirmation Dialog
   * Replaces native window.confirm()
   */
  confirm(options = {}) {
    return new Promise((resolve) => {
      const modal = document.getElementById('custom-confirm-modal');
      const titleEl = document.getElementById('confirm-modal-title');
      const msgEl = document.getElementById('confirm-modal-message');
      const okBtn = document.getElementById('confirm-modal-ok-btn');
      const cancelBtn = document.getElementById('confirm-modal-cancel-btn');
      const closeBtn = document.getElementById('confirm-modal-close-btn');

      if (!modal || !okBtn || !cancelBtn) {
        resolve(window.confirm(options.message || 'Are you sure?'));
        return;
      }

      if (titleEl) titleEl.textContent = options.title || 'Confirm Action';
      if (msgEl) msgEl.textContent = options.message || 'Are you sure you want to proceed?';
      if (okBtn) {
        okBtn.textContent = options.confirmText || 'Confirm';
        okBtn.className = options.isDanger !== false ? 'btn btn-danger' : 'btn btn-primary';
      }

      modal.classList.add('active');

      const cleanup = (result) => {
        modal.classList.remove('active');
        okBtn.onclick = null;
        cancelBtn.onclick = null;
        if (closeBtn) closeBtn.onclick = null;
        resolve(result);
      };

      okBtn.onclick = () => cleanup(true);
      cancelBtn.onclick = () => cleanup(false);
      if (closeBtn) closeBtn.onclick = () => cleanup(false);
    });
  },

  /**
   * Promise-based Accessible Custom Prompt Dialog
   * Replaces native window.prompt()
   */
  prompt(options = {}) {
    return new Promise((resolve) => {
      const modal = document.getElementById('custom-prompt-modal');
      const titleEl = document.getElementById('prompt-modal-title');
      const msgEl = document.getElementById('prompt-modal-message');
      const inputEl = document.getElementById('prompt-modal-input');
      const okBtn = document.getElementById('prompt-modal-ok-btn');
      const cancelBtn = document.getElementById('prompt-modal-cancel-btn');
      const closeBtn = document.getElementById('prompt-modal-close-btn');

      if (!modal || !inputEl || !okBtn || !cancelBtn) {
        resolve(window.prompt(options.message || 'Enter value:', options.defaultValue || ''));
        return;
      }

      if (titleEl) titleEl.textContent = options.title || 'Edit';
      if (msgEl) msgEl.textContent = options.message || '';
      inputEl.value = options.defaultValue || '';
      inputEl.placeholder = options.placeholder || '';

      modal.classList.add('active');
      setTimeout(() => inputEl.focus(), 50);

      const cleanup = (val) => {
        modal.classList.remove('active');
        okBtn.onclick = null;
        cancelBtn.onclick = null;
        if (closeBtn) closeBtn.onclick = null;
        resolve(val);
      };

      okBtn.onclick = () => cleanup(inputEl.value);
      cancelBtn.onclick = () => cleanup(null);
      if (closeBtn) closeBtn.onclick = () => cleanup(null);
    });
  },

  /**
   * 3D Tilt Effect on elements
   */
  apply3DTilt(element) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  },

  /**
   * One consistent image URL normalization mechanism.
   * Correctly handles:
   * - https://images.unsplash.com/... & absolute URLs
   * - /media/... & media/...
   * - data: and blob:
   * - missing / null / empty values
   */
  normalizeImageUrl(url, fallback = null) {
    if (!url || typeof url !== 'string' || !url.trim()) {
      return fallback;
    }
    const clean = url.trim();
    if (clean.startsWith('data:') || clean.startsWith('blob:') || /^https?:\/\//i.test(clean)) {
      return clean;
    }
    if (clean.startsWith('/media/')) {
      return clean;
    }
    if (clean.startsWith('media/')) {
      return `/${clean}`;
    }
    if (clean.startsWith('/')) {
      return clean;
    }
    return `/media/${clean}`;
  },

  /**
   * Deterministic fallback avatar
   */
  getFallbackAvatar(identifier = '') {
    if (typeof CONFIG !== 'undefined' && CONFIG.DEFAULT_AVATAR) {
      return CONFIG.DEFAULT_AVATAR;
    }
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
  }
};

/**
 * Theme Manager (Dark / Light Mode)
 */
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('pulse_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = saved || (prefersDark ? 'dark' : 'dark');

    this.setTheme(initialTheme);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
      };
    }
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pulse_theme', theme);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
      toggleBtn.title = `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`;
    }
  }
};

/**
 * Image Lightbox Viewer
 */
const Lightbox = {
  open(src) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    if (!modal || !img) return;

    img.src = src;
    modal.classList.add('active');
  },

  close() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) modal.classList.remove('active');
  },

  init() {
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.getElementById('lightbox-close-btn');

    if (closeBtn) {
      closeBtn.onclick = () => this.close();
    }
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) this.close();
      };
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }
};

/**
 * Interactive Particle / Node Background Canvas Engine
 */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(45, Math.floor((width * height) / 25000));

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(99, 102, 241, ' : 'rgba(236, 72, 153, '
    });
  }

  let mouseX = width / 2;
  let mouseY = height / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function render() {
    if (document.hidden) {
      requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw particle glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.6)';
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          const alpha = (1 - dist / 130) * 0.18;
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

const toast = (msg, type = 'info') => Utils.showToast(msg, type);
const escapeHTML = (str) => Utils.escapeHTML(str);
const normalizeImageUrl = (url, fallback = null) => Utils.normalizeImageUrl(url, fallback);

if (typeof window !== 'undefined') {
  window.Utils = Utils;
  window.ThemeManager = ThemeManager;
  window.Lightbox = Lightbox;
  window.toast = toast;
  window.escapeHTML = escapeHTML;
  window.normalizeImageUrl = normalizeImageUrl;
}

function initUtils() {
  ThemeManager.init();
  Lightbox.init();
  initBackgroundCanvas();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUtils);
  } else {
    initUtils();
  }
}

export { Utils, ThemeManager, Lightbox, toast, escapeHTML, normalizeImageUrl };
export default Utils;
