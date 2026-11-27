import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useCrafts } from '../context/CraftsContext.jsx';
import { enrollCraft } from '../services/craftService.js';
import { PageContainer } from '../components/layout/SmartLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import CraftCard from '../components/CraftCard.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';

export default function Explore() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { crafts, loading, error, reload } = useCrafts();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return crafts;
    return crafts.filter((c) =>
      [c.name, c.hindiName, c.description, ...c.famousStyles].some((f) => (f || '').toLowerCase().includes(q))
    );
  }, [crafts, search]);

  const handleStart = async (craft) => {
    if (!user) {
      showToast('Please log in or sign up to start learning.', 'info');
      navigate('/login', { state: { from: `/roadmap/${craft.id}` } });
      return;
    }
    try {
      await enrollCraft(craft.id);
      showToast(`${craft.emoji} ${craft.name} added to My Learning!`);
      navigate(`/roadmap/${craft.id}`);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  if (error && !crafts.length) {
    return (
      <PageContainer>
        <PageHeader title="Explore Crafts" icon="🔍" />
        <div className="rounded-card border border-line bg-surface p-10 text-center">
          <p className="text-terracotta">⚠️ {error}</p>
          <Button className="mt-4" onClick={reload}>Try again</Button>
        </div>
      </PageContainer>
    );
  }
  const list = loading && !crafts.length ? null : filtered;

  return (
    <PageContainer>
      <PageHeader
        title="Explore Crafts"
        icon="🔍"
        subtitle="Pick a craft and follow a step-by-step roadmap from beginner to expert."
      />
      <Input
        className="mb-6 max-w-xl"
        placeholder="Search crafts - e.g. pottery, ikat, dhokra…"
        prefix="🔍"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search crafts"
      />
      {!list ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} lines={4} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-card bg-surface p-10 text-center shadow-soft">
          <div className="text-5xl" aria-hidden>🧐</div>
          <p className="mt-3 text-lg font-semibold">No craft matches “{search}”</p>
          <button onClick={() => setSearch('')} className="mt-3 min-h-[44px] font-semibold text-terracotta underline">
            Show all crafts
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CraftCard key={c.id} craft={c} onStart={handleStart} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
