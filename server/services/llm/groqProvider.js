// Groq - free tier, OpenAI-compatible chat completions API.
import { LLMError } from './LLMError.js';
import { createBudget, estimateTokens } from './budget.js';
import { fetchWithTimeout, parseModelJSON, retryAfterMs } from './http.js';

export function createGroqProvider({ apiKey, models, baseUrl, rpm, rpd, tpm, timeoutMs }) {
  const budget = createBudget({ rpm, rpd, tpm });

  async function callModel(model, { system, prompt, maxTokens }) {
    const info = { provider: 'groq', model };
    const reserved = budget.reserve(estimateTokens(system, prompt) + maxTokens);
    if (!reserved.ok) throw new LLMError(`budget: ${reserved.reason}`, { ...info, rateLimited: true });

    const body = {
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: maxTokens,
    };
    // gpt-oss models "think" first; keep that short so the JSON fits in the token budget
    if (model.startsWith('openai/gpt-oss')) body.reasoning_effort = 'low';

    const res = await fetchWithTimeout(
      `${baseUrl}/chat/completions`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
      timeoutMs,
      info
    );

    if (res.status === 429) {
      reserved.settle(0);
      budget.pause(retryAfterMs(res));
      throw new LLMError('rate limited by Groq (429)', { ...info, status: 429, rateLimited: true });
    }
    const json = await res.json().catch(() => ({}));
    // count the tokens Groq actually used, not our worst-case estimate
    reserved.settle(res.ok ? json.usage?.total_tokens : 0);
    if (!res.ok) {
      const msg = json.error?.message || `HTTP ${res.status}`;
      // retired model / failed JSON validation / overloaded -> try the next model
      const tryNextModel = [400, 404, 503, 500, 502].includes(res.status);
      throw new LLMError(`Groq ${res.status}: ${msg.slice(0, 200)}`, { ...info, status: res.status, tryNextModel });
    }
    return parseModelJSON(json.choices?.[0]?.message?.content, info);
  }

  return {
    name: 'groq',
    isConfigured: Boolean(apiKey),
    status: () => budget.status(),
    /** @returns {Promise<{ data: object, model: string }>} */
    async generateJSON(request) {
      let lastError;
      for (const model of models) {
        try {
          return { data: await callModel(model, request), model };
        } catch (err) {
          lastError = err;
          if (!err.tryNextModel) throw err;
        }
      }
      throw lastError || new LLMError('no Groq models configured', { provider: 'groq' });
    },
  };
}
