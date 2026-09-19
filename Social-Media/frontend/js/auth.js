/**
 * Authentication Management Module
 */

const Auth = {
  currentUser: null,
  isAuthenticated: false,
  listeners: [],

  /**
   * Register a listener callback for auth state changes
   */
  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    // Trigger immediately with current state if resolved
    if (this.currentUser !== undefined) {
      callback(this.currentUser);
    }
  },

  notifyListeners() {
    this.listeners.forEach(fn => fn(this.currentUser));
  },

  /**
   * Check current session auth status
   */
  async checkAuth() {
    try {
      const data = await API.get('/auth/me/');
      if (data.authenticated && data.user) {
        this.currentUser = data.user;
        this.isAuthenticated = true;
      } else {
        this.currentUser = null;
        this.isAuthenticated = false;
      }
    } catch (e) {
      this.currentUser = null;
      this.isAuthenticated = false;
    }
    this.notifyListeners();
    this.updateUI();
    return this.currentUser;
  },

  /**
   * Login user
   */
  async login(username, password) {
    const data = await API.post('/auth/login/', { username, password });
    if (data.success && data.user) {
      this.currentUser = data.user;
      this.isAuthenticated = true;
      this.notifyListeners();
      this.updateUI();
    }
    return data;
  },

  /**
   * Register new user
   */
  async register(username, email, password, passwordConfirm) {
    const data = await API.post('/auth/register/', {
      username,
      email,
      password,
      password_confirm: passwordConfirm
    });
    if (data.success && data.user) {
      this.currentUser = data.user;
      this.isAuthenticated = true;
      this.notifyListeners();
      this.updateUI();
    }
    return data;
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await API.post('/auth/logout/', {});
    } catch (e) {
      console.warn('Logout API error:', e);
    }
    this.currentUser = null;
    this.isAuthenticated = false;
    this.notifyListeners();
    this.updateUI();
    Utils.showToast('Logged out successfully', 'info');
    if (window.location.pathname.includes('feed') || window.location.pathname.includes('profile')) {
      window.location.href = '/login/';
    }
  },

  /**
   * Update dynamic navbar and auth-dependent UI
   */
  updateUI() {
    const authElements = document.querySelectorAll('.auth-only');
    const guestElements = document.querySelectorAll('.guest-only');
    const userAvatarEls = document.querySelectorAll('.current-user-avatar');
    const userDisplayNameEls = document.querySelectorAll('.current-user-name');
    const userHandleEls = document.querySelectorAll('.current-user-handle');

    if (this.isAuthenticated && this.currentUser) {
      authElements.forEach(el => el.style.display = '');
      guestElements.forEach(el => el.style.display = 'none');

      const avatarSrc = Utils.normalizeImageUrl(this.currentUser.avatar, CONFIG.DEFAULT_AVATAR);
      userAvatarEls.forEach(el => {
        if (el.tagName === 'IMG') {
          el.src = avatarSrc;
          el.onerror = function() {
            this.onerror = null;
            this.src = CONFIG.DEFAULT_AVATAR;
          };
        }
      });

      userDisplayNameEls.forEach(el => {
        el.textContent = this.currentUser.display_name || this.currentUser.username;
      });

      userHandleEls.forEach(el => {
        el.textContent = `@${this.currentUser.username}`;
      });
    } else {
      authElements.forEach(el => el.style.display = 'none');
      guestElements.forEach(el => el.style.display = '');
    }
  }
};

window.Auth = Auth;
