import { Link } from 'react-router-dom';
import Card from './ui/Card.jsx';
import Button from './ui/Button.jsx';
import Badge from './ui/Badge.jsx';

const accentBg = {
  terracotta: 'bg-terracotta/10',
  brown: 'bg-cream/10',
  mustard: 'bg-mustard/20',
  indigo: 'bg-indigo/10',
  leaf: 'bg-leaf/15',
};

// variant "simple" = landing page tile, "course" = catalog card with counts + CTA
export default function CraftCard({ craft, variant = 'course', onStart }) {
  if (variant === 'simple') {
    return (
      <Link to={`/explore/${craft.id}`} className="block h-full">
        <Card hover className="h-full p-5 text-center">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-4xl ${accentBg[craft.accent]}`}>
            {craft.emoji}
          </div>
          <h3 className="mt-3 text-lg font-bold leading-tight">{craft.name}</h3>
          <p className="mt-1 text-xs text-muted">{craft.hindiName}</p>
        </Card>
      </Link>
    );
  }

  return (
    <Card hover pattern className="flex h-full flex-col">
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-4">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-4xl ${accentBg[craft.accent]}`}>
            {craft.emoji}
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-bold leading-tight">{craft.name}</h3>
            <p className="text-sm text-muted">{craft.hindiName}</p>
          </div>
        </div>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{craft.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="terracotta">🗺️ {craft.stepCount} roadmap steps</Badge>
          <Badge variant="neutral">🤝 {craft.opportunityCount} workshops/NGOs</Badge>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button to={`/explore/${craft.id}`} variant="outline" size="sm">
            Details
          </Button>
          <Button size="sm" onClick={() => onStart?.(craft)}>
            Start Learning
          </Button>
        </div>
      </div>
    </Card>
  );
}
