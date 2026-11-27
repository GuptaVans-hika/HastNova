import api from './api.js';
import { toServerProfile } from './mappers.js';

// The phone number is the login ID (no separate username)
export async function login(phone, password) {
  const { data } = await api.post('/auth/login', { phone, password });
  return data; // { token, user }
}

export async function register(form) {
  const { data } = await api.post('/auth/register', {
    phone: form.phone,
    password: form.password,
    ...toServerProfile(form),
  });
  return data; // { token, user }
}
