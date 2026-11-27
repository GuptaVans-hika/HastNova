export default function Skeleton({ className = 'h-4 w-full' }) {
  return <div className={`skeleton rounded-lg ${className}`} aria-hidden />;
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="rounded-card bg-surface p-5 shadow-soft">
      <Skeleton className="mb-4 h-10 w-10 rounded-full" />
      <Skeleton className="mb-3 h-5 w-2/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`mb-2 h-3 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} />
      ))}
    </div>
  );
}
