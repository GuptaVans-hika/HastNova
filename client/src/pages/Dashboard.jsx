import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCrafts } from '../context/CraftsContext.jsx';
import { fetchMyLearning } from '../services/craftService.js';
import { fetchOpportunities } from '../services/opportunityService.js';
import { fetchTrends } from '../services/trendsService.js';
import { getLevel, levelBadgeVariant, firstName } from '../services/helpers.js';
import Skeleton from '../components/ui/Skeleton.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';

const quickActions = [
  { to: '/roadmap', icon: '🗺️', label: 'My Roadmap', bg: 'bg-terracotta' },
  { to: '/trends', icon: '📈', label: 'Market Trends', bg: 'bg-indigo' },
  { to: '/opportunities', icon: '🤝', label: 'Find Workshops', bg: 'bg-leaf' },
  { to: '/explore', icon: '🔍', label: 'Explore Crafts', bg: 'bg-mustard' },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { user } = useAuth();
  const { crafts, getCraft } = useCrafts();
  // fallback while the catalogue is still loading
  const craft = getCraft(user.primaryCraft) || { id: user.primaryCraft, name: 'Your craft', emoji: '🎨', hindiName: '' };
  const level = user.level || getLevel(user.experience);

  const [learning, setLearning] = useState(null);
  const [nearbyOpp, setNearbyOpp] = useState(null);
  const [topProduct, setTopProduct] = useState(null);

  const userId = user.id;
  const userState = user.state;
  useEffect(() => {
    let active = true;
    fetchMyLearning()
      .then((l) => active && setLearning(l))
      .catch(() => active && setLearning([]));
    // Recommendations are optional - ignore failures
    Promise.allSettled([fetchOpportunities({ craftId: craft.id }), fetchTrends(craft.id)]).then(([opps, tr]) => {
      if (!active) return;
      if (opps.status === 'fulfilled') {
        const list = opps.value;
        setNearbyOpp(list.find((o) => o.state.includes(userState)) || list[0] || null);
      }
      if (tr.status === 'fulfilled') setTopProduct(tr.value.trendingProducts?.[0] || null);
    });
    return () => {
      active = false;
    };
  }, [userId, userState, craft.id]);

  const current = learning?.[0];
  const continueCraft = current
    ? { id: current.craftId, name: current.name, emoji: current.emoji }
    : craft;
  const continuePercent = current?.percent || 0;
  const nextStep = current ? current.nextStep : { title: 'Start your Beginner roadmap', level: 'Beginner' };
  const otherCraft = crafts.find((c) => c.id !== craft.id && c.id !== continueCraft.id);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <section className="booti-pattern relative overflow-hidden rounded-card p-6 text-cream shadow-lift sm:p-8">
        <p className="text-sm text-cream/80">{greeting()} 🌼</p>
        <h1 className="mt-1 text-3xl font-bold text-cream sm:text-4xl">Namaste, {firstName(user.fullName)}! 🙏</h1>
        <p className="mt-2 max-w-xl text-cream/85">
          Every step you learn today adds value to your craft tomorrow. Let’s keep growing.
        </p>
        <span className="absolute -bottom-6 -right-2 text-[120px] opacity-20 sm:text-[160px]" aria-hidden>
          {craft.emoji}
        </span>
      </section>

      {/* Info cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm font-semibold text-muted">Primary Craft</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-4xl" aria-hidden>{craft.emoji}</span>
            <div>
              <p className="text-lg font-bold leading-tight">{craft.name}</p>
              <p className="text-xs text-muted">{craft.hindiName}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-muted">Experience</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-4xl" aria-hidden>⭐</span>
            <div>
              <p className="text-lg font-bold leading-tight">
                {user.experience} {Number(user.experience) === 1 ? 'year' : 'years'}
              </p>
              <Badge variant={levelBadgeVariant[level]} className="mt-1">{level}</Badge>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-muted">Location</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-4xl" aria-hidden>📍</span>
            <div>
              <p className="text-lg font-bold leading-tight">{user.city}</p>
              <p className="text-xs text-muted">{user.state}</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Continue learning */}
      <section>
        <h2 className="mb-3 text-2xl font-bold">Continue Learning</h2>
        {learning === null ? (
          <Skeleton className="h-40 rounded-card" />
        ) : (
        <Card pattern>
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-terracotta/10 text-5xl">
              {continueCraft.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl font-bold">{continueCraft.name}</p>
              <p className="mb-3 text-sm text-muted">
                {nextStep ? <>Next up: <strong className="text-ink">{nextStep.title}</strong></> : 'All steps completed - amazing work! 🏆'}
              </p>
              <ProgressBar value={continuePercent} showLabel label="Roadmap progress" />
            </div>
            <Button to={`/roadmap/${continueCraft.id}`} size="lg" className="shrink-0">
              {continuePercent > 0 ? 'Continue →' : 'Start →'}
            </Button>
          </div>
        </Card>
        )}
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="mb-3 text-2xl font-bold">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {quickActions.map((a) => (
            <Link key={a.to} to={a.to}>
              <Card hover className="flex min-h-[110px] flex-col items-center justify-center gap-2 p-4 text-center">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${a.bg}`} aria-hidden>
                  {a.icon}
                </span>
                <span className="font-semibold">{a.label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section>
        <h2 className="mb-3 text-2xl font-bold">Recommended for You</h2>
        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {nextStep && (
            <RecCard tag="Next step" tagVariant="terracotta" icon="🗺️" title={nextStep.title}
              text={`${continueCraft.name} - ${nextStep.level} level`} to={`/roadmap/${continueCraft.id}`} cta="Open roadmap" />
          )}
          {nearbyOpp && (
            <RecCard tag={nearbyOpp.type} tagVariant={nearbyOpp.type === 'Workshop' ? 'mustard' : 'indigo'} icon="🤝"
              title={nearbyOpp.name} text={`📍 ${[nearbyOpp.city, nearbyOpp.state].filter(Boolean).join(', ')}`}
              to="/opportunities" cta="View details" />
          )}
          {topProduct && (
            <RecCard tag="Trending" tagVariant="green" icon={topProduct.emoji} title={topProduct.name}
              text={`Selling at ${topProduct.price}`} to="/trends" cta="See trends" />
          )}
          {otherCraft && (
            <RecCard tag="New craft" tagVariant="neutral" icon={otherCraft.emoji} title={otherCraft.name}
              text={otherCraft.tagline} to={`/explore/${otherCraft.id}`} cta="Explore" />
          )}
        </div>
      </section>
    </div>
  );
}

function RecCard({ tag, tagVariant, icon, title, text, to, cta }) {
  return (
    <Link to={to} className="w-[78%] shrink-0 snap-start sm:w-auto">
      <Card hover className="flex h-full flex-col p-5">
        <div className="flex items-center justify-between">
          <span className="text-3xl" aria-hidden>{icon}</span>
          <Badge variant={tagVariant}>{tag}</Badge>
        </div>
        <h3 className="mt-3 font-body text-base font-semibold leading-snug">{title}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">{text}</p>
        <span className="mt-3 text-sm font-semibold text-terracotta">{cta} →</span>
      </Card>
    </Link>
  );
}
