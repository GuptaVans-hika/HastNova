import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Logo from '../Logo.jsx';
import Footer from '../Footer.jsx';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/explore', label: 'Explore Crafts' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
];

const linkCls = ({ isActive }) =>
  `rounded-lg px-3 py-2 font-medium transition ${isActive ? 'text-terracotta' : 'text-ink hover:text-terracotta'}`;

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-5">
          <Logo />
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>
                {l.label}
              </NavLink>
            ))}
          </div>
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <Button to="/dashboard" size="sm">Go to Dashboard</Button>
            ) : (
              <>
                <Button to="/login" variant="ghost" size="sm">Login</Button>
                <Button to="/login?mode=signup" size="sm">Sign up</Button>
              </>
            )}
          </div>
          <button
            className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            {open ? '✕' : '☰'}
          </button>
        </nav>
        {open && (
          <div className="border-t border-line bg-canvas px-4 pb-4 md:hidden">
            <div className="flex flex-col py-2">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) => `${linkCls({ isActive })} py-3 text-lg`}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
            {user ? (
              <Button to="/dashboard" fullWidth onClick={() => setOpen(false)}>Go to Dashboard</Button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button to="/login" variant="outline" onClick={() => setOpen(false)}>Login</Button>
                <Button to="/login?mode=signup" onClick={() => setOpen(false)}>Sign up</Button>
              </div>
            )}
          </div>
        )}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
