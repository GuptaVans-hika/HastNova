# HastaNova

**Seekho. Badho. Kamao. (Learn. Grow. Earn.)**

HastaNova is a free, mobile-first learning platform for Indian artisans (karigars) - like Coursera or Udemy,
but for crafts. Artisans pick a craft, follow an **AI-personalised roadmap** for their level, find
**workshops and NGOs**, and see **AI-curated market trends** (what sells, demand, fair prices in INR).

Crafts: Pottery & Ceramics, Woodwork, Weaving, Textile, Paperwork, Metalwork, Crocheting.

| Part | Stack |
|---|---|
| Client (`/client`) | React 18 (Vite), Tailwind CSS, React Router, Axios, Recharts |
| Server (`/server`) | Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, zod, express-rate-limit |
| AI | **Free tiers only**: Groq (primary) → Google Gemini (backup) → seeded data (fallback) |

---

## How the AI works

AI is used in exactly two places, always on the **server** (keys never reach the browser):

**1. Personal roadmaps** - `GET /api/roadmap/:craft/:level`
- The first time a user opens a level, the AI writes 5-6 steps **for that user**, using their craft, level,
  years of experience, city/state, bio and craft story.
- It is saved in MongoDB (`userroadmaps`) and never changes by itself, so progress ("craft + level + step
  number") stays correct. Opening it again costs no AI call.
- "New AI roadmap" (`POST .../regenerate`, 3 per user per day) writes a new one and resets that level's ticks.
- If the AI is unavailable, the user gets a copy of the standard seeded roadmap (labelled "Standard roadmap").
- **Step lessons** - `GET /api/roadmap/:craft/:level/steps/:order`: tapping a step opens a full AI lesson
  (overview paragraphs, why it matters, how-to instructions, a practice task, common mistakes, safety,
  "ready to move on when…" and an earning tip). Written once per step, saved on that step, and removed
  if the roadmap is regenerated.

**2. Market trends** - `GET /api/trends/:craft`
- AI result under 7 days old → served from MongoDB.
- Older or missing → ask Groq → if it fails/is rate-limited, ask Gemini → if both fail, serve the last AI
  result (marked `stale`) or the seeded data.
- When 50 people open the same craft at once, only **one** AI call is made.

**Safety rails:** strict JSON-only prompts, every answer validated with zod before saving, each provider tries
a list of models (retired/overloaded models are skipped), per-provider budgets below the free limits
(requests/minute, requests/day, tokens/minute), automatic pause after a 429, per-user AI rate limits.

---

## Folder structure

```
KarigarSkill/
├── README.md                ← this file
├── client/                  React app
│   ├── .env                 VITE_API_URL=/api
│   ├── vite.config.js       dev proxy /api -> http://localhost:5000
│   └── src/
│       ├── components/      ui/ (Button, Card, Badge, Input, Select, Toast, Skeleton, ProgressBar),
│       │                    layout/ (PublicLayout, AppLayout, SmartLayout), RoadmapView, TrendsPanel,
│       │                    OpportunityList, OpportunityCard, CraftCard, LoginPrompt, ...
│       ├── context/         AuthContext (JWT), CraftsContext (catalogue), ToastContext
│       ├── data/            faqs.js (static FAQ text only - no mock data)
│       ├── pages/           Landing, Auth, Dashboard, Profile, Explore, CraftDetail, MyLearning,
│       │                    Roadmap, Opportunities, MarketTrends, FAQ, About, NotFound
│       └── services/        api (axios + JWT), authService, profileService, craftService,
│                            roadmapService, trendsService, opportunityService, mappers, helpers
└── server/                  Express API
    ├── .env                 secrets (never commit)
    ├── config/              env.js, db.js, constants.js
    ├── models/              User, Craft, Roadmap, UserRoadmap, Opportunity, MarketTrends
    ├── routes/              index.js (all /api routes), auth, profile, roadmap
    ├── controllers/         auth, profile, craft, learning, roadmap, opportunity, trends
    ├── middleware/          auth (JWT), validate + schemas (zod), rateLimit, security, errorHandler
    ├── services/
    │   ├── llm/             index.js (one interface), groqProvider, geminiProvider, budget, http
    │   ├── trendsService.js     cache -> Groq -> Gemini -> seed
    │   ├── roadmapService.js    personal AI roadmaps
    │   ├── progressService.js   progress %, next step
    │   └── tokenService.js      JWT
    ├── scripts/checkAI.js   npm run check-ai
    └── seed/                seed.js + one data file per craft
```

---

## Setup (Windows, macOS or Linux)

You need **Node.js 18+** (`node -v`).

### 1. MongoDB - pick one

**Local (Windows):** install MongoDB Community Server (`winget install MongoDB.Server`, or the installer from
mongodb.com). It runs as a Windows service. Connection string: `mongodb://127.0.0.1:27017/karigarskill`

**Atlas (free cloud):** mongodb.com/atlas → create a free **M0** cluster → *Database Access*: add a user →
*Network Access*: add your IP → *Connect → Drivers*: copy the `mongodb+srv://...` string and add
`/karigarskill` before the `?`.

To browse the data, install **MongoDB Compass** and connect with the same string.

### 2. Free AI keys (no credit card)

**Groq:** go to **console.groq.com** → sign in → **API Keys** → **Create API Key** → copy it (starts with `gsk_`).

**Gemini:** go to **aistudio.google.com** → sign in with Google → **Get API key** → **Create API key** → copy it.

Keep keys secret: only in `server/.env`, never in the client, never in chat or Git.
The app still works without keys (seeded data only), and with just one of the two.

### 3. Server

```bash
cd KarigarSkill/server
npm install
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
```

Edit `server/.env`:

| Variable | What to put |
|---|---|
| `MONGODB_URI` | your local or Atlas connection string |
| `JWT_SECRET` | a long random string: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `GROQ_API_KEY`, `GEMINI_API_KEY` | your free keys |
| `GROQ_MODELS`, `GEMINI_MODELS` | model lists (defaults work; providers retire models - edit if `check-ai` fails) |
| `CLIENT_URL` | `http://localhost:5173` |
| `TRUST_PROXY` | `0` locally, `1` when deployed behind a proxy (Render/Railway/Nginx) |

```bash
npm run seed        # 7 crafts, standard roadmaps, workshops/NGOs, fallback trends (keeps users)
npm run check-ai    # optional: tests both AI keys with one small request each
npm run dev         # API on http://localhost:5000 (restarts on file changes)
```

### 4. Client

```bash
cd KarigarSkill/client
npm install
npm run dev         # http://localhost:5173
```

The client calls `/api` by default (optional: `cp .env.example .env` to change `VITE_API_URL`); Vite forwards
`/api` to `http://localhost:5000`, so no CORS setup is needed in development. For a deployed site, set `VITE_API_URL` to the full API URL (e.g.
`https://your-api.onrender.com/api`) and add the site's URL to the server's `CLIENT_URL`.

Run **both** `npm run dev` commands, each in its own terminal.

---

## API (short)

All responses are JSON: `{ success: true, ... }` or `{ success: false, message, details? }`
(`details` = `[{ field, message }]` for form errors). Protected routes need `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/health` | - | DB + AI status |
| POST | `/api/auth/register` | - | phone, password, fullName, age, location `{city,state}`, primaryCraft, experienceYears, bio, craftStory |
| POST | `/api/auth/login` | - | `{ phone, password }`. 5 failures/15 min per IP+phone, 10/hour per phone |
| GET / PUT | `/api/profile` | JWT | PUT is partial; `phone`/`password` cannot be changed |
| GET | `/api/crafts` | optional | Public catalogue; `enrolled` when logged in |
| GET | `/api/crafts/:craft` | optional | Detail + standard roadmap preview; `progress` when logged in |
| POST | `/api/crafts/:craft/enroll` | JWT | 201 new / 200 already enrolled |
| GET | `/api/my-learning` | JWT | Enrolled crafts with `percent`, `nextStep` |
| GET | `/api/roadmap/:craft/:level` | JWT | **AI** personal roadmap (created on first visit) |
| GET | `/api/roadmap/:craft/:level/steps/:order` | JWT | **AI** detailed lesson for one step (written once, then saved) |
| POST | `/api/roadmap/:craft/:level/regenerate` | JWT | **AI** new roadmap, resets that level (3/day) |
| POST | `/api/roadmap/progress` | JWT | `{ craft, level, order, completed? }` (omit `completed` to toggle) |
| GET | `/api/opportunities?craft=&type=&location=` | JWT | type = Workshop / NGO |
| GET | `/api/trends/:craft` | JWT | **AI** trends (cached 7 days) + `chart` data |

`:craft` = `pottery | woodwork | weaving | textile | paperwork | metalwork | crocheting`;
`:level` = `beginner | intermediate | advanced` (any case).

### Quick cURL test (Git Bash / macOS / Linux)

```bash
API=http://localhost:5000/api
curl $API/health
curl -X POST $API/auth/register -H "Content-Type: application/json" -d '{"phone":"9876543210","password":"secret123","fullName":"Ramesh Kumar","age":32,"location":{"city":"Khurja","state":"Uttar Pradesh"},"primaryCraft":"pottery","experienceYears":3,"bio":"Potter from Khurja","craftStory":"Learned from my father."}'
TOKEN=paste-token-here
curl $API/roadmap/pottery/beginner -H "Authorization: Bearer $TOKEN"
curl -X POST $API/roadmap/progress -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"craft":"pottery","level":"Beginner","order":1,"completed":true}'
curl $API/trends/pottery -H "Authorization: Bearer $TOKEN"
```

In Windows PowerShell use `curl.exe` (plain `curl` is a different command) or `Invoke-RestMethod`.

---

## Testing checklist

**Setup**
- [ ] `http://localhost:5000/api/health` shows `"db":"connected"` and `"ai":"configured"`
- [ ] `npm run check-ai` shows ✅ for Groq and Gemini
- [ ] `http://localhost:5173` opens; the 7 craft cards load on the home page

**Visitor (logged out)**
- [ ] Explore lists 7 crafts; search ("ikat", "dhokra") filters them
- [ ] Craft detail → Roadmap tab shows the standard step titles + a sign-up prompt
- [ ] Workshops and Market Trends tabs ask you to log in
- [ ] `/dashboard` redirects to `/login`

**Sign up & login**
- [ ] Sign-up has no username; phone is the login. Wrong phone / short password / mismatched passwords show inline errors
- [ ] Registering the same phone twice says it is already registered
- [ ] Logout, then log in with phone + password; wrong password shows a friendly error
- [ ] 6 wrong passwords in a row → "Too many login attempts"

**AI roadmap**
- [ ] Open Roadmap: "Preparing your roadmap…" appears, then 5-6 steps with "✨ AI-personalised · Groq/Gemini"
- [ ] Steps mention your craft/experience; some have a ⚠️ Safety tip
- [ ] Refresh the page: same steps instantly (saved, no new AI call)
- [ ] Tick steps: progress bar updates; refresh - ticks are kept (saved in MongoDB)
- [ ] Switch level tabs: each level is generated once; "YOU" marks your level
- [ ] Tap a step title or "📖 Read full lesson": a lesson window opens, shows "Our AI is writing your lesson…",
      then paragraphs, how-to steps, practice task, mistakes, safety, checklist and earning tip
- [ ] Close and reopen the same lesson: it opens instantly; "Mark as complete" inside it ticks the step
- [ ] On a phone the lesson slides up from the bottom and scrolls; Esc or ✕ closes it
- [ ] "New AI roadmap" asks for confirmation, gives new steps and resets that level's ticks; 4th time in a day is refused

**Market trends**
- [ ] Market Trends shows the loading card, then "✨ AI-curated · Groq", skills, products with ₹ prices, demand meter, chart, insights
- [ ] Switching craft loads that craft's trends; returning is instant (cached)

**Other pages**
- [ ] Dashboard: "Namaste, {name}", level badge, Continue Learning with real %, recommendations
- [ ] My Learning lists started crafts with % and next step
- [ ] Workshops & NGOs: All/Workshops/NGOs tabs, location filter and search work; "Visit website" opens in a new tab
- [ ] Profile: Edit → change city/bio → Save shows a toast; phone field is locked
- [ ] Delete `ks_token` in DevTools → Application → Local Storage, then click any page → you are logged out

**Mobile (DevTools device mode, 360 px wide)**
- [ ] Bottom tab bar + "More" sheet work; no sideways scrolling on any page
- [ ] Roadmap timeline is a single column; long AI skill names wrap
- [ ] Forms are easy to tap (large inputs, numeric keypad for phone/age)

**Without AI** (remove both keys from `.env`, restart server)
- [ ] Roadmaps show "📚 Standard roadmap"; trends show "📚 Standard market data"; nothing breaks

---

## Security notes

- Passwords hashed with bcrypt (cost 12); login responses take the same time whether the phone exists or not.
- JWT (HS256, 7 days) sent as a Bearer header; any 401 logs the user out in the client.
- All input validated with zod (strict - unknown fields rejected); MongoDB queries only use validated values.
- Rate limits: whole API, login (per IP+phone and per phone), sign-up, AI routes, roadmap regeneration.
- Security headers on every response; API responses are `Cache-Control: no-store`.
- AI keys live only in `server/.env`. The roadmap prompt sends craft, level, experience, city/state, bio and
  craft story to Groq/Gemini - never name, phone or password (also explained in the FAQ).
- User-written text in prompts is fenced off and the AI is told to ignore instructions inside it; AI output is
  validated and shown as plain text (React escapes it).
- **Verify the seeded workshop/NGO links** (`server/seed/*.js`) before launch - websites change.
- If a key was ever shared (chat, screenshot, Git), **create a new one and delete the old one**.

## Troubleshooting

| Problem | Fix |
|---|---|
| Page won't load after changing `tailwind.config.js` or `.env` | Stop the client (Ctrl+C) and run `npm run dev` again |
| `MongoDB connection failed` | Is MongoDB running? Check `MONGODB_URI`; for Atlas, allow your IP |
| Roadmaps say "Standard roadmap" | AI busy or keys missing - run `npm run check-ai`; use "Get my AI roadmap" later |
| `check-ai`: model "does not exist" / "no longer available" | Update `GROQ_MODELS` / `GEMINI_MODELS` in `.env` with a current model |
| Gemini "high demand" (503) | Temporary on Google's side - the next model in `GEMINI_MODELS` is tried automatically |
