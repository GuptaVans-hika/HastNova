import axios from 'axios';

export const TOKEN_KEY = 'ks_token';
export const USER_CACHE_KEY = 'ks_user';
export const SESSION_EXPIRED_EVENT = 'hn:session-expired';

// AI calls (first roadmap visit, fresh market trends) can take a while
export const AI_TIMEOUT = 90000;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const isAuthCall = err.config?.url?.startsWith('/auth/');

    // Expired/invalid session: clear it and let AuthContext log the user out
    if (status === 401 && !isAuthCall && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_CACHE_KEY);
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }

    let message;
    if (err.response) message = err.response.data?.message || 'Something went wrong. Please try again.';
    else if (err.code === 'ECONNABORTED') message = 'The server is taking too long. Please try again.';
    else message = 'Cannot reach the server. Please check your internet connection.';

    const error = new Error(message);
    error.status = status;
    error.details = err.response?.data?.details;
    return Promise.reject(error);
  }
);

export const hasToken = () => Boolean(localStorage.getItem(TOKEN_KEY));

export default api;
