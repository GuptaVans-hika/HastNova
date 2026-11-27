import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchTrends } from '../services/trendsService.js';
import { formatDate, formatRupees } from '../services/helpers.js';
import Card from './ui/Card.jsx';
import Badge from './ui/Badge.jsx';
import Skeleton from './ui/Skeleton.jsx';

const DEMAND_STEPS = ['Low', 'Medium', 'High'];
const demandIcon = { Low: '🔽', Medium: '➖', High: '🔥' };

function DemandMeter({ level }) {
  const idx = DEMAND_STEPS.indexOf(level);
  return (
    <div>
      <div className="flex gap-1.5" aria-hidden>
        {DEMAND_STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-4 flex-1 rounded-full ${
              i <= idx ? ['bg-mustard-light', 'bg-mustard', 'bg-terracotta'][i] : 'bg-raised'
            }`}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-muted">
        {DEMAND_STEPS.map((s) => (
          <span key={s} className={s === level ? 'font-bold text-ink' : ''}>{s}</span>
        ))}
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 text-sm shadow-soft">
      <p className="font-semibold text-ink">{label}</p>
      <p className="text-muted">Demand score: <span className="font-semibold text-ink">{payload[0].value}/100</span></p>
    </div>
  );
}

function TrendsSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading market trends">
      <Card className="flex items-center gap-4 border-mustard/40 p-5">
        <span className="h-8 w-8 shrink-0 animate-spin rounded-full border-4 border-mustard border-t-transparent" aria-hidden />
        <div>
          <p className="font-semibold">Getting the latest market trends…</p>
          <p className="text-sm text-muted">If they are more than a week old, our AI updates them now. This can take a few seconds.</p>
        </div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-32 rounded-card" />
        <Skeleton className="h-32 rounded-card" />
      </div>
      <Skeleton className="h-16 rounded-card" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-28 rounded-card" />
        <Skeleton className="h-28 rounded-card" />
        <Skeleton className="h-28 rounded-card" />
      </div>
      <Skeleton className="h-72 rounded-card" />
    </div>
  );
}

const providerName = { groq: 'Groq', gemini: 'Gemini' };

export default function TrendsPanel({ craftId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setData(null);
    setError('');
    fetchTrends(craftId)
      .then((d) => active && setData(d))
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [craftId, attempt]);

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
  if (!data) return <TrendsSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {data.aiGenerated ? (
          <Badge variant="indigo">✨ AI-curated · {providerName[data.source] || data.source}</Badge>
        ) : (
          <Badge variant="neutral">📚 Standard market data</Badge>
        )}
        <span className="text-sm text-muted">Last updated: {formatDate(data.lastUpdated)}</span>
      </div>
      {data.stale && (
        <p className="rounded-xl border border-line bg-raised p-3 text-sm text-muted">
          Our AI could not refresh the trends right now, so you are seeing the last AI update.
        </p>
      )}

      {/* Demand + price */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <p className="text-sm font-semibold text-muted">Demand Level</p>
          <p className="mb-3 mt-1 text-2xl font-bold">
            <span aria-hidden>{demandIcon[data.demandLevel]}</span> {data.demandLevel}
          </p>
          <DemandMeter level={data.demandLevel} />
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-muted">Typical Price Range</p>
          <p className="mt-1 text-2xl font-bold">
            {formatRupees(data.priceRange.min)} - {formatRupees(data.priceRange.max)}
          </p>
          <p className="mt-2 text-sm text-muted">Per piece, depending on size, finish and where you sell.</p>
        </Card>
      </div>

      {/* Trending skills */}
      <section>
        <h3 className="mb-3 text-xl font-bold">🚀 Trending Skills</h3>
        <div className="flex flex-wrap gap-2">
          {data.trendingSkills.map((s) => (
            <span key={s} className="rounded-full border-2 border-terracotta/30 bg-surface px-4 py-2 text-sm font-medium">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Trending products */}
      <section>
        <h3 className="mb-3 text-xl font-bold">🛍️ Trending Products</h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {data.trendingProducts.map((p) => (
            <Card key={p.name} hover className="p-4 sm:p-5">
              <div className="text-4xl" aria-hidden>{p.emoji}</div>
              <h4 className="mt-2 break-words font-body text-base font-semibold leading-snug">{p.name}</h4>
              <p className="mt-1 text-sm text-muted">{p.price}</p>
              <Badge variant="green" className="mt-3">📊 {p.demandScore}/100</Badge>
            </Card>
          ))}
        </div>
      </section>

      {/* Chart */}
      <Card className="p-5">
        <h3 className="text-xl font-bold">Product Demand Score</h3>
        <p className="mb-4 text-sm text-muted">Higher score = more buyers looking for it (out of 100)</p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.chart} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#2B221B" />
              <XAxis dataKey="label" tick={{ fill: '#B9A898', fontSize: 12 }} axisLine={{ stroke: '#3A2E25' }} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#B9A898', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(224,165,38,0.12)' }} />
              <Bar dataKey="demand" fill="#C2542D" radius={[4, 4, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer font-medium text-mustard">View as table</summary>
          <table className="mt-2 w-full text-left">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="py-1.5 font-medium">Product</th>
                <th className="py-1.5 text-right font-medium">Demand score</th>
              </tr>
            </thead>
            <tbody>
              {data.chart.map((row) => (
                <tr key={row.label} className="border-b border-line/60">
                  <td className="py-1.5">{row.label}</td>
                  <td className="py-1.5 text-right font-semibold">{row.demand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </Card>

      {/* Insights */}
      <section>
        <h3 className="mb-3 text-xl font-bold">💡 Insights for You</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {data.insights.map((tip, i) => (
            <Card key={i} className="flex gap-3 border-l-4 border-mustard p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mustard/20 font-bold text-mustard-dark">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed">{tip}</p>
            </Card>
          ))}
        </div>
      </section>

      <p className="text-xs text-muted">
        Note: Trends are generated using free AI tools and public data. Use them as a guide, not a guarantee.
      </p>
    </div>
  );
}
