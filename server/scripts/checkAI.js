// Checks each AI provider with a real (small) request using the keys in .env.
//   npm run check-ai
import { env } from '../config/env.js';
import { createGroqProvider } from '../services/llm/groqProvider.js';
import { createGeminiProvider } from '../services/llm/geminiProvider.js';
import { trendsSchema } from '../services/trendsService.js';

const prompt = `Give current Indian market trends for handmade crochet products as JSON:
{"trendingSkills":[4 strings],"trendingProducts":[4 items {"name","emoji","priceRange":{"min","max"},"demandScore"}],
"demandLevel":"Low|Medium|High","priceRange":{"min","max"},"insights":[3 strings]}. Prices in INR. JSON only.`;
const system = 'You answer with ONLY one valid JSON object.';

const providers = {
  groq: createGroqProvider({ ...env.llm.groq, timeoutMs: env.llm.timeoutMs }),
  gemini: createGeminiProvider({ ...env.llm.gemini, timeoutMs: env.llm.timeoutMs }),
};

let ok = true;
for (const [name, provider] of Object.entries(providers)) {
  if (!provider.isConfigured) {
    console.log(`⚪ ${name}: no API key in .env`);
    continue;
  }
  const started = Date.now();
  try {
    const { data, model } = await provider.generateJSON({ system, prompt, maxTokens: 1200 });
    const valid = trendsSchema.safeParse(data);
    console.log(
      `${valid.success ? '✅' : '⚠️ '} ${name} (${model}) answered in ${Date.now() - started}ms` +
        (valid.success ? ` - e.g. "${valid.data.trendingProducts[0].name}"` : ` but the JSON shape was wrong`)
    );
    ok &&= valid.success;
  } catch (err) {
    ok = false;
    console.log(`❌ ${name}: ${err.message}`);
  }
}
process.exit(ok ? 0 : 1);
