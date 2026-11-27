import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCrafts } from '../services/craftService.js';
import { useAuth } from './AuthContext.jsx';

// The craft catalogue (public API), loaded once and shared by every page.
const CraftsContext = createContext(null);

export function CraftsProvider({ children }) {
  const { user } = useAuth();
  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setCrafts(await fetchCrafts());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // reload when the user logs in/out so `enrolled` flags are correct
  const userId = user?.id;
  useEffect(() => {
    load();
  }, [load, userId]);

  const value = useMemo(() => {
    const byId = Object.fromEntries(crafts.map((c) => [c.id, c]));
    return {
      crafts,
      loading,
      error,
      reload: load,
      getCraft: (id) => byId[id],
      craftOptions: crafts.map((c) => ({ value: c.id, label: `${c.emoji} ${c.name}` })),
    };
  }, [crafts, loading, error, load]);

  return <CraftsContext.Provider value={value}>{children}</CraftsContext.Provider>;
}

export function useCrafts() {
  const ctx = useContext(CraftsContext);
  if (!ctx) throw new Error('useCrafts must be used inside CraftsProvider');
  return ctx;
}
