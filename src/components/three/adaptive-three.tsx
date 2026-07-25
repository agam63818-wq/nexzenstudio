'use client';

import dynamic from 'next/dynamic';
import { Component, type ReactNode, useState, useEffect } from 'react';
import { useDeviceCapability } from '@/lib/use-device-capability';
import { HeroFallback } from './hero-fallback';

// Lazy-load the 3D scene (no SSR) so it never blocks first paint.
const HeroScene = dynamic(
  () => import('@/components/three/hero-scene').then((m) => m.HeroScene),
  { ssr: false, loading: () => null }
);

/** Probe for a real WebGL context — client-only, never call during SSR. */
function webGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Error boundary — catches WebGLRenderer crashes that R3F re-throws
// ---------------------------------------------------------------------------
interface EBState { error: string | null }
class CanvasErrorBoundary extends Component<
  { children: ReactNode; onError: (msg: string) => void },
  EBState
> {
  state: EBState = { error: null };

  static getDerivedStateFromError(err: Error): EBState {
    return { error: err.message };
  }

  componentDidCatch(err: Error) {
    this.props.onError(err.message);
  }

  render() {
    if (this.state.error) return null; // parent state handles fallback
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------
type WebGLState = 'pending' | 'available' | 'unavailable';

/**
 * Progressive-enhancement wrapper: only mounts R3F when the device can handle it.
 *
 * SSR + hydration pass always renders HeroFallback ('pending').
 * After mount, a useEffect probes WebGL and switches to 'available' or 'unavailable'.
 * This avoids the hydration mismatch that crashes the entire Hero section.
 */
export function AdaptiveThree() {
  const tier = useDeviceCapability();
  const [webGL, setWebGL] = useState<WebGLState>('pending');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Runs only on the client, after hydration — safe to probe WebGL here.
    setWebGL(webGLAvailable() ? 'available' : 'unavailable');
  }, []);

  // Pending (SSR + first client frame) → show fallback so server/client match.
  // Unavailable or errored → show fallback permanently.
  if (webGL !== 'available' || errorMsg) {
    return <HeroFallback />;
  }

  return (
    <CanvasErrorBoundary onError={(msg) => setErrorMsg(msg)}>
      <div className="relative aspect-square w-full max-w-md">
        {/* Gradient glow (always visible, sole visual on reduced-motion) */}
        <div className="absolute inset-8 rounded-full bg-neon-gradient opacity-30 blur-3xl" />
        <HeroScene tier={tier} />
      </div>
    </CanvasErrorBoundary>
  );
}
