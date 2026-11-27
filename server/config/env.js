import 'dotenv/config';

const required = ['MONGODB_URI', 'JWT_SECRET'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`❌ Missing required env vars: ${missing.join(', ')}. Copy .env.example to .env and fill them in.`);
  process.exit(1);
}

if (/<[A-Z_]*PASSWORD[A-Z_]*>|<password>/i.test(process.env.MONGODB_URI)) {
  console.error('❌ MONGODB_URI still contains a password placeholder. Open server/.env and put your Atlas database password in it.');
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  console.warn('⚠️  JWT_SECRET is shorter than 32 characters. Use a long random string in production.');
}

const list = (v, fallback) =>
  (v || fallback)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
const num = (v, fallback) => (Number.isFinite(Number(v)) && v !== '' && v !== undefined ? Number(v) : fallback);

export const env = {
  port: num(process.env.PORT, 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrls: list(process.env.CLIENT_URL, 'http://localhost:5173'),
  trustProxy: num(process.env.TRUST_PROXY, 0), // number of trusted proxy hops in front of the API

  llm: {
    order: list(process.env.LLM_PROVIDER_ORDER, 'groq,gemini'),
    timeoutMs: num(process.env.LLM_TIMEOUT_MS, 45000),
    groq: {
      apiKey: process.env.GROQ_API_KEY || '',
      models: list(process.env.GROQ_MODELS, 'openai/gpt-oss-120b,qwen/qwen3.8-27b'),
      baseUrl: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
      rpm: num(process.env.GROQ_RPM, 20),
      rpd: num(process.env.GROQ_RPD, 800),
      tpm: num(process.env.GROQ_TPM, 7000),
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY || '',
      models: list(process.env.GEMINI_MODELS, 'gemini-flash-lite-latest,gemini-3.5-flash-lite,gemini-flash-latest'),
      baseUrl: process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
      rpm: num(process.env.GEMINI_RPM, 8),
      rpd: num(process.env.GEMINI_RPD, 200),
      tpm: num(process.env.GEMINI_TPM, 200000),
    },
  },

  trendsTtlDays: num(process.env.TRENDS_TTL_DAYS, 7),
  roadmapRegenerationsPerDay: num(process.env.ROADMAP_REGENERATIONS_PER_DAY, 3),
};
