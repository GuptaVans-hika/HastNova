import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { securityHeaders, noStore } from './middleware/security.js';

const app = express();

app.disable('x-powered-by');
// Only trust X-Forwarded-For when deployed behind a real proxy (Render/Railway/Nginx): TRUST_PROXY=1.
// Otherwise anyone could fake their IP in that header and get around the rate limits.
app.set('trust proxy', env.trustProxy);
app.use(securityHeaders);

app.use(
  cors({
    origin(origin, cb) {
      // allow tools like curl/Postman (no origin) and the configured frontend(s)
      if (!origin || env.clientUrls.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
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
