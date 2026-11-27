export default function Card({ children, className = '', hover = false, pattern = false, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={`overflow-hidden rounded-card border border-line bg-surface shadow-soft ${
        hover ? 'transition-all duration-200 hover:-translate-y-1 hover:border-mustard/40 hover:shadow-lift' : ''
      } ${className}`}
      {...props}
    >
      {pattern && <div className="block-print-border" aria-hidden />}
      {children}
    </Tag>
  );
}
