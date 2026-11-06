import Link from 'next/link';
import { Reveal } from '@/components/kobo/Reveal';

export function AdvertiserCtaSection() {
  return (
    <section className="px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 rounded-pd-xl bg-pd-text px-9 py-12 sm:flex-row sm:items-center sm:px-14 sm:py-16">
            <div>
              <h3 className="max-w-[420px] font-pd-display text-[26px] font-semibold text-surface sm:text-[30px]">
                Need real engagement on your page or channel?
              </h3>
              <p className="mt-3 max-w-[420px] text-[15px] text-surface/70">
                Post a task in minutes, set your commission, and watch verified engagement roll
                in from real users.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-surface px-6 py-3 text-[15px] font-medium text-pd-text transition-transform hover:scale-[1.02]"
            >
              Post a task
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
