import Card from './ui/Card.jsx';
import Badge from './ui/Badge.jsx';
import Button from './ui/Button.jsx';
import { useCrafts } from '../context/CraftsContext.jsx';

function contactAction(item) {
  const contact = item.contact || '';
  if (contact.includes('@') && !contact.includes(' ')) return { href: `mailto:${contact}`, label: '✉️ Email' };
  if (/^\+?[\d\s-]{8,}$/.test(contact)) return { href: `tel:${contact.replace(/[\s-]/g, '')}`, label: '📞 Call' };
  if (item.link) return { href: item.link, label: '🌐 Visit website', external: true };
  return null;
}

export default function OpportunityCard({ item }) {
  const craft = useCrafts().getCraft(item.craftId);
  const action = contactAction(item);
  const contactIsText = action?.external && item.contact;

  return (
    <Card hover className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold leading-snug">{item.name}</h3>
        <Badge variant={item.type === 'Workshop' ? 'mustard' : 'indigo'}>{item.type}</Badge>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        <span>📍 {[item.city, item.state].filter(Boolean).join(', ')}</span>
        {craft && <span>{craft.emoji} {craft.name}</span>}
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed">{item.description}</p>
      {item.date && <p className="mt-3 text-sm font-medium text-leaf">🗓️ {item.date}</p>}
      {contactIsText && <p className="mt-3 text-xs text-muted">ℹ️ {item.contact}</p>}
      {action && (
        <Button
          href={action.href}
          variant={item.type === 'Workshop' ? 'primary' : 'secondary'}
          fullWidth
          className="mt-4"
          {...(action.external && { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {action.label}
        </Button>
      )}
    </Card>
  );
}
