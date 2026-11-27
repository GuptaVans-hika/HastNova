import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchMyLearning } from '../services/craftService.js';
import { formatDate } from '../services/helpers.js';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';

export default function MyLearning() {
  const { user } = useAuth();
  const [list, setList] = useState(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setError('');
    fetchMyLearning()
      .then((l) => active && setList(l))
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [attempt]);

  const loaded = list !== null;

  return (
    <div>
      <PageHeader
        title="My Learning"
        icon="📚"
        subtitle="All the crafts you have started. Pick up right where you left off."
        action={loaded && list.length > 0 && <Button to="/explore" variant="outline">+ Add a craft</Button>}
      />

      {error ? (
        <Card className="p-8 text-center">
          <p className="text-terracotta">⚠️ {error}</p>
          <Button className="mt-4" onClick={() => setAttempt((n) => n + 1)}>Try again</Button>
        </Card>
      ) : !loaded ? (
        <div className="grid gap-5 md:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : list.length === 0 ? (
        <Card pattern className="mx-auto max-w-xl text-center">
          <div className="p-8 sm:p-10">
            <div className="text-6xl" aria-hidden>🌱</div>
            <h2 className="mt-4 text-2xl font-bold">You haven’t started any craft yet</h2>
            <p className="mt-2 text-muted">
              Every master karigar started with one small step. Choose a craft and begin your roadmap today.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button to="/explore" size="lg">Explore Crafts</Button>
              <Button to={`/roadmap/${user.primaryCraft}`} variant="outline" size="lg">Start my primary craft</Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {list.map((item) => (
            <Card key={item.craftId} hover className="flex flex-col p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-terracotta/10 text-4xl">
                  {item.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    {item.isPrimary && <Badge variant="mustard">Primary</Badge>}
                    {item.percent === 100 && <Badge variant="green">🏆 Completed</Badge>}
                  </div>
                  <p className="text-sm text-muted">
                    Started {formatDate(item.startedAt)} - {item.completedCount} of {item.totalSteps} steps done
                  </p>
                </div>
              </div>
              <div className="mt-4 flex-1">
                <ProgressBar value={item.percent} showLabel label="Progress" color={item.percent === 100 ? 'green' : 'terracotta'} />
                {item.nextStep && (
                  <p className="mt-2 text-sm text-muted">
                    Next: <strong className="text-ink">{item.nextStep.title}</strong> ({item.nextStep.level})
                  </p>
                )}
              </div>
              <Button to={`/roadmap/${item.craftId}`} fullWidth className="mt-5">
                {item.percent === 100 ? 'Review Roadmap' : item.percent > 0 ? 'Continue →' : 'Start →'}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
