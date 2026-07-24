'use client';

import { Canvas } from '@react-three/fiber';
import { Float, Icosahedron, OrbitControls, Torus } from '@react-three/drei';

interface Props {
  tier: 'high' | 'low';
}

/**
 * Rotating AI orb with a holographic ring beneath it.
 * Geometry detail + effects scale down on low-tier (mobile / low-core) devices.
 */
export function HeroScene({ tier }: Props) {
  const detail = tier === 'high' ? 4 : 1;

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={tier === 'high' ? [1, 2] : 1}
      gl={{ antialias: tier === 'high' }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#8b5cf6" />
      <pointLight position={[-5, -3, 2]} intensity={1.5} color="#3b82f6" />

      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <Icosahedron args={[1.3, detail]}>
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#3b82f6"
            emissiveIntensity={0.4}
            roughness={0.2}
            metalness={0.8}
            wireframe={tier === 'low'}
          />
        </Icosahedron>
      </Float>

      <Torus args={[2.2, 0.03, 16, tier === 'high' ? 100 : 40]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#d946ef" emissive="#d946ef" emissiveIntensity={0.6} />
      </Torus>

      {tier === 'high' && (
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      )}
    </Canvas>
  );
}
