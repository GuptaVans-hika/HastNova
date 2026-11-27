import { useState } from 'react';
import { faqs } from '../data/faqs.js';
import { PageContainer } from '../components/layout/SmartLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <PageContainer>
      <div className="mx-auto max-w-3xl">
        <PageHeader title="Frequently Asked Questions" icon="❓" subtitle="Simple answers to common questions." />
        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Card key={f.q} className={isOpen ? 'ring-2 ring-mustard' : ''}>
                <h3 className="font-body">
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="flex min-h-[60px] w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold"
                  >
                    <span className="flex gap-3">
                      <span className="text-terracotta">Q{i + 1}.</span>
                      {f.q}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas text-lg transition-transform ${
                        isOpen ? 'rotate-45 bg-mustard text-brown' : ''
                      }`}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <div id={`faq-${i}`} className="animate-slideUp px-5 pb-5 pl-[60px] leading-relaxed text-muted">
                    {f.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
        <Card className="mt-8 bg-indigo p-6 text-center text-cream">
          <p className="text-lg font-semibold">Still have a question?</p>
          <p className="mt-1 text-sm text-cream/80">Our team replies within 1 working day.</p>
          <Button href="mailto:support@hastanova.in" variant="mustard" className="mt-4">📧 Contact Support</Button>
        </Card>
      </div>
    </PageContainer>
  );
}
