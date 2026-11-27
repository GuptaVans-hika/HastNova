import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import CraftCard from '../components/CraftCard.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { useCrafts } from '../context/CraftsContext.jsx';

const steps = [
  { icon: '🎨', title: 'Choose your craft', text: 'Pick from 7 traditional crafts - pottery, weaving, woodwork and more.' },
  {
    icon: '🗺️',
    title: 'Follow your roadmap',
    text: 'Our AI writes a step-by-step roadmap just for you, based on your craft, level and story.',
  },
  {
    icon: '💰',
    title: 'Join workshops and grow your income',
    text: 'Find workshops and NGOs, and see AI-curated market trends on what buyers want today.',
  },
];

const FALLBACK_EMOJIS = ['🏺', '🪵', '🧺', '🧵', '📜', '⚒️'];

export default function Landing() {
  const { crafts, loading } = useCrafts();
  const stats = [
    { value: crafts.length || 7, label: 'Traditional crafts' },
    { value: '✨ AI', label: 'Personal roadmaps' },
    { value: `${crafts.reduce((n, c) => n + c.opportunityCount, 0) || 30}+`, label: 'Workshops & NGOs' },
    { value: '100%', label: 'Free for karigars' },
  ];
  const heroEmojis = crafts.length ? crafts.slice(0, 6).map((c) => c.emoji) : FALLBACK_EMOJIS;

  return (
    <>
      {/* Hero */}
      <section className="cream-pattern relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-5 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-block rounded-full bg-mustard/20 px-4 py-1.5 text-sm font-semibold text-mustard-dark">
              🇮🇳 Made for India’s artisans
            </span>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.1] sm:text-6xl">
              Seekho.{' '}
              <span className="bg-gradient-to-r from-terracotta to-[#E5845F] bg-clip-text text-transparent">Badho.</span>{' '}
              <span className="bg-gradient-to-r from-mustard to-[#F3C766] bg-clip-text text-transparent">Kamao.</span>
            </h1>
            <p className="mt-3 text-lg font-medium text-muted">Learn. Grow. Earn.</p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
              HastaNova helps craftspeople learn new skills, follow a clear roadmap, find workshops nearby, and
              understand what customers want to buy.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/login?mode=signup" size="lg">Get Started - It’s Free</Button>
              <Button to="/login" variant="outline" size="lg">Login</Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="booti-pattern rounded-[28px] p-6 shadow-lift">
              <div className="grid grid-cols-3 gap-3">
                {heroEmojis.map((emoji, i) => (
                  <div
                    key={emoji}
                    className={`flex aspect-square items-center justify-center rounded-2xl text-4xl shadow-soft sm:text-5xl ${
                      i % 2 ? 'bg-mustard' : 'bg-canvas'
                    }`}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-canvas p-4">
                <p className="text-sm font-semibold">🏺 Pottery - Beginner</p>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-raised">
                  <div className="h-full w-3/5 rounded-full bg-leaf" />
                </div>
                <p className="mt-1.5 text-xs text-muted">3 of 5 steps done - keep going!</p>
              </div>
            </div>
          </div>
        </div>
        <div className="block-print-border" aria-hidden />
      </section>

      {/* Crafts */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-5">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Choose Your Craft</h2>
          <p className="mt-2 text-muted">Seven traditional crafts, one place to learn them all.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {loading && !crafts.length
            ? Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-card" />)
            : crafts.map((c) => <CraftCard key={c.id} craft={c} variant="simple" />)}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">How It Works</h2>
          <p className="mt-2 text-center text-muted">Three simple steps to a better craft and a better income.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <Card key={s.title} className="relative bg-canvas p-6 shadow-none">
                <span className="absolute right-5 top-4 font-heading text-6xl font-extrabold text-terracotta/15">
                  {i + 1}
                </span>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta text-3xl shadow-soft">
                  {s.icon}
                </div>
                <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="booti-pattern">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-12 text-center sm:px-5 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-heading text-4xl font-extrabold text-mustard">{s.value}</p>
              <p className="mt-1 text-sm text-cream/90">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pt-16 text-center sm:px-5">
        <h2 className="text-3xl font-bold sm:text-4xl">Your hands hold the skill. We help it grow.</h2>
        <p className="mt-3 text-muted">Join thousands of karigars learning and earning more with HastaNova.</p>
        <Button to="/login?mode=signup" size="lg" className="mt-6">Create Free Account</Button>
      </section>
    </>
  );
}
