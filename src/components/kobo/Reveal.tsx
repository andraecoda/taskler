'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Scroll-triggered fade/slide-up, matching the landing reference's `.reveal` treatment.
 * Renders fully visible up front under prefers-reduced-motion, per §4's accessibility requirement.
 */
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const shown = reducedMotion || visible;

  return (
    <div
      ref={ref}
      className={`transition-all duration-600 ease-out motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-[22px] opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}
