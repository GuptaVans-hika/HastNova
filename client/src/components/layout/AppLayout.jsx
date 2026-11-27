import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import Logo from '../Logo.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/learning', label: 'My Learning', icon: '📚' },
  { to: '/explore', label: 'Explore Crafts', icon: '🔍' },
  { to: '/trends', label: 'Market Trends', icon: '📈' },
  { to: '/opportunities', label: 'Workshops & NGOs', icon: '🤝' },
  { to: '/roadmap', label: 'Roadmap', icon: '🗺️' },
  { to: '/profile', label: 'Profile', icon: '👤' },
  { to: '/faq', label: 'FAQ', icon: '❓' },
];

// Bottom tab bar on mobile shows the first 4 + "More"
const mobileTabs = navItems.slice(0, 4);
const moreItems = [...navItems.slice(4), { to: '/about', label: 'About Us', icon: 'ℹ️' }];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('You have logged out. See you soon! 🙏', 'info');
    navigate('/');
  };

  const initials = (user?.fullName || 'K')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-line bg-surface lg:flex">
        <div className="block-print-border" aria-hidden />
        <div className="px-6 py-5">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex min-h-[48px] items-center gap-3 rounded-xl px-4 font-medium transition ${
                  isActive ? 'bg-terracotta text-cream shadow-soft' : 'text-ink hover:bg-canvas'
                }`
              }
            >
              <span className="text-xl" aria-hidden>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex min-h-[48px] w-full items-center gap-3 rounded-xl px-4 font-medium text-terracotta transition hover:bg-terracotta/10"
          >
            <span className="text-xl" aria-hidden>🚪</span>
            Logout
          </button>
        </nav>
        <Link to="/profile" className="m-4 flex items-center gap-3 rounded-card bg-canvas p-3 hover:bg-raised">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo font-semibold text-cream">
            {initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-semibold">{user?.fullName}</span>
            <span className="block truncate text-xs text-muted">+91 {user?.phone}</span>
          </span>
        </Link>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-canvas/95 px-4 backdrop-blur lg:hidden">
        <Logo />
        <Link
          to="/profile"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo font-semibold text-cream"
          aria-label="Profile"
        >
          {initials}
        </Link>
      </header>

      <main className="min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="grid grid-cols-5">
          {mobileTabs.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMoreOpen(false)}
              className={({ isActive }) =>
                `flex min-h-[64px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
                  isActive ? 'text-terracotta' : 'text-muted'
                }`
              }
            >
              <span className="text-xl" aria-hidden>{item.icon}</span>
              {item.label.replace('Explore Crafts', 'Explore').replace('Market Trends', 'Trends')}
            </NavLink>
          ))}
          <button
            onClick={() => setMoreOpen((o) => !o)}
            className={`flex min-h-[64px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
              moreOpen ? 'text-terracotta' : 'text-muted'
            }`}
            aria-expanded={moreOpen}
          >
            <span className="text-xl" aria-hidden>☰</span>
            More
          </button>
        </div>
      </nav>

      {/* Mobile "More" sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMoreOpen(false)}>
          <div
            className="absolute inset-x-0 bottom-16 animate-slideUp rounded-t-3xl bg-surface p-4 pb-6 shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-raised" />
            <div className="grid grid-cols-3 gap-2">
              {moreItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMoreOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-[84px] flex-col items-center justify-center gap-1 rounded-2xl p-2 text-center text-xs font-medium ${
                      isActive ? 'bg-terracotta text-cream' : 'bg-canvas text-ink'
                    }`
                  }
                >
                  <span className="text-2xl" aria-hidden>{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="flex min-h-[84px] flex-col items-center justify-center gap-1 rounded-2xl bg-terracotta/10 p-2 text-xs font-medium text-terracotta"
              >
                <span className="text-2xl" aria-hidden>🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
