'use client';

import { useEffect, useRef } from 'react';

/**
 * Thin gradient progress bar fixed at the very top of the viewport.
 * Uses requestAnimationFrame + CSS custom property for smooth, jank-free updates.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const update = () => {
      const el = barRef.current;
      if (!el) return;
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? scrolled / total : 0;
      el.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-[2px] w-full origin-left"
      style={{
        background: 'linear-gradient(90deg, #4f8ef7, #9b6dff, #e040fb)',
        transform: 'scaleX(0)',
      }}
      ref={barRef}
    />
  );
}
