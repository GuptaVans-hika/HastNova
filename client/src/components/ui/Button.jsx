import { Link } from 'react-router-dom';

const variants = {
  primary:
    'bg-gradient-to-r from-terracotta to-[#D9693F] text-cream hover:from-terracotta-dark hover:to-terracotta shadow-soft hover:shadow-glow',
  secondary: 'bg-indigo text-cream hover:bg-[#3B4C7D] shadow-soft ring-1 ring-inset ring-cream/10',
  mustard: 'bg-mustard text-brown hover:bg-mustard-dark shadow-soft',
  outline: 'border-2 border-terracotta text-[#E5845F] hover:bg-terracotta hover:text-cream',
  ghost: 'text-ink hover:bg-raised',
  light: 'bg-canvas text-ink hover:bg-surface shadow-soft',
};

const sizes = {
  sm: 'min-h-[40px] px-4 text-sm',
  md: 'min-h-[48px] px-5 text-base',
  lg: 'min-h-[56px] px-7 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
    variants[variant]
  } ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  const content = (
    <>
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
      )}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
}
