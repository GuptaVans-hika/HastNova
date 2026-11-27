// Field mapping between the API (server) and the UI (client).
import { formatRupees } from './helpers.js';

// Server: location { city, state }, experienceYears, createdAt
// Client: city, state, experience, joinedAt
export const toClientUser = (u) =>
  u && {
    ...u,
    city: u.location?.city ?? '',
    state: u.location?.state ?? '',
    experience: u.experienceYears,
    joinedAt: u.createdAt,
  };

export function toServerProfile(d) {
  const out = {};
  ['fullName', 'primaryCraft', 'bio', 'craftStory'].forEach((k) => {
    if (d[k] !== undefined) out[k] = d[k];
  });
  if (d.age !== undefined && d.age !== '') out.age = Number(d.age);
  if (d.experience !== undefined && d.experience !== '') out.experienceYears = Number(d.experience);
  if (d.city !== undefined || d.state !== undefined) out.location = { city: d.city, state: d.state };
  return out;
}

// Map server field names in validation errors back to form field names
const FIELD_MAP = { 'location.city': 'city', 'location.state': 'state', experienceYears: 'experience' };
export const toFormErrors = (details = []) =>
  Object.fromEntries(details.map((d) => [FIELD_MAP[d.field] || d.field, d.message]));

export const toClientCraft = (c) => ({
  id: c.slug,
  name: c.name,
  hindiName: c.hindiName,
  emoji: c.icon,
  accent: c.accent || 'terracotta',
  tagline: c.tagline,
  description: c.description,
  overview: c.overview,
  whatYouLearn: c.whatYouLearn || [],
  famousStyles: c.famousStyles || [],
  stepCount: c.stepCount ?? 0,
  opportunityCount: c.opportunityCount ?? 0,
  enrolled: Boolean(c.enrolled),
  levels: c.levels, // detail only: standard roadmap preview
  progress: c.progress, // detail only, logged in
});

export function toClientOpportunity(o) {
  const [city, ...rest] = o.location.split(',');
  return {
    id: o._id,
    craftId: o.craft,
    name: o.name,
    type: o.type,
    city: city.trim(),
    state: rest.join(',').trim(),
    description: o.description,
    contact: o.contact,
    link: o.link,
  };
}

export const toClientTrends = (t) => ({
  craftId: t.craft,
  source: t.source, // groq | gemini | seed
  model: t.model,
  aiGenerated: t.aiGenerated,
  stale: t.stale,
  lastUpdated: t.lastUpdated,
  demandLevel: t.demandLevel,
  priceRange: t.priceRange,
  trendingSkills: t.trendingSkills,
  trendingProducts: t.trendingProducts.map((p) => ({
    name: p.name,
    emoji: p.emoji,
    price: `${formatRupees(p.priceRange.min)} - ${formatRupees(p.priceRange.max)}`,
    demandScore: p.demandScore,
  })),
  insights: t.insights,
  chart: t.chart,
});

// Each step gets `id` = server key ("pottery:Beginner:1") used for progress
export const toClientRoadmap = (r) => ({
  ...r,
  steps: r.steps.map((s) => ({ ...s, id: s.key, level: r.level })),
});
