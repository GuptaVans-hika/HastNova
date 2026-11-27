import { useEffect, useRef } from 'react';
import Badge from './ui/Badge.jsx';
import Button from './ui/Button.jsx';
import Skeleton from './ui/Skeleton.jsx';

const providerName = { groq: 'Groq', gemini: 'Gemini' };

function Section({ icon, title, children }) {
  return (
    <section className="mt-6">
      <h3 className="mb-2 flex items-center gap-2 font-body text-base font-bold uppercase tracking-wide text-mustard">
        <span aria-hidden>{icon}</span> {title}
      </h3>
      {children}
    </section>
  );
}

function LessonLoading() {
  return (
    <div aria-busy="true">
      <div className="flex items-center gap-4 rounded-2xl border border-mustard/40 bg-raised p-4">
        <span className="h-8 w-8 shrink-0 animate-spin rounded-full border-4 border-mustard border-t-transparent" aria-hidden />
        <div>
          <p className="font-semibold">Our AI is writing your lesson…</p>
          <p className="text-sm text-muted">This takes about 10-20 seconds the first time. After that it opens instantly.</p>
        </div>
      </div>
      <Skeleton className="mt-6 h-4 w-1/3" />
      <Skeleton className="mt-3 h-20 w-full" />
      <Skeleton className="mt-6 h-4 w-1/4" />
      <Skeleton className="mt-3 h-32 w-full" />
    </div>
  );
}

function LessonBody({ lesson }) {
  const paragraphs = lesson.overview.split(/\n\s*\n/).filter(Boolean);
  return (
    <>
      <div className="space-y-3 leading-relaxed">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-indigo/60 bg-indigo/25 p-4">
        <p className="font-semibold">💡 Why this matters</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{lesson.whyItMatters}</p>
      </div>

      <Section icon="🪜" title="How to do it">
        <ol className="space-y-3">
          {lesson.instructions.map((ins, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracotta text-sm font-bold text-cream">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{ins.title}</p>
                <p className="text-sm leading-relaxed text-muted">{ins.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section icon="🎯" title="Practice task">
        <p className="rounded-2xl border border-mustard/40 bg-mustard/10 p-4 leading-relaxed">{lesson.practiceTask}</p>
      </Section>

      <Section icon="🚫" title="Common mistakes">
        <ul className="space-y-3">
          {lesson.commonMistakes.map((m, i) => (
            <li key={i} className="rounded-2xl border border-line bg-raised p-3 text-sm">
              <p>
                <span className="font-semibold text-[#F0A07F]">Mistake: </span>
                {m.mistake}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-[#A9D49A]">Fix: </span>
                {m.fix}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {lesson.safety?.length > 0 && (
        <Section icon="⚠️" title="Stay safe">
          <ul className="list-disc space-y-1 rounded-2xl border border-terracotta/40 bg-terracotta/10 p-4 pl-8 text-sm">
            {lesson.safety.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Section>
      )}

      <Section icon="✅" title="You are ready to move on when">
        <ul className="space-y-2">
          {lesson.readyWhen.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-[#A9D49A]" aria-hidden>✓</span>
              {r}
            </li>
          ))}
        </ul>
      </Section>

      {lesson.earningTip && (
        <div className="mt-6 rounded-2xl border border-leaf/50 bg-leaf/15 p-4">
          <p className="font-semibold">💰 Earning tip</p>
          <p className="mt-1 text-sm leading-relaxed">{lesson.earningTip}</p>
        </div>
      )}

      <p className="mt-6 text-xs text-muted">
        ✨ Written by AI ({providerName[lesson.source] || lesson.source}) for you. Always follow safety advice from an
        experienced karigar or trainer.
      </p>
    </>
  );
}

/**
 * Full-screen sheet on phones, centred panel on larger screens.
 * Props: step, number, level, lesson, loading, error, onRetry, onClose, onToggleComplete, saving
 */
export default function StepLessonModal({ step, number, level, lesson, loading, error, onRetry, onClose, onToggleComplete, saving }) {
  const closeRef = useRef(null);

  // Esc closes; lock page scroll while open; focus the close button for keyboard users
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-title"
        className="flex max-h-[92vh] w-full animate-slideUp flex-col overflow-hidden rounded-t-3xl border border-line bg-surface shadow-lift sm:max-w-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="block-print-border shrink-0" aria-hidden />

        {/* Header */}
        <div className="flex shrink-0 items-start gap-3 border-b border-line p-5">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
              {level} · Step {number}
            </p>
            <h2 id="lesson-title" className="mt-1 break-words text-2xl font-bold leading-tight">
              {step.title}
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="neutral">⏱️ {step.duration}</Badge>
              <Badge variant="indigo">✨ AI lesson</Badge>
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-raised text-xl hover:bg-line"
            aria-label="Close lesson"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {error ? (
            <div className="py-6 text-center">
              <p className="text-4xl" aria-hidden>😕</p>
              <p className="mt-3 font-semibold">{error}</p>
              <Button className="mt-4" onClick={onRetry}>Try again</Button>
            </div>
          ) : loading || !lesson ? (
            <LessonLoading />
          ) : (
            <LessonBody lesson={lesson} />
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 gap-3 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button variant="ghost" className="flex-1 border border-line" onClick={onClose}>
            Close
          </Button>
          <Button
            className="flex-1"
            variant={step.completed ? 'secondary' : 'primary'}
            loading={saving}
            onClick={onToggleComplete}
          >
            {step.completed ? '✓ Completed' : 'Mark as complete'}
          </Button>
        </div>
      </div>
    </div>
  );
}
