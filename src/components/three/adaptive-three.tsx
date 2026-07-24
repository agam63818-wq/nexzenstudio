'use client';

import dynamic from 'next/dynamic';
import { useDeviceCapability } from '@/lib/use-device-capability';

// Lazy-load the 3D scene (no SSR) so it never blocks first paint.
const HeroScene = dynamic(
  () => import('@/components/three/hero-scene').then((m) => m.HeroScene),
  { ssr: false }
);

/** Progressive-enhancement wrapper: only mounts R3F when the device can handle it. */
export function AdaptiveThree() {
  const tier = useDeviceCapability();

  return (
    <div className="relative aspect-square w-full max-w-md">
      {/* Gradient glow fallback (always visible, sole visual on reduced-motion) */}
      <div className="absolute inset-8 rounded-full bg-neon-gradient opacity-30 blur-3xl" />
      <HeroScene tier={tier} />
    </div>
  );
}
