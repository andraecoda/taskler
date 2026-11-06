import { Reveal } from '@/components/kobo/Reveal';
import { SectionHeading } from '@/components/premium/SectionHeading';
import { TESTIMONIALS } from '@/features/kobo/constants';

export function TestimonialsSection() {
  return (
    <section id="earners" className="px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Reveal>
          <SectionHeading
            eyebrow="Real earners"
            title="Small taps, real income."
            description="Earners on CleekTap fit tasks between classes, shifts, and everything else — a few minutes at a time."
          />
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.name} className="rounded-pd-lg border border-hairline bg-surface-2 p-7">
                <span className="mb-4 inline-block rounded-full border border-pd-accent/25 bg-pd-accent-soft px-3 py-1 text-[13px] font-medium text-pd-accent">
                  {testimonial.amount}
                </span>
                <p className="mb-5 text-[15px] leading-relaxed text-pd-text">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="text-[12.5px] text-pd-text-faint">— {testimonial.name}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
