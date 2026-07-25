'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Icosahedron, OrbitControls, Torus, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  tier: 'high' | 'low';
}

/* ── Particle field ─────────────────────────────────────────────────────── */
function ParticleField({ count = 120 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#9b6dff'),
      new THREE.Color('#4f8ef7'),
      new THREE.Color('#e040fb'),
      new THREE.Color('#00e5ff'),
    ];
    for (let i = 0; i < count; i++) {
      const r = 2.5 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.06;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors sizeAttenuation transparent opacity={0.85} />
    </points>
  );
}

/* ── Orbiting ring ──────────────────────────────────────────────────────── */
function OrbitRing({ radius, speed, color, tilt = 0 }: { radius: number; speed: number; color: string; tilt?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2 + tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.012, 16, 120]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} transparent opacity={0.7} />
    </mesh>
  );
}

/* ── Core orb ───────────────────────────────────────────────────────────── */
function CoreOrb({ tier }: { tier: 'high' | 'low' }) {
  const detail = tier === 'high' ? 4 : 2;
  return (
    <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.2}>
      <Icosahedron args={[1.25, detail]}>
        {tier === 'high' ? (
          <MeshDistortMaterial
            color="#9b6dff"
            emissive="#4f8ef7"
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.9}
            distort={0.25}
            speed={2}
          />
        ) : (
          <meshStandardMaterial
            color="#9b6dff"
            emissive="#4f8ef7"
            emissiveIntensity={0.4}
            roughness={0.2}
            metalness={0.8}
            wireframe
          />
        )}
      </Icosahedron>
    </Float>
  );
}

/* ── Scene ──────────────────────────────────────────────────────────────── */
export function HeroScene({ tier }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 42 }}
      dpr={tier === 'high' ? [1, 2] : 1}
      gl={{ antialias: tier === 'high', alpha: true }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]}   intensity={5}   color="#9b6dff" />
      <pointLight position={[-4, -3, 3]} intensity={3}   color="#4f8ef7" />
      <pointLight position={[0, -4, -2]} intensity={2}   color="#e040fb" />
      <pointLight position={[3, 0, -3]}  intensity={1.5} color="#00e5ff" />

      {/* Background stars (high tier only) */}
      {tier === 'high' && (
        <Stars radius={12} depth={6} count={600} factor={2} saturation={0.8} fade speed={0.5} />
      )}

      {/* Particle field */}
      <ParticleField count={tier === 'high' ? 160 : 60} />

      {/* Orbiting rings */}
      <OrbitRing radius={2.1} speed={0.4}  color="#e040fb" tilt={0} />
      <OrbitRing radius={2.5} speed={-0.25} color="#4f8ef7" tilt={0.6} />
      {tier === 'high' && (
        <OrbitRing radius={1.8} speed={0.6} color="#9b6dff" tilt={-0.4} />
      )}

      {/* Core orb */}
      <CoreOrb tier={tier} />

      {/* Outer equatorial torus */}
      <Torus args={[2.8, 0.018, 16, tier === 'high' ? 120 : 50]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.8} transparent opacity={0.4} />
      </Torus>

      {tier === 'high' && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI * 0.65}
          minPolarAngle={Math.PI * 0.35}
        />
      )}
    </Canvas>
  );
}
