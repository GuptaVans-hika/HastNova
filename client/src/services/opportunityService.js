import api from './api.js';
import { toClientOpportunity } from './mappers.js';

// filters: { craftId?, type?: 'Workshop' | 'NGO', location? }
export async function fetchOpportunities({ craftId, type, location } = {}) {
  const { data } = await api.get('/opportunities', {
    params: { craft: craftId || undefined, type: type || undefined, location: location || undefined },
  });
  return data.opportunities.map(toClientOpportunity);
}
