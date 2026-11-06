import { CountUp } from '@/components/kobo/CountUp';
import { Reveal } from '@/components/kobo/Reveal';
import { TRUST_STATS } from '@/features/kobo/constants';

export function StatsBandSection() {
  return (
    <div className="border-y border-hairline bg-surface-2">
      <div className="mx-auto max-w-[1120px] px-6 py-20 sm:px-8">
        <Reveal>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label}>
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  className="font-pd-display text-[36px] font-semibold tracking-[-.02em] text-pd-text sm:text-[44px] lg:text-[52px]"
                />
                <div className="mt-2 text-[14px] text-pd-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
