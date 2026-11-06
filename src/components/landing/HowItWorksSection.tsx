import { Reveal } from '@/components/kobo/Reveal';
import { SectionHeading } from '@/components/premium/SectionHeading';

const STEPS = [
  {
    num: '01',
    title: 'Pick a task',
    description: 'Browse open requests from real brands and creators — filter by platform, action, or payout.',
  },
  {
    num: '02',
    title: 'Complete it',
    description: 'Like, follow, subscribe, or comment. Most tasks take under 30 seconds to finish.',
  },
  {
    num: '03',
    title: 'Get paid',
    description: 'Your commission lands in your CleekTap wallet the moment the task is verified.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how" className="px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Reveal>
          <SectionHeading
            eyebrow="The process"
            title="Three steps between you and a payout."
            description="No applications, no waiting rooms. Every task on CleekTap pays a fixed commission, shown up front, before you lift a finger."
          />
        </Reveal>
        <Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.num} className="rounded-pd-lg border border-hairline bg-surface-2 p-8">
                <span className="text-[13px] font-semibold tracking-[.08em] text-pd-accent">{step.num}</span>
                <h3 className="my-4 font-pd-display text-[20px] font-semibold text-pd-text">{step.title}</h3>
                <p className="text-[15px] leading-relaxed text-pd-text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
