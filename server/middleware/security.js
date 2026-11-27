// Basic security headers for a JSON API (a small subset of what `helmet` sets).
export function securityHeaders(_req, res, next) {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  });
  next();
}

// API responses contain personal data - don't let browsers or proxies cache them
export function noStore(_req, res, next) {
  res.set('Cache-Control', 'no-store');
  next();
}
