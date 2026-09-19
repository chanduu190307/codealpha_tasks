/**
 * CSRF Protection Middleware for Express
 * Validates X-CSRFToken header against the csrftoken cookie on state-changing methods.
 */
export function csrfMiddleware(req, res, next) {
  // Safe HTTP methods don't mutate state
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Exempt public registration, login, and csrf fetch
  const exemptPaths = ['/api/auth/login/', '/api/auth/register/', '/api/auth/csrf/', '/api/login/', '/api/register/'];
  if (exemptPaths.includes(req.path)) {
    return next();
  }

  // If request uses Authorization Bearer token header, it is immune to browser CSRF
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return next();
  }

  // Check if cookies are present
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return next();
  }

  // Parse cookies
  const cookies = {};
  cookieHeader.split(';').forEach(c => {
    const [k, v] = c.trim().split('=');
    if (k) cookies[k] = decodeURIComponent(v || '');
  });

  // If user has session/auth cookie, verify CSRF token
  if (cookies.pulse_token || cookies.sessionid) {
    const expectedToken = cookies.csrftoken;
    const providedToken = req.headers['x-csrftoken'] || req.headers['x-csrf-token'] || req.body?.csrfmiddlewaretoken;

    if (!expectedToken || !providedToken || expectedToken !== providedToken) {
      return res.status(403).json({
        success: false,
        detail: 'CSRF verification failed. Request rejected.'
      });
    }
  }

  next();
}
