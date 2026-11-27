import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useCrafts } from '../context/CraftsContext.jsx';
import { getLevel, levelBadgeVariant, formatDate, INDIAN_STATES } from '../services/helpers.js';
import { toFormErrors } from '../services/mappers.js';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';

const BIO_MAX = 150;
const STORY_MAX = 2000;
// Phone is the login ID and cannot be changed
const editable = ['fullName', 'age', 'city', 'state', 'primaryCraft', 'experience', 'bio', 'craftStory'];
const pick = (u) => Object.fromEntries(editable.map((k) => [k, u[k] ?? '']));

function validate(d) {
  const e = {};
  if (d.fullName.trim().length < 2) e.fullName = 'Please enter your full name.';
  if (!d.age || d.age < 14 || d.age > 100) e.age = 'Age should be between 14 and 100.';
  if (!String(d.city).trim()) e.city = 'Please enter your city.';
  if (!d.state) e.state = 'Choose your state.';
  if (!d.primaryCraft) e.primaryCraft = 'Choose your craft.';
  if (d.experience === '' || d.experience < 0) e.experience = 'Enter years of experience.';
  else if (Number(d.experience) > Number(d.age)) e.experience = 'Experience cannot be more than your age.';
  if (!d.bio.trim()) e.bio = 'Bio cannot be empty.';
  if (d.craftStory.length > STORY_MAX) e.craftStory = `Keep it under ${STORY_MAX} characters.`;
  return e;
}

function Field({ label, children }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <div className="mt-1 text-base font-medium">{children}</div>
    </div>
  );
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(pick(user));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const { getCraft, craftOptions } = useCrafts();
  const craft = getCraft(user.primaryCraft);
  const level = user.level || getLevel(user.experience);

  const startEditing = () => {
    setForm(pick(user)); // latest saved values
    setErrors({});
    setEditing(true);
  };

  const set = (k) => (e) => {
    const v = k === 'bio' ? e.target.value.slice(0, BIO_MAX) : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const cancel = () => {
    setForm(pick(user));
    setErrors({});
    setEditing(false);
  };

  const save = async () => {
    const data = { ...form, age: Number(form.age), experience: Number(form.experience) };
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      showToast('Please fix the highlighted fields.', 'error');
      return;
    }
    setSaving(true);
    try {
      await updateProfile(data);
      setEditing(false);
      showToast('Profile updated successfully ✅');
    } catch (err) {
      setErrors(toFormErrors(err.details));
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="My Profile"
        icon="👤"
        subtitle="Your details help us suggest the right roadmap and workshops."
        action={
          !editing ? (
            <Button onClick={startEditing} variant="secondary">✏️ Edit Profile</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={cancel}>Cancel</Button>
              <Button onClick={save} loading={saving}>Save</Button>
            </div>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Summary card */}
        <Card pattern className="h-fit text-center">
          <div className="p-6">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo font-heading text-4xl font-bold text-cream">
              {user.fullName?.[0]?.toUpperCase()}
            </div>
            <h2 className="mt-3 text-2xl font-bold">{user.fullName}</h2>
            <p className="text-sm text-muted">+91 {user.phone}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Badge variant={levelBadgeVariant[level]}>{level}</Badge>
              {craft && <Badge variant="terracotta">{craft.emoji} {craft.name}</Badge>}
            </div>
            <p className="mt-4 text-sm italic text-muted">“{user.bio}”</p>
            {user.joinedAt && <p className="mt-4 text-xs text-muted">Member since {formatDate(user.joinedAt)}</p>}
          </div>
        </Card>

        {/* Details */}
        <Card className="p-6 lg:col-span-2">
          {!editing ? (
            <div className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name">{user.fullName}</Field>
                <Field label="Phone (login ID)">+91 {user.phone}</Field>
                <Field label="Age">{user.age} years</Field>
                <Field label="Location">{user.city}, {user.state}</Field>
                <Field label="Primary craft">{craft ? `${craft.emoji} ${craft.name}` : '-'}</Field>
                <Field label="Experience">{user.experience} years ({level})</Field>
              </div>
              <Field label="Short bio">{user.bio}</Field>
              <Field label="Craft story">
                {user.craftStory ? (
                  <p className="whitespace-pre-line leading-relaxed">{user.craftStory}</p>
                ) : (
                  <span className="text-muted">Not added yet. Tap Edit to share how you started.</span>
                )}
              </Field>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full name" value={form.fullName} onChange={set('fullName')} error={errors.fullName} maxLength={80} />
                <Input label="Phone (cannot be changed)" value={`+91 ${user.phone}`} disabled className="opacity-70" />
                <Input label="Age" type="number" inputMode="numeric" value={form.age} onChange={set('age')} error={errors.age} />
                <Input label="City / Village" value={form.city} onChange={set('city')} error={errors.city} maxLength={60} />
                <Select label="State" value={form.state} onChange={set('state')} error={errors.state}
                  options={INDIAN_STATES.map((s) => ({ value: s, label: s }))} placeholder="Choose state" />
                <Select label="Primary craft" value={form.primaryCraft} onChange={set('primaryCraft')}
                  error={errors.primaryCraft} options={craftOptions} placeholder="Choose craft" />
                <Input label="Experience (years)" type="number" inputMode="numeric" value={form.experience} onChange={set('experience')}
                  error={errors.experience} />
              </div>
              <div>
                <Input as="textarea" label="Short bio" value={form.bio} onChange={set('bio')} error={errors.bio} rows={3} />
                <p className="mt-1 text-right text-xs text-muted">{form.bio.length}/{BIO_MAX}</p>
              </div>
              <Input as="textarea" label="Craft story (optional)" value={form.craftStory} onChange={set('craftStory')}
                placeholder="How did you start? What makes your work special?" rows={5} maxLength={STORY_MAX}
                error={errors.craftStory} hint="Used by our AI to personalise new roadmaps." />
              <div className="flex gap-3 sm:hidden">
                <Button variant="outline" className="flex-1" onClick={cancel}>Cancel</Button>
                <Button className="flex-1" onClick={save} loading={saving}>Save</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
