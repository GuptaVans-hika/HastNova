import { useAuth } from '../../context/AuthContext.jsx';
import AppLayout from './AppLayout.jsx';
import PublicLayout from './PublicLayout.jsx';

// Explore, FAQ and About are open to everyone:
// guests see the public navbar, logged-in users keep their sidebar.
export default function SmartLayout() {
  const { user } = useAuth();
  return user ? <AppLayout /> : <PublicLayout />;
}

// Adds page padding for guests (AppLayout already pads its content)
export function PageContainer({ children }) {
  const { user } = useAuth();
  if (user) return children;
  return <div className="mx-auto max-w-6xl px-4 py-8 sm:px-5 lg:py-12">{children}</div>;
}
