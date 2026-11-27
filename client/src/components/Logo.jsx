import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';

// The logo always goes to the home page; if you're already there it scrolls back to the top.
export default function Logo({ light = false }) {
  const { pathname } = useLocation();

  return (
    <Link
      to="/"
      onClick={() => pathname === '/' && window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="flex items-center gap-2"
      aria-label="HastaNova - go to home page"
    >
      <img src={logo} alt="" className="h-10 w-10" />
      <span className={`font-heading text-xl font-bold ${light ? 'text-cream' : 'text-ink'}`}>
        Hasta<span className="text-terracotta">Nova</span>
      </span>
    </Link>
  );
}
