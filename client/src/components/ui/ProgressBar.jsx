const colors = {
  terracotta: 'bg-terracotta',
  mustard: 'bg-mustard',
  green: 'bg-leaf',
  indigo: 'bg-indigo',
};

export default function ProgressBar({ value = 0, color = 'terracotta', showLabel = false, label, size = 'md' }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      {(showLabel || label) && (
        <div className="mb-1.5 flex justify-between text-sm">
          <span className="font-medium text-muted">{label}</span>
          {showLabel && <span className="font-semibold text-ink">{pct}%</span>}
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-raised ${size === 'sm' ? 'h-2' : 'h-3'}`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`h-full rounded-full transition-all duration-500 ${colors[color]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
