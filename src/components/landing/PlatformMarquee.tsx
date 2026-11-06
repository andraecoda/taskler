import { PLATFORM_MARQUEE } from '@/features/kobo/constants';

export function PlatformMarquee() {
  return (
    <div className="border-y border-hairline bg-surface-2 py-5">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-center gap-x-10 gap-y-2 px-6 text-[13px] font-medium text-pd-text-faint sm:px-8">
        {PLATFORM_MARQUEE.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  );
}
