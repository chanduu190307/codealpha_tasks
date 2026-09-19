/**
 * Secure Unified API Client with CSRF handling & session credentials
 */

const API = {
  csrfToken: null,

  /**
   * Fetch CSRF token from backend
   */
  async ensureCSRF() {
    let cookieToken = Utils.getCookie('csrftoken');
    if (cookieToken) {
      this.csrfToken = cookieToken;
      return cookieToken;
    }

    try {
      const response = await fetch(`${CONFIG.API_BASE}/auth/csrf/`, {
        method: 'GET',
        credentials: 'same-origin'
      });
      const data = await response.json();
      if (data.csrfToken) {
        this.csrfToken = data.csrfToken;
        return data.csrfToken;
      }
    } catch (e) {
      console.warn('Could not fetch CSRF token:', e);
    }
    return Utils.getCookie('csrftoken');
  },

  /**
   * Generic secure request wrapper
   */
  async request(endpoint, options = {}) {
    let url;
    if (endpoint.startsWith('http')) {
      url = endpoint;
    } else if (endpoint.startsWith('/api/') || endpoint === '/api') {
      url = endpoint;
    } else if (endpoint.startsWith('/')) {
      url = `${CONFIG.API_BASE}${endpoint}`;
    } else {
      url = `${CONFIG.API_BASE}/${endpoint}`;
    }
    const method = (options.method || 'GET').toUpperCase();

    const headers = options.headers || {};
    
    // Attach CSRF token for mutating HTTP methods
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      await this.ensureCSRF();
      const token = this.csrfToken || Utils.getCookie('csrftoken');
      if (token) {
        headers['X-CSRFToken'] = token;
      }
    }

    const fetchOptions = {
      method,
      headers,
      credentials: 'same-origin',
      ...options
    };

    // Auto handle JSON body
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      fetchOptions.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, fetchOptions);
      
      // Update CSRF token from cookie if changed
      const updatedCookie = Utils.getCookie('csrftoken');
      if (updatedCookie) {
        this.csrfToken = updatedCookie;
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return { success: true };
      }

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { detail: text };
      }

      if (!response.ok) {
        const error = new Error(data.detail || (data.errors ? JSON.stringify(data.errors) : 'Request failed'));
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      // Re-throw with enriched details
      throw error;
    }
  },

  get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url, { method: 'GET' });
  },

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'POST', body, ...options });
  },

  postForm(endpoint, formData, options = {}) {
    return this.request(endpoint, { method: 'POST', body: formData, ...options });
  },

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'PATCH', body, ...options });
  },

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'PUT', body, ...options });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};

if (typeof window !== 'undefined') {
  window.API = API;
  window.api = API;
}

export const api = API;
export { API };
export default API;

