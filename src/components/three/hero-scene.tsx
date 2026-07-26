'use client';

/*
 * React-Three-Fiber scene. Several rules from the React-19 lint preset
 * (`react-hooks/purity`, `react-hooks/refs`) produce false positives here:
 *   - `Math.random()` inside `useMemo`/`useState` initialisers builds the
 *     one-time geometry buffers (deterministic per mount).
 *   - `useFrame` callbacks intentionally mutate Three.js objects every frame;
 *     that IS the "synchronise an external system" pattern the rules allow,
 *     but the static analyser can't see through the R3F render loop.
 * These are the idiomatic R3F patterns, so the affected rules are disabled
 * for this file only.
 */
/* eslint-disable react-hooks/purity, react-hooks/refs, react-hooks/immutability */

import { useRef, useMemo, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  tier: 'high' | 'low';
  /** Normalised pointer position, -1..1 on each axis. */
  pointer: { x: number; y: number };
}

const PALETTE = [
  new THREE.Color('#9b6dff'),
  new THREE.Color('#4f8ef7'),
  new THREE.Color('#e040fb'),
  new THREE.Color('#00e5ff'),
];

/* ── Lightweight Float (bobbing + rotating group) — replaces drei <Float> ─ */
function Float({
  children,
  speed = 1,
  rotationIntensity = 1,
  floatIntensity = 1,
  position = [0, 0, 0],
}: {
  children: ReactNode;
  speed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
  position?: [number, number, number];
}) {
  const ref = useRef<THREE.Group>(null);
  // Lazily initialise a stable random seed once (pure during render).
  const seedRef = useRef<number | null>(null);
  if (seedRef.current === null) seedRef.current = Math.random() * 1000;
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + seedRef.current!;
    ref.current.position.y = position[1] + Math.sin(t) * 0.12 * floatIntensity;
    ref.current.rotation.x = Math.cos(t / 2) * 0.12 * rotationIntensity;
    ref.current.rotation.y = Math.sin(t / 3) * 0.16 * rotationIntensity;
    ref.current.rotation.z = Math.sin(t / 4) * 0.08 * rotationIntensity;
  });
  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}

/* ── Glowing AI energy core (animated distort via vertex noise) ─────────── */
function EnergyCore({ tier }: { tier: 'high' | 'low' }) {
  const detail = tier === 'high' ? 5 : 3;
  const coreRef = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);

  // Keep the original positions so we can displace each frame.
  const geo = useMemo(() => new THREE.IcosahedronGeometry(0.95, detail), [detail]);
  const base = useMemo(() => geo.attributes.position.array.slice(0) as Float32Array, [geo]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current && tier === 'high') {
      const pos = geo.attributes.position;
      const amp = 0.14;
      for (let i = 0; i < pos.count; i++) {
        const ix = i * 3;
        const x = base[ix];
        const y = base[ix + 1];
        const z = base[ix + 2];
        const n =
          Math.sin(x * 3 + t * 1.6) * Math.cos(y * 3 + t * 1.2) * Math.sin(z * 3 + t);
        const scale = 1 + n * amp;
        pos.setXYZ(i, x * scale, y * scale, z * scale);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    }
    if (shell.current) {
      shell.current.rotation.y += 0.003;
      shell.current.rotation.x += 0.001;
    }
  });

  return (
    <group position={[0, 0.1, -2.4]} scale={0.85}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.9}>
        <mesh ref={coreRef} geometry={geo}>
          <meshStandardMaterial
            color="#7c4dff"
            emissive="#4f8ef7"
            emissiveIntensity={1.4}
            roughness={0.15}
            metalness={0.7}
          />
        </mesh>
      </Float>

      {/* Wireframe energy shell */}
      <mesh ref={shell} scale={1.5}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshBasicMaterial color="#9b6dff" wireframe transparent opacity={0.22} />
      </mesh>

      {/* Soft glow sphere */}
      <mesh scale={3.0}>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshBasicMaterial color="#6a3df0" transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

/* ── Rotating holographic ring ──────────────────────────────────────────── */
function HoloRing({
  radius,
  thickness,
  speed,
  color,
  rotation,
}: {
  radius: number;
  thickness: number;
  speed: number;
  color: string;
  rotation: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });
  return (
    <mesh ref={ref} rotation={rotation} position={[0, -0.15, -1.1]}>
      <torusGeometry args={[radius, thickness, 16, 160]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.4}
        transparent
        opacity={0.75}
      />
    </mesh>
  );
}

/* ── Spherical particle field ───────────────────────────────────────────── */
function ParticleField({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.random() * 3.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 1;
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
      ref.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors sizeAttenuation transparent opacity={0.9} />
    </points>
  );
}

/* ── Galaxy starfield (replaces drei <Stars>) ───────────────────────────── */
function Starfield({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 10 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 4;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#cdd6ff" sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}

/* ── Floating glass crystals & cubes ────────────────────────────────────── */
function FloatingShard({
  position,
  scale,
  color,
  kind,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  kind: 'cube' | 'crystal';
}) {
  // Stable initial rotation, generated once per mount.
  const rotRef = useRef<[number, number, number] | null>(null);
  if (rotRef.current === null) {
    rotRef.current = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];
  }
  return (
    <Float speed={2} rotationIntensity={1.4} floatIntensity={1.6} position={position}>
      <mesh scale={scale} rotation={rotRef.current}>
        {kind === 'cube' ? (
          <boxGeometry args={[1, 1, 1]} />
        ) : (
          <octahedronGeometry args={[0.8, 0]} />
        )}
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          roughness={0.05}
          metalness={0.2}
          transmission={0.9}
          thickness={0.6}
          transparent
          opacity={0.55}
          ior={1.4}
        />
      </mesh>
    </Float>
  );
}

/* ── Holographic platform (glowing base disc) ───────────────────────────── */
function Platform() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.12;
  });
  return (
    <group position={[0, -1.85, -0.6]} rotation={[Math.PI / 2.15, 0, 0]}>
      <mesh ref={ref}>
        <torusGeometry args={[1.7, 0.02, 12, 120]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.6} transparent opacity={0.8} />
      </mesh>
      <mesh>
        <circleGeometry args={[1.65, 64]} />
        <meshBasicMaterial color="#1b2a6b" transparent opacity={0.32} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <ringGeometry args={[1.0, 1.45, 64]} />
        <meshBasicMaterial color="#4f8ef7" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ── Camera parallax rig ────────────────────────────────────────────────── */
function ParallaxRig({ pointer }: { pointer: { x: number; y: number } }) {
  const { camera } = useThree();
  useFrame(() => {
    const targetX = pointer.x * 0.6;
    const targetY = pointer.y * 0.4;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, -0.15, -1);
  });
  return null;
}

/* ── Scene ──────────────────────────────────────────────────────────────── */
export function HeroScene({ tier, pointer }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      dpr={tier === 'high' ? [1, 2] : 1}
      gl={{ antialias: tier === 'high', alpha: true, powerPreference: 'high-performance' }}
    >
      {/* Lighting — blue rim + purple ambient */}
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 4]} intensity={6} color="#9b6dff" />
      <pointLight position={[-4, -2, 3]} intensity={4} color="#4f8ef7" />
      <pointLight position={[0, -3, -2]} intensity={3} color="#e040fb" />
      <pointLight position={[3, 2, -4]} intensity={2} color="#00e5ff" />

      <Starfield count={tier === 'high' ? 900 : 350} />
      <ParticleField count={tier === 'high' ? 220 : 70} />

      {/* Rotating holographic rings behind the portrait */}
      <HoloRing radius={2.15} thickness={0.014} speed={0.35} color="#e040fb" rotation={[Math.PI / 2, 0, 0]} />
      <HoloRing radius={2.55} thickness={0.012} speed={-0.22} color="#4f8ef7" rotation={[Math.PI / 2 + 0.55, 0, 0]} />
      {tier === 'high' && (
        <HoloRing radius={1.8} thickness={0.016} speed={0.5} color="#9b6dff" rotation={[Math.PI / 2 - 0.4, 0.3, 0]} />
      )}

      <EnergyCore tier={tier} />
      <Platform />

      {/* Floating 3D objects for cinematic depth */}
      {tier === 'high' && (
        <>
          <FloatingShard position={[-2.6, 1.4, -0.5]} scale={0.34} color="#4f8ef7" kind="cube" />
          <FloatingShard position={[2.7, 1.1, -0.8]} scale={0.4} color="#9b6dff" kind="crystal" />
          <FloatingShard position={[2.4, -1.4, 0.2]} scale={0.28} color="#00e5ff" kind="cube" />
          <FloatingShard position={[-2.5, -1.2, -0.3]} scale={0.32} color="#e040fb" kind="crystal" />
          <FloatingShard position={[0.2, 2.2, -1.5]} scale={0.24} color="#00e5ff" kind="cube" />
        </>
      )}

      <ParallaxRig pointer={pointer} />
    </Canvas>
  );
}
