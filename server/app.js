import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { notFound, errorHandler, AppError } from './middleware/errorHandler.js';
import { securityHeaders, noStore } from './middleware/security.js';

// Same site = the page and the API share one address (Vercel, or the Vite dev proxy)
function isSameSite(req, origin) {
  try {
    return new URL(origin).host === (req.headers['x-forwarded-host'] || req.headers.host);
  } catch {
    return false;
  }
}

const app = express();

app.disable('x-powered-by');
// Only trust X-Forwarded-For when deployed behind a real proxy (Render/Railway/Nginx): TRUST_PROXY=1.
// Otherwise anyone could fake their IP in that header and get around the rate limits.
app.set('trust proxy', env.trustProxy);
app.use(securityHeaders);

app.use(
  cors((req, cb) => {
    const origin = req.headers.origin;
    // allow tools like curl/Postman (no origin), the site itself, and the configured frontend(s)
    if (!origin || isSameSite(req, origin) || env.clientUrls.includes(origin)) {
      return cb(null, { origin: true, credentials: true });
    }
    return cb(new AppError(`This website (${origin}) is not allowed to use the HastaNova API.`, 403));
  })
);
app.use(express.json({ limit: '100kb' }));

if (!env.isProd) {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`));
    next();
  });
}

app.get('/', (_req, res) => res.json({ success: true, message: 'HastaNova API. See /api/health' }));
app.use('/api', noStore, apiLimiter, apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
