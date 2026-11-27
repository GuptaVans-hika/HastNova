import api, { AI_TIMEOUT } from './api.js';
import { toClientTrends } from './mappers.js';

// Cached AI trends, refreshed by the server's AI (Groq -> Gemini) when older than 7 days
export async function fetchTrends(craftId) {
  const { data } = await api.get(`/trends/${craftId}`, { timeout: AI_TIMEOUT });
  return toClientTrends(data.trends);
}
