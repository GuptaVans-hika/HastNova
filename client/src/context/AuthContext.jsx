import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { TOKEN_KEY, USER_CACHE_KEY, SESSION_EXPIRED_EVENT } from '../services/api.js';
import * as authService from '../services/authService.js';
import * as profileService from '../services/profileService.js';
import { toClientUser } from '../services/mappers.js';
import { useToast } from './ToastContext.jsx';

// JWT auth against the Express API. The token is kept in localStorage and sent by the
// axios interceptor; a cached copy of the user avoids a blank screen on reload.
const AuthContext = createContext(null);

function loadCachedUser() {
  if (!localStorage.getItem(TOKEN_KEY)) return null;
  try {
    return JSON.parse(localStorage.getItem(USER_CACHE_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const { showToast } = useToast();
  const [user, setUserState] = useState(loadCachedUser);

  const setUser = useCallback((u) => {
    setUserState(u);
    if (u) localStorage.setItem(USER_CACHE_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_CACHE_KEY);
  }, []);

  const startSession = useCallback(
    ({ token, user: serverUser }) => {
      localStorage.setItem(TOKEN_KEY, token);
      const u = toClientUser(serverUser);
      setUser(u);
      return u;
    },
    [setUser]
  );

  // Refresh the cached user from the server on page load
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    profileService
      .getProfile()
      .then((u) => setUser(toClientUser(u)))
      .catch(() => {}); // a 401 triggers SESSION_EXPIRED_EVENT below
  }, [setUser]);

  // Auto-logout when any API call returns 401
  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      showToast('Your session has ended. Please log in again.', 'info');
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, [setUser, showToast]);

  const login = useCallback(
    async (phone, password) => startSession(await authService.login(phone, password)),
    [startSession]
  );

  const signup = useCallback(async (form) => startSession(await authService.register(form)), [startSession]);

  const updateProfile = useCallback(
    async (changes) => {
      const u = toClientUser(await profileService.updateProfile(changes));
      setUser(u);
      return u;
    },
    [setUser]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
