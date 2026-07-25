'use client';

/**
 * Premium CSS-only fallback shown when WebGL is unavailable or the R3F canvas fails.
 * Features: multi-ring orbital system, distorted orb, particle dots, SVG wireframe.
 * Fully GPU-composited (transform/opacity only), safe on all devices.
 */
export function HeroFallback({ reason }: { reason?: string }) {
  return (
    <div className="relative aspect-square w-full max-w-md flex items-center justify-center">

      {/* ── Ambient glow layers ─────────────────────────────────────── */}
      <div className="absolute inset-4 rounded-full bg-neon-purple/20 blur-[80px]" />
      <div className="absolute inset-12 rounded-full bg-neon-blue/15 blur-[60px]" />
      <div
        className="absolute rounded-full bg-neon-magenta/10 blur-[50px]"
        style={{ width: '60%', height: '60%' }}
      />

      {/* ── Outer slow ring ─────────────────────────────────────────── */}
      <div
        className="absolute rounded-full"
        style={{
          width: '90%',
          height: '90%',
          border: '1px solid rgba(79,142,247,0.25)',
          boxShadow: '0 0 20px rgba(79,142,247,0.2), inset 0 0 20px rgba(79,142,247,0.05)',
          animation: 'hero-ring-spin 22s linear infinite reverse',
          transform: 'rotateX(72deg)',
        }}
      />

      {/* ── Primary magenta ring ─────────────────────────────────────── */}
      <div
        className="absolute rounded-full"
        style={{
          width: '78%',
          height: '78%',
          border: '1.5px solid rgba(224,64,251,0.6)',
          boxShadow: '0 0 24px rgba(224,64,251,0.4), inset 0 0 16px rgba(224,64,251,0.1)',
          animation: 'hero-ring-spin 9s linear infinite',
          transform: 'rotateX(68deg)',
        }}
      />

      {/* ── Secondary purple ring ────────────────────────────────────── */}
      <div
        className="absolute rounded-full"
        style={{
          width: '62%',
          height: '62%',
          border: '1px solid rgba(155,109,255,0.5)',
          boxShadow: '0 0 16px rgba(155,109,255,0.3)',
          animation: 'hero-ring-spin 14s linear infinite reverse',
          transform: 'rotateX(68deg) rotateY(20deg)',
        }}
      />

      {/* ── Inner cyan ring ──────────────────────────────────────────── */}
      <div
        className="absolute rounded-full"
        style={{
          width: '46%',
          height: '46%',
          border: '1px solid rgba(0,229,255,0.35)',
          boxShadow: '0 0 12px rgba(0,229,255,0.25)',
          animation: 'hero-ring-spin 7s linear infinite',
          transform: 'rotateX(50deg) rotateZ(30deg)',
        }}
      />

      {/* ── Particle dots ────────────────────────────────────────────── */}
      {[
        { top: '12%', left: '20%', color: '#9b6dff', size: 4, delay: '0s' },
        { top: '18%', right: '15%', color: '#4f8ef7', size: 3, delay: '0.5s' },
        { bottom: '20%', left: '12%', color: '#e040fb', size: 5, delay: '1s' },
        { bottom: '15%', right: '20%', color: '#00e5ff', size: 3, delay: '1.5s' },
        { top: '45%', left: '5%', color: '#9b6dff', size: 3, delay: '0.8s' },
        { top: '40%', right: '6%', color: '#4f8ef7', size: 4, delay: '0.3s' },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            top: p.top,
            left: (p as { left?: string }).left,
            right: (p as { right?: string }).right,
            bottom: (p as { bottom?: string }).bottom,
            animation: `hero-orb-float ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* ── Core orb ─────────────────────────────────────────────────── */}
      <div
        className="relative h-40 w-40 rounded-full sm:h-48 sm:w-48"
        style={{
          background:
            'radial-gradient(ellipse at 32% 28%, #c4b5fd 0%, #9b6dff 30%, #4f8ef7 60%, #0c0d22 100%)',
          boxShadow:
            '0 0 50px rgba(155,109,255,0.6), 0 0 100px rgba(155,109,255,0.2), 0 0 160px rgba(79,142,247,0.1)',
          animation: 'hero-orb-float 4s ease-in-out infinite',
        }}
      >
        {/* SVG wireframe overlay */}
        <svg
          viewBox="0 0 160 160"
          className="absolute inset-0 h-full w-full"
          fill="none"
          style={{ opacity: 0.22 }}
        >
          <ellipse cx="80" cy="80" rx="78" ry="78" stroke="white" strokeWidth="0.5" />
          <ellipse cx="80" cy="80" rx="78" ry="30" stroke="white" strokeWidth="0.5" />
          <ellipse cx="80" cy="80" rx="30" ry="78" stroke="white" strokeWidth="0.5" />
          <line x1="18" y1="42" x2="142" y2="118" stroke="#c4b5fd" strokeWidth="0.5" />
          <line x1="142" y1="42" x2="18" y2="118" stroke="#93c5fd" strokeWidth="0.5" />
          <line x1="80" y1="4"  x2="80" y2="156" stroke="white"   strokeWidth="0.4" />
          <line x1="4"  y1="80" x2="156" y2="80" stroke="white"   strokeWidth="0.4" />
          <polygon points="80,10 148,58 124,140 36,140 12,58" stroke="#e9d5ff" strokeWidth="0.5" />
          <polygon points="80,150 12,102 36,20 124,20 148,102" stroke="#bfdbfe" strokeWidth="0.5" />
          <polygon points="80,30 130,65 110,120 50,120 30,65" stroke="#d8b4fe" strokeWidth="0.4" />
        </svg>

        {/* Specular highlight */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at 28% 22%, rgba(255,255,255,0.22), transparent 55%)',
          }}
        />

        {/* Inner glow pulse */}
        <div
          className="absolute inset-4 rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(155,109,255,0.4), transparent 70%)',
            animation: 'pulse-glow 3s ease-in-out infinite',
          }}
        />
      </div>

      {/* Dev/error label */}
      {reason && (
        <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-slate-500">
          3D unavailable — {reason}
        </p>
      )}
    </div>
  );
}
