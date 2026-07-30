'use client';

import { useEffect } from 'react';

/**
 * Signals "the client bundle booted successfully" to the blocking bootstrap
 * script in <body>, which otherwise flags `[data-js-stalled]` after 3.5s and
 * force-reveals all animation-gated content.
 *
 * Kept free of any third-party import on purpose — it must share the fate of
 * the main client chunk, not of a lazily-loaded one.
 */
export function HydrationBeacon() {
  useEffect(() => {
    (window as unknown as { __nzHydrated?: boolean }).__nzHydrated = true;
    // Covers the slow-but-successful case: hydration landed after the timeout.
    document.documentElement.removeAttribute('data-js-stalled');
  }, []);

  return null;
}
