import Button from '../components/ui/Button.jsx';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-7xl" aria-hidden>🏺</p>
      <h1 className="mt-4 text-4xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted">Oops! This pot seems to be broken. Let’s take you back home.</p>
      <Button to="/" size="lg" className="mt-6">Go Home</Button>
    </div>
  );
}
