import { useId } from 'react';

export default function Select({ label, error, options = [], placeholder, className = '', ...props }) {
  const id = useId();
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`min-h-[52px] w-full appearance-none rounded-xl border-2 bg-surface px-4 pr-10 text-base text-ink focus:outline-none ${
            error ? 'border-terracotta' : 'border-line focus:border-mustard'
          }`}
          aria-invalid={!!error}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted" aria-hidden>
          ▾
        </span>
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-sm text-terracotta" role="alert">
          <span aria-hidden>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}
