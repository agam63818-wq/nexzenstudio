'use client';

import { useEffect, useState } from 'react';

/**
 * Detects whether the device can comfortably render the full 3D hero.
 * Reduces complexity on small viewports / low CPU-core devices and
 * disables when the user prefers reduced motion.
 */
export function useDeviceCapability() {
  const [tier, setTier] = useState<'high' | 'low'>('low');

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    const wide = window.innerWidth >= 768;
    setTier(!reduce && wide && cores >= 4 ? 'high' : 'low');
  }, []);

  return tier;
}
