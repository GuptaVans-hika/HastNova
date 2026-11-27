import { PageContainer } from '../components/layout/SmartLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

const features = [
  { icon: '🗺️', title: 'Level-based Roadmaps', text: 'Clear step-by-step learning paths for Beginner, Intermediate and Advanced karigars, with skills, tools and time needed.' },
  { icon: '🤝', title: 'Workshops & NGOs', text: 'Find trusted workshops and organisations near you that offer training, tools, raw material and market access.' },
  { icon: '📈', title: 'AI Market Trends', text: 'Free AI tools summarise what buyers want, demand levels and fair price ranges - in simple words.' },
];

const team = [
  { name: 'Gyanada Mishra', role: 'Content Strategist', icon: '✍️', color: 'bg-terracotta text-cream' },
  { name: 'Vanshika Gupta', role: 'Backend Programmer', icon: '💻', color: 'bg-indigo text-cream' },
  { name: 'Kavya Jugran', role: 'UI/UX Designer', icon: '🎨', color: 'bg-leaf text-cream' },
  { name: 'Poorvi Tomar', role: 'Data Researcher', icon: '📊', color: 'bg-mustard text-brown' },
  { name: 'Swastika Kulshreshtha', role: 'Marketing & Communication Lead', icon: '📣', color: 'bg-[#8B3A62] text-cream' },
];

const initials = (name) =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');

export default function About() {
  return (
    <PageContainer>
      <PageHeader title="About HastaNova" icon="🪔" subtitle="Seekho. Badho. Kamao. - Learn. Grow. Earn." />

      {/* Mission + problem */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card pattern>
          <div className="p-6">
            <h2 className="text-2xl font-bold">🎯 Our Mission</h2>
            <p className="mt-3 leading-relaxed text-muted">
              To help every Indian artisan learn new skills, keep traditional crafts alive, and earn a fair, growing
              income - with free tools made in simple language for mobile phones.
            </p>
          </div>
        </Card>
        <Card className="border-l-4 border-terracotta p-6">
          <h2 className="text-2xl font-bold">⚠️ The Problem</h2>
          <ul className="mt-3 space-y-2 text-muted">
            <li>• Most karigars learn only from family, with no clear path to improve.</li>
            <li>• Upskilling courses are expensive, far away or in English.</li>
            <li>• Artisans don’t know what buyers in cities want or fair prices.</li>
            <li>• Helpful NGOs and workshops are hard to find.</li>
          </ul>
        </Card>
      </div>

      {/* Features */}
      <h2 className="mb-4 mt-12 text-3xl font-bold">What We Offer</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} hover className="p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mustard/20 text-3xl">{f.icon}</div>
            <h3 className="mt-4 text-xl font-bold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
          </Card>
        ))}
      </div>

      {/* Team */}
      <h2 className="mb-4 mt-12 text-3xl font-bold">Our Team</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {team.map((m) => (
          <Card key={m.name} hover className="flex flex-col items-center p-5 text-center">
            <div className="relative">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full font-heading text-2xl font-bold ring-4 ring-surface ring-offset-2 ring-offset-mustard/40 ${m.color}`}
                aria-hidden
              >
                {initials(m.name)}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-raised text-base" aria-hidden>
                {m.icon}
              </span>
            </div>
            <p className="mt-4 font-semibold leading-snug">{m.name}</p>
            <p className="mt-1 text-sm text-muted">{m.role}</p>
          </Card>
        ))}
      </div>

      {/* Contact */}
      <Card className="booti-pattern mt-12 p-8 text-center text-cream">
        <h2 className="text-3xl font-bold text-cream">Get in Touch</h2>
        <p className="mt-2 text-cream/85">Partner with us, list your workshop, or just say Namaste.</p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:gap-8">
          <span>📧 support@hastanova.in</span>
          <span>📞 1800-123-4567</span>
          <span>📍 New Delhi, India</span>
        </div>
        <Button href="mailto:support@hastanova.in" variant="mustard" size="lg" className="mt-6">Email Us</Button>
      </Card>
    </PageContainer>
  );
}
