import api from './api.js';
import { toClientCraft } from './mappers.js';

// Public: works for guests too (enrolled/progress filled in when logged in)
export async function fetchCrafts() {
  const { data } = await api.get('/crafts');
  return data.crafts.map(toClientCraft);
}

export async function fetchCraft(id) {
  const { data } = await api.get(`/crafts/${id}`);
  return toClientCraft(data.craft);
}

export async function enrollCraft(id) {
  await api.post(`/crafts/${id}/enroll`);
}

// [{ craftId, name, emoji, isPrimary, percent, completedCount, totalSteps, startedAt, lastOpened, nextStep }]
export async function fetchMyLearning() {
  const { data } = await api.get('/my-learning');
  return data.learning.map((l) => ({
    craftId: l.craft,
    name: l.name,
    hindiName: l.hindiName,
    emoji: l.icon,
    isPrimary: l.isPrimary,
    percent: l.percent,
    completedCount: l.completedSteps,
    totalSteps: l.totalSteps,
    startedAt: l.enrolledAt,
    lastOpened: l.lastActivityAt,
    nextStep: l.nextStep,
  }));
}
