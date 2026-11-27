// Market trends: cached AI result -> fresh AI (Groq, then Gemini) -> seeded fallback.
import { z } from 'zod';
import MarketTrends from '../models/MarketTrends.js';
import Craft from '../models/Craft.js';
import { env } from '../config/env.js';
import { generateJSON, isAIConfigured } from './llm/index.js';

const AI_SOURCES = ['groq', 'gemini'];
const DAY = 24 * 60 * 60 * 1000;
const FAILURE_COOLDOWN = 15 * 60 * 1000; // don't hammer the AI if it just failed for this craft

const inflight = new Map(); // craft -> Promise (so many users at once = one AI call)
const lastFailure = new Map(); // craft -> timestamp

// ---------- strict validation of what the AI returns ----------
const inr = z.coerce.number().int().min(10).max(1_000_000);
const priceRange = z
  .object({ min: inr, max: inr })
  .refine((p) => p.min <= p.max, { message: 'min must be <= max' });
const text = (min, max) => z.string().trim().min(min).max(max);

export const trendsSchema = z.object({
  trendingSkills: z.array(text(2, 60)).min(3).max(8).transform((a) => a.slice(0, 6)),
  trendingProducts: z
    .array(
      z.object({
        name: text(2, 60),
        emoji: z.string().trim().max(8).optional().default('🛍️'),
        priceRange,
        demandScore: z.coerce.number().int().min(0).max(100),
      })
    )
    .min(3)
    .max(6)
    .transform((a) => a.slice(0, 5)),
  demandLevel: z.enum(['Low', 'Medium', 'High']),
  priceRange,
  insights: z.array(text(15, 260)).min(3).max(6).transform((a) => a.slice(0, 4)),
});

const SYSTEM = `You are a market analyst for Indian handicrafts who advises rural artisans (karigars).
You answer with ONLY one valid JSON object - no markdown, no code fences, no text before or after it.`;

function buildPrompt(craft) {
  const month = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  return `Give current market trends in India for this craft, as of ${month}.

Craft: ${craft.name}${craft.hindiName ? ` (${craft.hindiName})` : ''}
About: ${craft.description || ''}

Return exactly this JSON shape:
{
  "trendingSkills": ["4 to 6 short skill names buyers currently value"],
  "trendingProducts": [
    { "name": "product name", "emoji": "one emoji", "priceRange": { "min": 300, "max": 900 }, "demandScore": 75 }
  ],
  "demandLevel": "Low" | "Medium" | "High",
  "priceRange": { "min": 150, "max": 5000 },
  "insights": ["3 or 4 practical tips"]
}

Rules:
- trendingProducts: 4 or 5 products that sell well in India now (online marketplaces, Instagram, craft bazaars, shops).
- All prices are whole numbers in Indian Rupees (INR) per piece, realistic for handmade products in India. min <= max.
- demandScore: 0-100, how strongly buyers want that product.
- demandLevel: overall demand for this craft right now.
- insights: 3 or 4 short, practical tips for an artisan (seasons and festivals, what to make, pricing, selling, packaging). Simple English, max 2 sentences each.
- Do not invent statistics, brand names or organisations.`;
}

async function latestAI(craft) {
  return MarketTrends.findOne({ craft, source: { $in: AI_SOURCES } }).sort({ lastUpdated: -1 }).lean();
}

async function refreshFromAI(craft) {
  if (!isAIConfigured()) return null;
  const failedAt = lastFailure.get(craft);
  if (failedAt && Date.now() - failedAt < FAILURE_COOLDOWN) return null;
  if (inflight.has(craft)) return inflight.get(craft);

  const job = (async () => {
    try {
      const craftDoc = (await Craft.findOne({ slug: craft }).lean()) || { name: craft };
      const { data, provider, model } = await generateJSON({
        system: SYSTEM,
        prompt: buildPrompt(craftDoc),
        schema: trendsSchema,
        maxTokens: 1500,
        label: `trends:${craft}`,
      });
      lastFailure.delete(craft);
      return await MarketTrends.findOneAndUpdate(
        { craft, source: provider },
        { ...data, craft, source: provider, model, lastUpdated: new Date() },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
      ).lean();
    } catch {
      lastFailure.set(craft, Date.now());
      return null;
    } finally {
      inflight.delete(craft);
    }
  })();

  inflight.set(craft, job);
  return job;
}

/**
 * @returns {Promise<{ doc: object, stale: boolean } | null>}
 * stale = AI refresh failed, so we're showing an older AI result (still newer than the seed)
 */
export async function getTrendsForCraft(craft) {
  const cached = await latestAI(craft);
  if (cached && Date.now() - new Date(cached.lastUpdated).getTime() < env.trendsTtlDays * DAY) {
    return { doc: cached, stale: false };
  }

  const fresh = await refreshFromAI(craft);
  if (fresh) return { doc: fresh, stale: false };
  if (cached) return { doc: cached, stale: true };

  const seed = await MarketTrends.findOne({ craft, source: 'seed' }).lean();
  return seed ? { doc: seed, stale: false } : null;
}
