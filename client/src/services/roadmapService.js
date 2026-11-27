import api, { AI_TIMEOUT } from './api.js';
import { toClientRoadmap } from './mappers.js';

// First visit to a level: the server's AI writes a personal roadmap (may take a few seconds)
export async function fetchRoadmap(craftId, level) {
  const { data } = await api.get(`/roadmap/${craftId}/${level}`, { timeout: AI_TIMEOUT });
  return { roadmap: toClientRoadmap(data.roadmap), progress: data.progress };
}

// Detailed AI lesson for one step (written by the AI the first time, then saved on the server)
export async function fetchStepLesson(craftId, level, order) {
  const { data } = await api.get(`/roadmap/${craftId}/${level}/steps/${order}`, { timeout: AI_TIMEOUT });
  return data.lesson;
}

// Mark (completed=true) or unmark a step; saved in MongoDB
export async function setStepCompleted(craftId, step, completed) {
  const { data } = await api.post('/roadmap/progress', {
    craft: craftId,
    level: step.level,
    order: step.order,
    completed,
  });
  return { completed: data.step.completed, progress: data.progress };
}

// Ask the AI for a new roadmap for this level (resets that level's progress)
export async function regenerateRoadmap(craftId, level) {
  const { data } = await api.post(`/roadmap/${craftId}/${level}/regenerate`, null, { timeout: AI_TIMEOUT });
  return { roadmap: toClientRoadmap(data.roadmap), progress: data.progress };
}
