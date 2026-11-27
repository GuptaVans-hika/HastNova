// Craft slugs are used in URLs (/api/crafts/:craft) and match the client's craft ids
export const CRAFT_SLUGS = ['pottery', 'woodwork', 'weaving', 'textile', 'paperwork', 'metalwork', 'crocheting'];

export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export const OPPORTUNITY_TYPES = ['Workshop', 'NGO'];

export const DEMAND_LEVELS = ['Low', 'Medium', 'High'];

export const TREND_SOURCES = ['seed', 'groq', 'gemini'];

// 0-1 yrs Beginner, 2-4 Intermediate, 5+ Advanced
export function levelForExperience(years) {
  const y = Number(years) || 0;
  if (y >= 5) return 'Advanced';
  if (y >= 2) return 'Intermediate';
  return 'Beginner';
}

// Accepts "beginner", "BEGINNER", "Beginner" -> "Beginner"; returns null if invalid
export function normaliseLevel(level = '') {
  const match = LEVELS.find((l) => l.toLowerCase() === String(level).toLowerCase());
  return match || null;
}
