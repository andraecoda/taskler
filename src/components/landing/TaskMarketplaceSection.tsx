import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/kobo/Reveal';
import { SectionHeading } from '@/components/premium/SectionHeading';
import { PremiumTaskCard } from '@/components/premium/TaskCard';
import { LANDING_TASK_PREVIEW } from '@/features/kobo/constants';

export function TaskMarketplaceSection() {
  return (
    <section id="tasks" className="px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Reveal>
          <SectionHeading
            eyebrow="Open right now"
            title="Every task, priced up front."
            description="A live sample of what's available today. New tasks are added by advertisers around the clock."
          />
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LANDING_TASK_PREVIEW.map((task) => (
              <PremiumTaskCard
                key={task.label}
                icon={task.icon}
                label={task.label}
                platform={task.platform}
                price={task.price}
                hoverLift
                footer={
                  <div className="flex items-center justify-between text-[13.5px] font-semibold text-pd-text">
                    Start task <ArrowRight className="h-4 w-4" aria-hidden />
                  </div>
                }
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
