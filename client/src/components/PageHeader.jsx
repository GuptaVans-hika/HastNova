export default function PageHeader({ title, subtitle, icon, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-bold sm:text-4xl">
          {icon && <span aria-hidden>{icon}</span>}
          {title}
        </h1>
        {subtitle && <p className="mt-2 max-w-2xl text-muted">{subtitle}</p>}
        <div className="mt-3 h-1 w-20 rounded-full bg-mustard" aria-hidden />
      </div>
      {action}
    </div>
  );
}
