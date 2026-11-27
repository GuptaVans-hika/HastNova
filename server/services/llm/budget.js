// In-memory sliding-window budget per provider, so we never exceed free-tier limits.
// Requests per minute, requests per day and (estimated) tokens per minute.
// If a provider answers 429 we also pause it for the time it asks.

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

export function createBudget({ rpm, rpd, tpm }) {
  let calls = []; // { t, tokens }
  let pausedUntil = 0;

  function prune(now) {
    calls = calls.filter((c) => now - c.t < DAY);
  }

  return {
    /**
     * Reserve one call. Returns { ok: false, reason } or { ok: true, settle(actualTokens) } -
     * call settle() with the real token usage once known (0 if the call failed).
     */
    reserve(estimatedTokens = 0) {
      const now = Date.now();
      prune(now);
      if (now < pausedUntil) return { ok: false, reason: `paused for ${Math.ceil((pausedUntil - now) / 1000)}s after a 429` };
      const lastMinute = calls.filter((c) => now - c.t < MINUTE);
      if (lastMinute.length >= rpm) return { ok: false, reason: `per-minute request budget (${rpm}) used` };
      if (calls.length >= rpd) return { ok: false, reason: `daily request budget (${rpd}) used` };
      const tokens = lastMinute.reduce((n, c) => n + c.tokens, 0);
      if (tpm && tokens + estimatedTokens > tpm) return { ok: false, reason: `per-minute token budget (${tpm}) used` };
      const entry = { t: now, tokens: estimatedTokens };
      calls.push(entry);
      return {
        ok: true,
        settle(actualTokens) {
          if (Number.isFinite(actualTokens)) entry.tokens = actualTokens;
        },
      };
    },
    /** Called when the provider itself rate-limits us */
    pause(ms) {
      pausedUntil = Math.max(pausedUntil, Date.now() + Math.min(ms, 10 * MINUTE));
    },
    status() {
      const now = Date.now();
      prune(now);
      return {
        lastMinute: calls.filter((c) => now - c.t < MINUTE).length,
        today: calls.length,
        limits: { rpm, rpd, tpm },
        pausedForSeconds: Math.max(0, Math.ceil((pausedUntil - now) / 1000)),
      };
    },
  };
}

// Rough token estimate (~4 characters per token) used for the per-minute token budget
export const estimateTokens = (...texts) => Math.ceil(texts.join('').length / 4);
