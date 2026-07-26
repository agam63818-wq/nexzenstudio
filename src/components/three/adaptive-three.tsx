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
// Public component — renders as an absolute-fill background layer.
// ---------------------------------------------------------------------------
type WebGLState = 'pending' | 'available' | 'unavailable';

interface Props {
  /** Normalised pointer position, -1..1 on each axis, for camera parallax. */
  pointer: { x: number; y: number };
}

/**
 * Progressive-enhancement wrapper: only mounts R3F when the device can handle it.
 * SSR + hydration always renders the CSS fallback; after mount it probes WebGL.
 */
export function AdaptiveThree({ pointer }: Props) {
  const tier = useDeviceCapability();
  const [webGL, setWebGL] = useState<WebGLState>('pending');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Probe WebGL only after mount so the SSR/first-client render both show the
    // fallback (avoids a hydration mismatch). setState here is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebGL(webGLAvailable() ? 'available' : 'unavailable');
  }, []);

  if (webGL !== 'available' || errorMsg) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <HeroFallback />
      </div>
    );
  }

  return (
    <CanvasErrorBoundary onError={(msg) => setErrorMsg(msg)}>
      <div className="absolute inset-0">
        <HeroScene tier={tier} pointer={pointer} />
      </div>
    </CanvasErrorBoundary>
  );
}
