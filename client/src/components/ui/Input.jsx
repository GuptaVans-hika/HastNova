import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, as = 'input', className = '', prefix, rightSlot, ...props },
  ref
) {
  const id = useId();
  const Tag = as;
  const base = `w-full rounded-xl border-2 bg-surface px-4 text-base text-ink placeholder:text-muted/60 transition focus:outline-none focus:ring-0 ${
    error ? 'border-terracotta focus:border-terracotta' : 'border-line focus:border-mustard'
  } ${as === 'textarea' ? 'min-h-[110px] py-3' : 'min-h-[52px]'} ${prefix ? 'pl-14' : ''} ${rightSlot ? 'pr-14' : ''}`;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-center border-r-2 border-line text-sm font-semibold text-muted">
            {prefix}
          </span>
        )}
        <Tag ref={ref} id={id} className={base} aria-invalid={!!error} {...props} />
        {rightSlot && <div className="absolute inset-y-0 right-0 flex items-center pr-2">{rightSlot}</div>}
      </div>
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-sm text-terracotta" role="alert">
          <span aria-hidden>⚠️</span> {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-sm text-muted">{hint}</p>
      )}
    </div>
  );
});

export default Input;
