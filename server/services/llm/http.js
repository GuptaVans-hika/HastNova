import { LLMError } from './LLMError.js';

// fetch with a timeout (Node 18+ has fetch built in)
export async function fetchWithTimeout(url, options, timeoutMs, info) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    const timedOut = err.name === 'AbortError';
    throw new LLMError(timedOut ? `timed out after ${timeoutMs}ms` : `network error: ${err.message}`, {
      ...info,
      tryNextModel: false,
    });
  } finally {
    clearTimeout(timer);
  }
}

// Models sometimes wrap JSON in ```json fences or add text around it - extract the object
export function parseModelJSON(text, info) {
  if (typeof text !== 'string' || !text.trim()) throw new LLMError('empty response', info);
  const cleaned = text.replace(/^\s*```(?:json)?/i, '').replace(/```\s*$/, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        /* fall through */
      }
    }
    throw new LLMError('response was not valid JSON', { ...info, tryNextModel: true });
  }
}

export function retryAfterMs(res) {
  const h = Number(res.headers.get('retry-after'));
  return Number.isFinite(h) && h > 0 ? h * 1000 : 60 * 1000;
}
