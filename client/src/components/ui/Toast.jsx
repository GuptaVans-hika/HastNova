const styles = {
  success: { cls: 'bg-leaf text-cream', icon: '✅' },
  error: { cls: 'bg-terracotta text-cream', icon: '⚠️' },
  info: { cls: 'bg-indigo text-cream', icon: 'ℹ️' },
};

export default function Toast({ message, type = 'success', onClose }) {
  const s = styles[type] || styles.info;
  return (
    <div
      role="status"
      className={`pointer-events-auto flex w-full max-w-md animate-slideUp items-center gap-3 rounded-xl px-4 py-3 shadow-lift ${s.cls}`}
    >
      <span aria-hidden>{s.icon}</span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button onClick={onClose} className="rounded-lg px-2 py-1 text-lg leading-none hover:bg-white/20" aria-label="Close">
        ×
      </button>
    </div>
  );
}
