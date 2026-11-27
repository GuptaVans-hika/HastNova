# HastaNova - Server

Express + MongoDB API with JWT auth, zod validation, rate limiting and free AI (Groq → Gemini → seed).

```bash
npm install
cp .env.example .env   # fill MONGODB_URI, JWT_SECRET, GROQ_API_KEY, GEMINI_API_KEY
npm run seed           # crafts, standard roadmaps, workshops/NGOs, fallback trends
npm run check-ai       # test both AI keys
npm run dev            # http://localhost:5000
```

Setup, AI design, API docs, cURL examples and the testing checklist are in the main [README](../README.md).
