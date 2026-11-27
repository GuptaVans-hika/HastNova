// Gemini - free tier via Google AI Studio (generateContent REST API).
import { LLMError } from './LLMError.js';
import { createBudget, estimateTokens } from './budget.js';
import { fetchWithTimeout, parseModelJSON, retryAfterMs } from './http.js';

export function createGeminiProvider({ apiKey, models, baseUrl, rpm, rpd, tpm, timeoutMs }) {
  const budget = createBudget({ rpm, rpd, tpm });

  async function callModel(model, { system, prompt, maxTokens }) {
    const info = { provider: 'gemini', model };
    const reserved = budget.reserve(estimateTokens(system, prompt) + maxTokens);
    if (!reserved.ok) throw new LLMError(`budget: ${reserved.reason}`, { ...info, rateLimited: true });

    const res = await fetchWithTimeout(
      `${baseUrl}/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        // key goes in a header, never in the URL (URLs end up in logs)
        headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.4,
            maxOutputTokens: maxTokens * 2, // headroom for models that think before answering
          },
        }),
      },
      timeoutMs,
      info
    );

    if (res.status === 429) {
      reserved.settle(0);
      budget.pause(retryAfterMs(res));
      throw new LLMError('rate limited by Gemini (429)', { ...info, status: 429, rateLimited: true });
    }
    const json = await res.json().catch(() => ({}));
    reserved.settle(res.ok ? json.usageMetadata?.totalTokenCount : 0);
    if (!res.ok) {
      const msg = json.error?.message || `HTTP ${res.status}`;
      // retired model / overloaded ("high demand") -> try the next model
      const tryNextModel = [400, 404, 500, 503].includes(res.status);
      throw new LLMError(`Gemini ${res.status}: ${msg.slice(0, 200)}`, { ...info, status: res.status, tryNextModel });
    }

    const candidate = json.candidates?.[0];
    if (!candidate || ['SAFETY', 'RECITATION', 'PROHIBITED_CONTENT'].includes(candidate.finishReason)) {
      throw new LLMError(`Gemini returned no usable answer (${candidate?.finishReason || 'no candidates'})`, {
        ...info,
        tryNextModel: true,
      });
    }
    const text = (candidate.content?.parts || [])
      .filter((p) => !p.thought)
      .map((p) => p.text || '')
      .join('');
    return parseModelJSON(text, { ...info, tryNextModel: true });
  }

  return {
    name: 'gemini',
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
      throw lastError || new LLMError('no Gemini models configured', { provider: 'gemini' });
    },
  };
}
