'use client';

import dynamic from 'next/dynamic';
import { Component, type ReactNode } from 'react';
import { useState } from 'react';
import { useDeviceCapability } from '@/lib/use-device-capability';
import { HeroFallback } from './hero-fallback';

// Lazy-load the 3D scene (no SSR) so it never blocks first paint.
const HeroScene = dynamic(
  () => import('@/components/three/hero-scene').then((m) => m.HeroScene),
  { ssr: false, loading: () => <HeroFallback /> }
);

/** Probe for a real WebGL context. Returns false in sandboxed/headless envs. */
function webGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
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
    if (this.state.error) {
      return <HeroFallback reason={this.state.error.slice(0, 60)} />;
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------
/** Progressive-enhancement wrapper: only mounts R3F when the device can handle it. */
export function AdaptiveThree() {
  const tier = useDeviceCapability();

  // Probe on first client render — lazy init runs once, no effect needed.
  const [hasWebGL] = useState<boolean>(() => webGLAvailable());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // No WebGL or already errored → go straight to CSS fallback.
  if (!hasWebGL || errorMsg) {
    return <HeroFallback reason={errorMsg ?? 'WebGL unavailable'} />;
  }

  return (
    <CanvasErrorBoundary onError={setErrorMsg}>
      <div className="relative aspect-square w-full max-w-md">
        {/* Gradient glow (always visible, sole visual on reduced-motion) */}
        <div className="absolute inset-8 rounded-full bg-neon-gradient opacity-30 blur-3xl" />
        <HeroScene tier={tier} />
      </div>
    </CanvasErrorBoundary>
  );
}
