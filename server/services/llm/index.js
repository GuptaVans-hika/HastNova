// One interface for all LLM providers:
//   const { data, provider, model } = await generateJSON({ system, prompt, schema, maxTokens, label })
// Providers are tried in LLM_PROVIDER_ORDER. Each answer must pass the zod schema;
// if it doesn't, the next provider is tried. Throws LLMError if every provider fails.
import { env } from '../../config/env.js';
import { LLMError } from './LLMError.js';
import { createGroqProvider } from './groqProvider.js';
import { createGeminiProvider } from './geminiProvider.js';

const factories = {
  groq: () => createGroqProvider({ ...env.llm.groq, timeoutMs: env.llm.timeoutMs }),
  gemini: () => createGeminiProvider({ ...env.llm.gemini, timeoutMs: env.llm.timeoutMs }),
};

const providers = env.llm.order.filter((name) => factories[name]).map((name) => factories[name]());

export const isAIConfigured = () => providers.some((p) => p.isConfigured);

export function llmStatus() {
  return providers.map((p) => ({ provider: p.name, configured: p.isConfigured, ...(p.isConfigured && p.status()) }));
}

const shortIssues = (error) =>
  error.issues
    .slice(0, 3)
    .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('; ');

export async function generateJSON({ system, prompt, schema, maxTokens = 1500, label = 'llm' }) {
  const failures = [];
  for (const provider of providers) {
    if (!provider.isConfigured) continue;
    const started = Date.now();
    try {
      const { data, model } = await provider.generateJSON({ system, prompt, maxTokens });
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        failures.push(`${provider.name}/${model}: invalid shape (${shortIssues(parsed.error)})`);
        continue;
      }
      console.log(`🤖 [${label}] ${provider.name}/${model} OK in ${Date.now() - started}ms`);
      return { data: parsed.data, provider: provider.name, model };
    } catch (err) {
      failures.push(`${provider.name}${err.model ? `/${err.model}` : ''}: ${err.message}`);
    }
  }
  const message = failures.length ? failures.join(' | ') : 'no AI provider is configured (set GROQ_API_KEY / GEMINI_API_KEY)';
  console.warn(`🤖 [${label}] all providers failed -> ${message}`);
  throw new LLMError(message);
}
