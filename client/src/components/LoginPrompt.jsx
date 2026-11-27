import { useLocation } from 'react-router-dom';
import Card from './ui/Card.jsx';
import Button from './ui/Button.jsx';

// Shown to visitors on features that need an account
export default function LoginPrompt({ icon = '🔒', title, text }) {
  const location = useLocation();
  const from = location.pathname + location.search;
  return (
    <Card className="p-8 text-center">
      <div className="text-5xl" aria-hidden>{icon}</div>
      <h3 className="mt-3 text-xl font-bold">{title}</h3>
      {text && <p className="mx-auto mt-2 max-w-md text-sm text-muted">{text}</p>}
      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
        <Button to="/login?mode=signup" state={{ from }}>Create free account</Button>
        <Button to="/login" variant="outline" state={{ from }}>Login</Button>
      </div>
    </Card>
  );
}
