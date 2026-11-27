const variants = {
  terracotta: 'bg-terracotta/15 text-[#F0A07F] border-terracotta/40',
  indigo: 'bg-indigo text-cream border-[#4A5C8F]',
  mustard: 'bg-mustard text-brown border-mustard',
  green: 'bg-leaf/20 text-[#A9D49A] border-leaf/50',
  neutral: 'bg-raised text-muted border-line',
  dark: 'bg-canvas text-ink border-line',
};

// wrap: allow long text (e.g. AI-written skills) to break onto two lines on small screens
export default function Badge({ children, variant = 'neutral', className = '', wrap = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
        wrap ? 'whitespace-normal break-words' : 'whitespace-nowrap'
      } ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
