'use client';

/**
 * CSS-only fallback shown when WebGL is unavailable or the R3F canvas fails.
 * Visually matches the icosahedron + torus ring intent — animated gradient orb
 * with wireframe-style facet lines and a rotating orbital ring.
 * Fully GPU-composited (transform/opacity only), safe on all devices.
 */
export function HeroFallback({ reason }: { reason?: string }) {
  return (
    <div className="relative aspect-square w-full max-w-md flex items-center justify-center">
      {/* Ambient glow blob */}
      <div className="absolute inset-8 rounded-full bg-neon-gradient opacity-25 blur-3xl" />

      {/* Orbital torus ring */}
      <div
        className="absolute rounded-full border border-neon-magenta/70"
        style={{
          width: '78%',
          height: '78%',
          boxShadow:
            '0 0 18px rgba(217,70,239,0.45), inset 0 0 18px rgba(217,70,239,0.12)',
          animation: 'hero-ring-spin 9s linear infinite',
          transform: 'rotateX(68deg)',
        }}
      />

      {/* Secondary inner ring */}
      <div
        className="absolute rounded-full border border-neon-blue/40"
        style={{
          width: '55%',
          height: '55%',
          boxShadow: '0 0 12px rgba(59,130,246,0.3)',
          animation: 'hero-ring-spin 14s linear infinite reverse',
          transform: 'rotateX(68deg)',
        }}
      />

      {/* Core orb */}
      <div
        className="relative h-40 w-40 rounded-full sm:h-48 sm:w-48"
        style={{
          background:
            'radial-gradient(ellipse at 35% 30%, #c4b5fd 0%, #8b5cf6 35%, #3b82f6 65%, #1e1b4b 100%)',
          boxShadow:
            '0 0 60px rgba(139,92,246,0.55), 0 0 120px rgba(139,92,246,0.18)',
          animation: 'hero-orb-float 4s ease-in-out infinite',
        }}
      >
        {/* Wireframe facet overlay — SVG icosahedron silhouette */}
        <svg
          viewBox="0 0 160 160"
          className="absolute inset-0 h-full w-full"
          fill="none"
          style={{ opacity: 0.28 }}
        >
          {/* Great circles */}
          <ellipse cx="80" cy="80" rx="78" ry="78" stroke="white" strokeWidth="0.6" />
          <ellipse cx="80" cy="80" rx="78" ry="32" stroke="white" strokeWidth="0.6" />
          <ellipse cx="80" cy="80" rx="32" ry="78" stroke="white" strokeWidth="0.6" />
          {/* Icosahedron-like diagonals */}
          <line x1="18" y1="42" x2="142" y2="118" stroke="#c4b5fd" strokeWidth="0.6" />
          <line x1="142" y1="42" x2="18" y2="118" stroke="#93c5fd" strokeWidth="0.6" />
          <line x1="80" y1="4"  x2="80" y2="156" stroke="white"   strokeWidth="0.5" />
          <line x1="4"  y1="80" x2="156" y2="80" stroke="white"   strokeWidth="0.5" />
          <polygon
            points="80,10 148,58 124,140 36,140 12,58"
            stroke="#e9d5ff"
            strokeWidth="0.6"
          />
          <polygon
            points="80,150 12,102 36,20 124,20 148,102"
            stroke="#bfdbfe"
            strokeWidth="0.6"
          />
        </svg>

        {/* Specular highlight */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.18), transparent 58%)',
          }}
        />
      </div>

      {/* Dev/error label — only visible if a reason is passed */}
      {reason && (
        <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-slate-500">
          3D unavailable — {reason}
        </p>
      )}
    </div>
  );
}
