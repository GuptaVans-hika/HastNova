import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { fetchCraft, enrollCraft } from '../services/craftService.js';
import { PageContainer } from '../components/layout/SmartLayout.jsx';
import RoadmapView from '../components/RoadmapView.jsx';
import OpportunityList from '../components/OpportunityList.jsx';
import TrendsPanel from '../components/TrendsPanel.jsx';
import LoginPrompt from '../components/LoginPrompt.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';

// Visitors see the standard roadmap titles; logged-in users get their own AI roadmap
function RoadmapPreview({ levels = [] }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {levels.map((l) => (
          <Card key={l.level} className="p-5">
            <h3 className="text-lg font-bold">{l.level}</h3>
            <ol className="mt-3 space-y-2 text-sm text-muted">
              {l.stepTitles.map((t, i) => (
                <li key={t} className="flex gap-2">
                  <span className="font-semibold text-terracotta">{i + 1}.</span> {t}
                </li>
              ))}
            </ol>
          </Card>
        ))}
      </div>
      <LoginPrompt
        icon="✨"
        title="Get a roadmap made just for you"
        text="Sign up and our AI will write a personal roadmap based on your experience and craft story, and save your progress."
      />
    </div>
  );
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📖' },
  { id: 'roadmap', label: 'Roadmap', icon: '🗺️' },
  { id: 'opportunities', label: 'Workshops & NGOs', icon: '🤝' },
  { id: 'trends', label: 'Market Trends', icon: '📈' },
];

export default function CraftDetail() {
  const { craftId } = useParams();
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'overview';
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [craft, setCraft] = useState(null);
  const [error, setError] = useState(null); // { notFound, message }
  const [attempt, setAttempt] = useState(0);

  const userId = user?.id;
  useEffect(() => {
    let active = true;
    setCraft(null);
    setError(null);
    fetchCraft(craftId)
      .then((c) => active && setCraft(c))
      .catch((e) => active && setError({ notFound: e.status === 404 || e.status === 400, message: e.message }));
    return () => {
      active = false;
    };
  }, [craftId, userId, attempt]);

  const start = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/roadmap/${craftId}` } });
      return;
    }
    try {
      await enrollCraft(craftId);
      showToast(`${craft.emoji} ${craft.name} added to My Learning!`);
      navigate(`/roadmap/${craftId}`);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  if (error) {
    return (
      <PageContainer>
        <Card className="p-10 text-center">
          <p className="text-5xl" aria-hidden>{error.notFound ? '🤷' : '😕'}</p>
          <h1 className="mt-3 text-2xl font-bold">{error.notFound ? 'Craft not found' : error.message}</h1>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            {!error.notFound && <Button onClick={() => setAttempt((n) => n + 1)}>Try again</Button>}
            <Button to="/explore" variant="outline">Back to Explore</Button>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Link to="/explore" className="mb-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-mustard hover:underline">
        ← All crafts
      </Link>

      {/* Header */}
      {!craft ? (
        <Skeleton className="mb-6 h-48 rounded-card" />
      ) : (
        <Card pattern className="mb-6">
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-terracotta/10 text-6xl">
              {craft.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold sm:text-4xl">{craft.name}</h1>
              <p className="text-muted">{craft.hindiName} - {craft.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="indigo">✨ AI roadmap</Badge>
                <Badge variant="neutral">🤝 {craft.opportunityCount} workshops/NGOs</Badge>
                <Badge variant="green">Free</Badge>
              </div>
              {craft.progress && craft.progress.completedSteps > 0 && (
                <p className="mt-3 text-sm text-muted">
                  Your progress: <strong className="text-ink">{craft.progress.percent}%</strong>
                </p>
              )}
            </div>
            <Button size="lg" onClick={start} className="w-full sm:w-auto">
              {craft.enrolled ? 'Continue Learning' : 'Start Learning'}
            </Button>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="sticky top-16 z-20 -mx-4 mb-6 bg-canvas/95 px-4 py-2 backdrop-blur lg:top-0">
        <div className="flex gap-2 overflow-x-auto scrollbar-none" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setParams(t.id === 'overview' ? {} : { tab: t.id }, { replace: true })}
              className={`min-h-[48px] shrink-0 rounded-xl px-4 font-semibold transition ${
                tab === t.id ? 'bg-terracotta text-cream shadow-soft' : 'bg-surface text-ink shadow-soft hover:bg-raised'
              }`}
            >
              <span aria-hidden>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      {craft && tab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold">About this craft</h2>
            <p className="mt-3 leading-relaxed text-muted">{craft.overview}</p>
            <h3 className="mt-6 text-xl font-bold">What you will learn</h3>
            <ul className="mt-3 space-y-2">
              {craft.whatYouLearn.map((w) => (
                <li key={w} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf text-xs text-cream">✓</span>
                  {w}
                </li>
              ))}
            </ul>
          </Card>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold">Famous Indian styles</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {craft.famousStyles.map((s) => <Badge key={s} variant="mustard">{s}</Badge>)}
              </div>
            </Card>
            <Card className="bg-indigo p-6 text-cream">
              <h3 className="text-xl font-bold text-cream">Ready to begin?</h3>
              <p className="mt-2 text-sm text-cream/85">
                Our AI writes a step-by-step roadmap for your level - Beginner, Intermediate or Advanced. Learn at your own speed.
              </p>
              <Button variant="mustard" fullWidth className="mt-4" onClick={start}>Start Learning</Button>
            </Card>
          </div>
        </div>
      )}
      {tab === 'roadmap' &&
        (user ? <RoadmapView key={craftId} craftId={craftId} /> : craft && <RoadmapPreview levels={craft.levels} />)}
      {tab === 'opportunities' &&
        (user ? (
          <OpportunityList craftId={craftId} />
        ) : (
          <LoginPrompt icon="🤝" title="Find workshops & NGOs" text="Log in to see training programmes and support organisations for this craft." />
        ))}
      {tab === 'trends' &&
        (user ? (
          <TrendsPanel craftId={craftId} />
        ) : (
          <LoginPrompt icon="📈" title="See what buyers want" text="Log in to see AI-curated market trends, prices and tips for this craft." />
        ))}
    </PageContainer>
  );
}
