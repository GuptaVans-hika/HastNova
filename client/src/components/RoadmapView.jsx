import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { fetchRoadmap, setStepCompleted, regenerateRoadmap, fetchStepLesson } from '../services/roadmapService.js';
import { getLevel } from '../services/helpers.js';
import StepLessonModal from './StepLessonModal.jsx';
import Card from './ui/Card.jsx';
import Badge from './ui/Badge.jsx';
import Button from './ui/Button.jsx';
import ProgressBar from './ui/ProgressBar.jsx';
import Skeleton from './ui/Skeleton.jsx';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const levelIcons = { Beginner: '🌱', Intermediate: '🌿', Advanced: '🌳' };
const providerName = { groq: 'Groq', gemini: 'Gemini' };

function GeneratingState() {
  return (
    <div className="space-y-4" aria-busy="true">
      <Card className="flex items-center gap-4 border-mustard/40 p-5">
        <span className="h-8 w-8 shrink-0 animate-spin rounded-full border-4 border-mustard border-t-transparent" aria-hidden />
        <div>
          <p className="font-semibold">Preparing your roadmap…</p>
          <p className="text-sm text-muted">
            On your first visit our AI writes a roadmap just for you. This can take up to 20 seconds.
          </p>
        </div>
      </Card>
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-40 w-full rounded-card" />
      ))}
    </div>
  );
}

// Logged-in users only. Each level is loaded (and on first visit AI-generated) when its tab is opened.
// Render with key={craftId} so switching crafts starts with fresh state.
export default function RoadmapView({ craftId }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const userLevel = user.level || getLevel(user.experience);

  const [level, setLevel] = useState(userLevel);
  const [byLevel, setByLevel] = useState({}); // level -> roadmap
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(null); // step id
  const [regenerating, setRegenerating] = useState(false);
  // AI lesson window: which step is open + lessons already loaded (by step id)
  const [openStepId, setOpenStepId] = useState(null);
  const [lessons, setLessons] = useState({});
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonError, setLessonError] = useState('');

  const roadmap = byLevel[level];

  useEffect(() => {
    if (byLevel[level]) return;
    let active = true;
    setLoading(true);
    setError('');
    fetchRoadmap(craftId, level)
      .then(({ roadmap: r, progress: p }) => {
        if (!active) return;
        setByLevel((prev) => ({ ...prev, [level]: r }));
        setProgress(p);
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [craftId, level, byLevel]);

  const updateStep = (stepId, completed) =>
    setByLevel((prev) => ({
      ...prev,
      [level]: {
        ...prev[level],
        steps: prev[level].steps.map((s) => (s.id === stepId ? { ...s, completed } : s)),
      },
    }));

  const handleToggle = async (step) => {
    if (saving) return;
    setSaving(step.id);
    try {
      const { completed, progress: p } = await setStepCompleted(craftId, step, !step.completed);
      updateStep(step.id, completed);
      setProgress(p);
      if (completed) showToast(`Shabaash! "${step.title}" completed 🎉`);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setSaving(null);
    }
  };

  const loadLesson = async (step) => {
    setLessonLoading(true);
    setLessonError('');
    try {
      const lesson = await fetchStepLesson(craftId, step.level, step.order);
      setLessons((prev) => ({ ...prev, [step.id]: lesson }));
    } catch (e) {
      setLessonError(e.message);
    } finally {
      setLessonLoading(false);
    }
  };

  const openLesson = (step) => {
    setOpenStepId(step.id);
    setLessonError('');
    if (!lessons[step.id]) loadLesson(step);
  };

  const closeLesson = useCallback(() => setOpenStepId(null), []);

  const handleRegenerate = async () => {
    const done = roadmap.steps.filter((s) => s.completed).length;
    const warning = done ? `\n\nYour ${done} completed step(s) in this level will be reset.` : '';
    if (!window.confirm(`Create a new AI roadmap for the ${level} level?${warning}`)) return;
    setRegenerating(true);
    try {
      const { roadmap: r, progress: p } = await regenerateRoadmap(craftId, level);
      setByLevel((prev) => ({ ...prev, [level]: r }));
      setProgress(p);
      // old lessons belong to the old steps
      setLessons((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !id.includes(`:${level}:`))));
      showToast('Your new roadmap is ready ✨');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setRegenerating(false);
    }
  };

  const steps = roadmap?.steps || [];
  const levelDone = steps.filter((s) => s.completed).length;
  const openIndex = steps.findIndex((s) => s.id === openStepId);
  const openStep = openIndex === -1 ? null : steps[openIndex];

  return (
    <div>
      {/* Overall progress (all levels) */}
      <Card className="mb-6 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex-1">
            <ProgressBar value={progress?.percent || 0} showLabel label="Overall roadmap progress" color="green" />
          </div>
          <div className="text-sm text-muted sm:w-48 sm:text-right">
            {progress ? `${progress.completedSteps} of ${progress.totalSteps} steps done` : '…'}
          </div>
        </div>
      </Card>

      {/* Level tabs */}
      <div className="mb-8 grid grid-cols-3 gap-1.5 rounded-2xl border border-line bg-surface p-1.5 shadow-soft" role="tablist">
        {LEVELS.map((l) => (
          <button
            key={l}
            role="tab"
            aria-selected={level === l}
            onClick={() => setLevel(l)}
            disabled={regenerating}
            className={`relative min-h-[52px] rounded-xl px-1 text-sm font-semibold transition sm:text-base ${
              level === l ? 'bg-indigo text-cream shadow-soft' : 'text-ink hover:bg-raised'
            }`}
          >
            <span className="hidden sm:inline" aria-hidden>{levelIcons[l]} </span>
            {l}
            {l === userLevel && (
              <span className="absolute -top-2 right-1 rounded-full bg-mustard px-2 py-0.5 text-[10px] font-bold text-brown">
                YOU
              </span>
            )}
          </button>
        ))}
      </div>

      {level !== userLevel && (
        <p className="-mt-4 mb-6 text-center text-sm text-muted">
          👀 You are previewing the {level} level. Your level is <strong className="text-ink">{userLevel}</strong>.
        </p>
      )}

      {error ? (
        <Card className="p-8 text-center">
          <div className="text-5xl" aria-hidden>😕</div>
          <p className="mt-3 font-semibold">{error}</p>
          <Button className="mt-4" onClick={() => setByLevel((prev) => ({ ...prev }))}>
            Try again
          </Button>
        </Card>
      ) : loading || regenerating || !roadmap ? (
        <GeneratingState />
      ) : (
        <>
          {/* Heading + source + regenerate */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold">{level} Roadmap</h3>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {roadmap.personalised ? (
                  <Badge variant="indigo">✨ AI-personalised for you · {providerName[roadmap.source]}</Badge>
                ) : (
                  <Badge variant="neutral">📚 Standard roadmap</Badge>
                )}
                <Badge variant="green">{levelDone}/{steps.length} done</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleRegenerate} className="w-full sm:w-auto">
              {roadmap.personalised ? '🔄 New AI roadmap' : '✨ Get my AI roadmap'}
            </Button>
          </div>

          {!roadmap.personalised && (
            <p className="mb-5 rounded-xl border border-line bg-raised p-3 text-sm text-muted">
              Our AI helpers were busy, so you are seeing the standard roadmap. Tap “Get my AI roadmap” to try for a
              personal one.
            </p>
          )}

          <ol className="relative">
            {/* Timeline line: left on mobile, centre on desktop */}
            <div className="absolute bottom-0 left-[22px] top-0 w-1 rounded-full bg-mustard/40 md:left-1/2 md:-translate-x-1/2" aria-hidden />
            {steps.map((step, i) => {
              const done = step.completed;
              const right = i % 2 === 1;
              return (
                <li key={step.id} className="relative mb-8 last:mb-0 md:grid md:grid-cols-2 md:gap-14">
                  <div
                    className={`absolute left-0 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-canvas text-lg font-bold shadow-soft md:left-1/2 md:-translate-x-1/2 ${
                      done ? 'bg-leaf text-cream' : 'bg-terracotta text-cream'
                    }`}
                    aria-hidden
                  >
                    {done ? '✓' : i + 1}
                  </div>
                  <div className={`ml-16 md:ml-0 ${right ? 'md:col-start-2' : 'md:col-start-1'}`}>
                    <Card className={`p-5 transition ${done ? 'ring-2 ring-leaf/50' : ''}`}>
                      {/* Tapping the title/summary opens the full AI lesson */}
                      <button
                        type="button"
                        onClick={() => openLesson(step)}
                        className="group -m-2 block w-[calc(100%+1rem)] rounded-xl p-2 text-left transition hover:bg-raised"
                        aria-label={`Open full lesson: ${step.title}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">Step {i + 1}</p>
                            <h4 className="mt-0.5 break-words text-xl font-bold leading-snug group-hover:text-mustard">
                              {step.title}
                            </h4>
                          </div>
                          <Badge variant="neutral" className="shrink-0">⏱️ {step.duration}</Badge>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
                      </button>

                      <div className="mt-4">
                        <p className="mb-1.5 text-xs font-semibold uppercase text-muted">Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {step.skills.map((s) => (
                            <Badge key={s} variant="terracotta" wrap>{s}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="mb-1.5 text-xs font-semibold uppercase text-muted">Tools</p>
                        <div className="flex flex-wrap gap-1.5">
                          {step.tools.map((t) => (
                            <Badge key={t} variant="neutral" wrap>🛠️ {t}</Badge>
                          ))}
                        </div>
                      </div>
                      {step.safetyTip && (
                        <p className="mt-3 rounded-xl border border-mustard/30 bg-mustard/10 p-3 text-sm">
                          <span aria-hidden>⚠️ </span>
                          <strong>Safety:</strong> {step.safetyTip}
                        </p>
                      )}

                      <Button variant="outline" fullWidth className="mt-4" onClick={() => openLesson(step)}>
                        📖 {step.hasDetails || lessons[step.id] ? 'Open full lesson' : 'Read full lesson ✨'}
                      </Button>

                      <label
                        className={`mt-3 flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl border-2 px-4 font-semibold transition ${
                          done ? 'border-leaf bg-leaf/15 text-[#A9D49A]' : 'border-line hover:border-leaf'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="h-6 w-6 accent-[#4F7942]"
                          checked={done}
                          disabled={saving === step.id}
                          onChange={() => handleToggle(step)}
                        />
                        {saving === step.id ? 'Saving…' : done ? 'Completed!' : 'Mark as complete'}
                      </label>
                    </Card>
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}

      {openStep && (
        <StepLessonModal
          step={openStep}
          number={openIndex + 1}
          level={level}
          lesson={lessons[openStep.id]}
          loading={lessonLoading}
          error={lessonError}
          onRetry={() => loadLesson(openStep)}
          onClose={closeLesson}
          onToggleComplete={() => handleToggle(openStep)}
          saving={saving === openStep.id}
        />
      )}
    </div>
  );
}
