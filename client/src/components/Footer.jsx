import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { useCrafts } from '../context/CraftsContext.jsx';

export default function Footer() {
  const { crafts } = useCrafts();
  return (
    <footer className="mt-16 border-t border-line bg-[#0D0A08] text-cream/80">
      <div className="block-print-border" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed">
            Seekho. Badho. Kamao. A free learning home for India’s karigars - roadmaps, workshops and market insights in
            simple language.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-heading text-lg text-cream">Crafts</h4>
          <ul className="space-y-2 text-sm">
            {crafts.slice(0, 4).map((c) => (
              <li key={c.id}>
                <Link to={`/explore/${c.id}`} className="hover:text-mustard">
                  {c.emoji} {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-heading text-lg text-cream">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/explore" className="hover:text-mustard">Explore Crafts</Link></li>
            <li><Link to="/about" className="hover:text-mustard">About Us</Link></li>
            <li><Link to="/faq" className="hover:text-mustard">FAQ</Link></li>
            <li><Link to="/login" className="hover:text-mustard">Login / Sign up</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-heading text-lg text-cream">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>📧 support@hastanova.in</li>
            <li>📞 1800-123-4567 (Toll free)</li>
            <li>🕘 Mon-Sat, 9am - 6pm</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} HastaNova. Made with ❤️ for Indian artisans.
      </div>
    </footer>
  );
}
