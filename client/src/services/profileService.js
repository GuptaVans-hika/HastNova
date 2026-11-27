import api from './api.js';
import { toServerProfile } from './mappers.js';

export async function getProfile() {
  const { data } = await api.get('/profile');
  return data.user;
}

// Phone number cannot be changed
export async function updateProfile(changes) {
  const { data } = await api.put('/profile', toServerProfile(changes));
  return data.user;
}
