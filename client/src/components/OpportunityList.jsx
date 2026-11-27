import { useEffect, useMemo, useState } from 'react';
import { fetchOpportunities } from '../services/opportunityService.js';
import { useCrafts } from '../context/CraftsContext.jsx';
import OpportunityCard from './OpportunityCard.jsx';
import Input from './ui/Input.jsx';
import Select from './ui/Select.jsx';
import Card from './ui/Card.jsx';
import { SkeletonCard } from './ui/Skeleton.jsx';

const TABS = [
  { value: 'All', label: 'All' },
  { value: 'Workshop', label: '🛠️ Workshops' },
  { value: 'NGO', label: '🤝 NGOs' },
];

export default function OpportunityList({ craftId }) {
  const { getCraft } = useCrafts();
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [tab, setTab] = useState('All');
  const [city, setCity] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    setItems(null);
    setError('');
    fetchOpportunities({ craftId })
      .then((d) => active && setItems(d))
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [craftId, attempt]);

  const cities = useMemo(() => [...new Set((items || []).map((o) => o.city))].sort(), [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (items || []).filter((o) => {
      if (tab !== 'All' && o.type !== tab) return false;
      if (city && o.city !== city) return false;
      if (!q) return true;
      const craftName = getCraft(o.craftId)?.name || '';
      return [o.name, o.description, o.city, o.state, craftName].some((f) => (f || '').toLowerCase().includes(q));
    });
  }, [items, tab, city, search, getCraft]);

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-terracotta">⚠️ {error}</p>
        <button onClick={() => setAttempt((n) => n + 1)} className="mt-3 min-h-[44px] font-semibold text-mustard underline">
          Try again
        </button>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6 space-y-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-none" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.value}
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => setTab(t.value)}
              className={`min-h-[44px] shrink-0 rounded-full px-5 font-semibold transition ${
                tab === t.value ? 'bg-mustard text-brown shadow-soft' : 'bg-surface text-ink shadow-soft hover:bg-raised'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            placeholder="Search by name, craft or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix="🔍"
            aria-label="Search workshops and NGOs"
          />
          <Select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="📍 All locations"
            options={cities.map((c) => ({ value: c, label: c }))}
            aria-label="Filter by location"
          />
        </div>
      </div>

      {!items ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-card bg-surface p-10 text-center shadow-soft">
          <div className="text-5xl" aria-hidden>🔎</div>
          <p className="mt-3 text-lg font-semibold">No results found</p>
          <p className="text-sm text-muted">Try another location or clear your search.</p>
          <button
            onClick={() => {
              setTab('All');
              setCity('');
              setSearch('');
            }}
            className="mt-4 min-h-[44px] font-semibold text-terracotta underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="mb-3 text-sm text-muted">{filtered.length} result{filtered.length > 1 ? 's' : ''}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((o) => <OpportunityCard key={o.id} item={o} />)}
          </div>
        </>
      )}
    </div>
  );
}
