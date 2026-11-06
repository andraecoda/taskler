'use client';

import { Banknote, CheckCircle2, ListChecks, Pause, Play, Wallet, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Reveal } from '@/components/kobo/Reveal';
import { Eyebrow } from '@/components/premium/SectionHeading';
import { useReducedMotion } from '@/lib/use-reduced-motion';

const SCENE_DURATION_MS = 4500;

interface Scene {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
}

const SCENES: Scene[] = [
  {
    icon: ListChecks,
    eyebrow: 'Step 1',
    title: 'Pick a task',
    description: 'Browse open requests from real brands and creators. Every task shows its payout up front.',
  },
  {
    icon: CheckCircle2,
    eyebrow: 'Step 2',
    title: 'Complete it in seconds',
    description: 'Like, follow, subscribe, or comment — most tasks take under 30 seconds to finish.',
  },
  {
    icon: Wallet,
    eyebrow: 'Step 3',
    title: 'Get paid instantly',
    description: 'Your commission lands in your CleekTap wallet the moment the task is verified — no waiting.',
  },
  {
    icon: Banknote,
    eyebrow: 'Step 4',
    title: 'Withdraw or redeem',
    description: 'Cash out to your bank every two weeks, or redeem your balance for real products in the bonus store.',
  },
];

/**
 * A "watch how it works" explainer in place of an actual video — an autoplaying, pausable
 * scene walkthrough with a story-style segmented progress bar. Advancing is driven by the
 * progress bar's own CSS animation firing `animationend`, so play/pause and timing stay in sync
 * for free (a paused CSS animation never fires the event). Fully static under
 * prefers-reduced-motion, per the site's existing Reveal/CountUp convention.
 */
export function ExplainerWalkthrough() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reducedMotion = useReducedMotion();
  const canAutoplay = !reducedMotion;

  const advance = () => setActiveIndex((index) => (index + 1) % SCENES.length);
  const scene = SCENES[activeIndex];

  return (
    <Reveal>
      <div className="mx-auto max-w-[820px] overflow-hidden rounded-pd-xl border border-hairline bg-surface shadow-[0_40px_80px_-30px_rgba(0,0,0,.2)]">
        <div className="flex items-center gap-2 px-6 pt-6 sm:px-8">
          {SCENES.map((item, index) => {
            const isDone = index < activeIndex || (!canAutoplay && index === activeIndex);
            const isActive = canAutoplay && index === activeIndex;
            return (
              <div key={item.title} className="h-[3px] flex-1 overflow-hidden rounded-full bg-hairline">
                {isDone && <div className="h-full w-full rounded-full bg-pd-accent" />}
                {isActive && (
                  <div
                    key={activeIndex}
                    onAnimationEnd={advance}
                    className="h-full rounded-full bg-pd-accent"
                    style={{
                      animation: `kobo-progress-fill ${SCENE_DURATION_MS}ms linear forwards`,
                      animationPlayState: playing ? 'running' : 'paused',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <Eyebrow>{scene.eyebrow}</Eyebrow>
            <h3 className="mt-3 font-pd-display text-[24px] font-semibold text-pd-text sm:text-[28px]">
              {scene.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-pd-text-muted">{scene.description}</p>

            <div className="mt-6 flex items-center gap-3">
              {canAutoplay && (
                <button
                  type="button"
                  onClick={() => setPlaying((prev) => !prev)}
                  aria-label={playing ? 'Pause' : 'Play'}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline text-pd-text-muted transition-colors hover:bg-surface-2 hover:text-pd-text"
                >
                  {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
                </button>
              )}
              <div className="flex items-center gap-1.5">
                {SCENES.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Go to step ${index + 1}: ${item.title}`}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === activeIndex ? 'bg-pd-accent' : 'bg-hairline-strong'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div
              aria-hidden
              className="absolute -inset-10 -z-10 rounded-full bg-gradient-to-br from-pd-accent/[.14] via-pd-gold/[.08] to-transparent blur-3xl"
            />
            <div className="flex h-[220px] w-full max-w-[320px] flex-col items-center justify-center gap-4 rounded-pd-lg border border-hairline bg-surface-2 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pd-accent-soft text-pd-accent">
                <scene.icon className="h-7 w-7" aria-hidden />
              </div>
              <div className="text-[13.5px] font-medium text-pd-text-muted">{scene.title}</div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
