'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { fetchFaqs } from '@/features/content/api';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { Eyebrow } from './SectionHeading';

export function FaqSection() {
  const faqsQuery = useQuery({ queryKey: ['faqs'], queryFn: fetchFaqs });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1120px]">
        <div className="max-w-2xl">
          <Eyebrow>Support</Eyebrow>
          <h2 className="mt-3.5 font-pd-display text-[32px] font-semibold leading-[1.1] tracking-[-.02em] text-pd-text sm:text-[40px] lg:text-[48px]">
            Frequently asked questions
          </h2>
        </div>

        {faqsQuery.isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-6 w-6 text-pd-accent" />
          </div>
        ) : faqsQuery.isError ? (
          <div className="mt-10">
            <Alert variant="error">Couldn&apos;t load the FAQ right now. Try again shortly.</Alert>
          </div>
        ) : faqsQuery.data && faqsQuery.data.length > 0 ? (
          <div className="mt-10 flex flex-col divide-y divide-hairline border-y border-hairline">
            {faqsQuery.data.map((faq, index) => {
              const isOpen = openIndex === index;
              const panelId = `faq-panel-${faq.id}`;
              return (
                <div key={faq.id}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="font-pd-display text-[16px] font-semibold text-pd-text">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-pd-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden
                    />
                  </button>
                  {isOpen && (
                    <p id={panelId} className="max-w-3xl pb-5 text-[15px] leading-relaxed text-pd-text-muted">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-10 text-[15px] text-pd-text-muted">No questions have been published yet.</p>
        )}
      </div>
    </section>
  );
}
