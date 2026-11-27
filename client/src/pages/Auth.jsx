import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import { useCrafts } from '../context/CraftsContext.jsx';
import { INDIAN_STATES } from '../services/helpers.js';
import { toFormErrors } from '../services/mappers.js';

const BIO_MAX = 150;
const STORY_MAX = 2000;
const STEP_TITLES = ['Create your account', 'About you & your craft', 'Tell your story'];

// The phone number is the login ID, so there is no separate username
const emptySignup = {
  phone: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  age: '',
  city: '',
  state: '',
  primaryCraft: '',
  experience: '',
  bio: '',
  craftStory: '',
};

function validateStep(step, d) {
  const e = {};
  if (step === 1) {
    if (!/^[6-9]\d{9}$/.test(d.phone)) e.phone = 'Enter a valid 10-digit mobile number (starts with 6-9).';
    if (d.password.length < 8) e.password = 'Password must be at least 8 characters.';
    else if (d.password.length > 72) e.password = 'Password is too long (max 72 characters).';
    if (!d.confirmPassword) e.confirmPassword = 'Please type your password again.';
    else if (d.password !== d.confirmPassword) e.confirmPassword = 'Passwords do not match.';
  }
  if (step === 2) {
    if (d.fullName.trim().length < 2) e.fullName = 'Please enter your full name.';
    const age = Number(d.age);
    if (!d.age || age < 14 || age > 100) e.age = 'Age should be between 14 and 100.';
    if (!d.city.trim()) e.city = 'Please enter your city or village.';
    if (!d.state) e.state = 'Please choose your state.';
    if (!d.primaryCraft) e.primaryCraft = 'Please choose your main craft.';
    const exp = Number(d.experience);
    if (d.experience === '' || exp < 0 || exp > 80) e.experience = 'Enter years of experience (0 if new).';
    else if (d.age && exp > Number(d.age)) e.experience = 'Experience cannot be more than your age.';
  }
  if (step === 3) {
    if (!d.bio.trim()) e.bio = 'Please write a short line about yourself.';
    else if (d.bio.length > BIO_MAX) e.bio = `Keep it under ${BIO_MAX} characters.`;
    if (d.craftStory.length > STORY_MAX) e.craftStory = `Keep it under ${STORY_MAX} characters.`;
  }
  return e;
}

export default function Auth() {
  const [params, setParams] = useSearchParams();
  const mode = params.get('mode') === 'signup' ? 'signup' : 'login';
  const setMode = (m) => setParams(m === 'signup' ? { mode: 'signup' } : {});

  return (
    <div className="grid min-h-[calc(100vh-4rem)] md:grid-cols-2">
      {/* Left: pattern + tagline */}
      <div className="booti-pattern relative hidden flex-col justify-between p-10 text-cream md:flex">
        <div>
          <p className="font-heading text-5xl font-extrabold leading-tight">
            Seekho.<br />
            <span className="text-mustard">Badho.</span>
            <br />
            Kamao.
          </p>
          <p className="mt-4 max-w-sm text-cream/85">Learn new skills, grow your craft, and earn more - all in one place.</p>
        </div>
        <div className="space-y-3">
          {['🗺️ Clear roadmap for your level', '🤝 Workshops & NGOs near you', '📈 What buyers want - market trends'].map((t) => (
            <div key={t} className="rounded-2xl bg-cream/10 px-4 py-3 backdrop-blur">{t}</div>
          ))}
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-start justify-center px-4 py-8 sm:px-8 md:items-center">
        <div className="w-full max-w-md">
          <div className="block-print-border mb-6 rounded-full md:hidden" aria-hidden />
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-surface p-1.5 shadow-soft" role="tablist">
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={`min-h-[48px] rounded-xl font-semibold transition ${
                  mode === m ? 'bg-terracotta text-cream shadow-soft' : 'text-ink hover:bg-canvas'
                }`}
              >
                {m === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>
          {mode === 'login' ? <LoginForm onSwitch={() => setMode('signup')} /> : <SignupForm onSwitch={() => setMode('login')} />}
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onSwitch }) {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!/^\d{10}$/.test(form.phone)) errs.phone = 'Enter your 10-digit mobile number.';
    if (!form.password) errs.password = 'Please enter your password.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const u = await login(form.phone, form.password);
      showToast(`Welcome back, ${u.fullName.split(' ')[0]}! 🙏`);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Welcome back 🙏</h1>
        <p className="mt-1 text-muted">Log in with your phone number.</p>
      </div>
      {errors.form && <p className="rounded-xl bg-terracotta/10 p-3 text-sm text-terracotta" role="alert">⚠️ {errors.form}</p>}
      <Input
        label="Phone number"
        type="tel"
        inputMode="numeric"
        maxLength={10}
        prefix="+91"
        placeholder="98765 43210"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
        error={errors.phone}
        autoComplete="tel"
      />
      <Input
        label="Password"
        type={showPw ? 'text' : 'password'}
        placeholder="Your password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        error={errors.password}
        autoComplete="current-password"
        rightSlot={<ShowPwButton show={showPw} onClick={() => setShowPw((s) => !s)} />}
      />
      <Button type="submit" fullWidth size="lg" loading={loading}>Login</Button>
      <p className="text-center text-sm text-muted">
        New here?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold text-terracotta underline">
          Create a free account
        </button>
      </p>
    </form>
  );
}

function ShowPwButton({ show, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-lg text-lg hover:bg-canvas"
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      {show ? '🙈' : '👁️'}
    </button>
  );
}

function SignupForm({ onSwitch }) {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const { craftOptions, loading: craftsLoading } = useCrafts();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(emptySignup);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const set = (field) => (e) => {
    let v = e.target.value;
    if (field === 'phone') v = v.replace(/\D/g, '').slice(0, 10);
    if (field === 'bio') v = v.slice(0, BIO_MAX);
    setData((d) => ({ ...d, [field]: v }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const next = () => {
    const errs = validateStep(step, data);
    setErrors(errs);
    if (!Object.keys(errs).length) setStep((s) => s + 1);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (step < 3) return next();
    const errs = validateStep(3, data);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      const u = await signup(data);
      showToast(`Account created! Welcome, ${u.fullName.split(' ')[0]} 🎉`);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      // Show server errors next to the right field and jump to the first step with an error
      const fieldErrors = toFormErrors(err.details);
      setErrors({ form: err.message, ...fieldErrors });
      const stepOf = (f) => (['phone', 'password'].includes(f) ? 1 : ['bio', 'craftStory'].includes(f) ? 3 : 2);
      const firstField = Object.keys(fieldErrors)[0];
      if (firstField) setStep(stepOf(firstField));
      else if (err.message.toLowerCase().includes('phone')) setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-terracotta">Step {step} of 3</p>
        <h1 className="text-3xl font-bold">{STEP_TITLES[step - 1]}</h1>
      </div>
      <ProgressBar value={(step / 3) * 100} color="mustard" />
      {errors.form && <p className="rounded-xl bg-terracotta/10 p-3 text-sm text-terracotta" role="alert">⚠️ {errors.form}</p>}

      {step === 1 && (
        <>
          <Input label="Phone number" type="tel" inputMode="numeric" prefix="+91" placeholder="98765 43210"
            value={data.phone} onChange={set('phone')} error={errors.phone} hint="You will log in with this number." autoComplete="tel" />
          <Input label="Password" type={showPw ? 'text' : 'password'} placeholder="At least 8 characters"
            value={data.password} onChange={set('password')} error={errors.password} autoComplete="new-password"
            rightSlot={<ShowPwButton show={showPw} onClick={() => setShowPw((s) => !s)} />} />
          <Input label="Confirm password" type={showPw ? 'text' : 'password'} placeholder="Type password again"
            value={data.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} autoComplete="new-password" />
        </>
      )}

      {step === 2 && (
        <>
          <Input label="Full name" placeholder="e.g. Ramesh Kumar" value={data.fullName} onChange={set('fullName')}
            error={errors.fullName} autoComplete="name" maxLength={80} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Age" type="number" inputMode="numeric" min={14} max={100} placeholder="e.g. 32"
              value={data.age} onChange={set('age')} error={errors.age} />
            <Input label="Experience (years)" type="number" inputMode="numeric" min={0} max={80} placeholder="e.g. 3"
              value={data.experience} onChange={set('experience')} error={errors.experience} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="City / Village" placeholder="e.g. Khurja" value={data.city} onChange={set('city')} error={errors.city} maxLength={60} />
            <Select label="State" placeholder="Choose state" value={data.state} onChange={set('state')} error={errors.state}
              options={INDIAN_STATES.map((s) => ({ value: s, label: s }))} />
          </div>
          <Select label="Primary craft" placeholder={craftsLoading ? 'Loading crafts…' : 'Choose your main craft'}
            value={data.primaryCraft} onChange={set('primaryCraft')} error={errors.primaryCraft} options={craftOptions} />
        </>
      )}

      {step === 3 && (
        <>
          <div>
            <Input as="textarea" label="Short bio" placeholder="e.g. Potter from Khurja making blue-glazed cups for 3 years."
              value={data.bio} onChange={set('bio')} error={errors.bio} rows={3} />
            <p className={`mt-1 text-right text-xs ${data.bio.length >= BIO_MAX ? 'font-semibold text-terracotta' : 'text-muted'}`}>
              {data.bio.length}/{BIO_MAX}
            </p>
          </div>
          <Input as="textarea" label="Your craft story (optional)"
            placeholder="How did you start? What makes your work special?"
            hint="Our AI uses this to make your learning roadmap personal."
            value={data.craftStory} onChange={set('craftStory')} error={errors.craftStory} rows={5} maxLength={STORY_MAX} />
        </>
      )}

      <div className="flex gap-3 pt-2">
        {step > 1 && (
          <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep((s) => s - 1)}>
            ← Back
          </Button>
        )}
        <Button type="submit" size="lg" className="flex-1" loading={loading}>
          {step < 3 ? 'Next →' : 'Create Account'}
        </Button>
      </div>
      <p className="text-center text-sm text-muted">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold text-terracotta underline">Login</button>
      </p>
    </form>
  );
}
