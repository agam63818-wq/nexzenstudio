import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'NexZen Studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Branded default OpenGraph image for Instagram bio-link preview cards. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #05060f 0%, #0a0b1e 100%)',
          color: 'white',
          fontSize: 72,
          fontWeight: 800,
        }}
      >
        <div style={{ display: 'flex', gap: 16 }}>
          <span>Build.</span>
          <span>Create.</span>
          <span style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6,#d946ef)', backgroundClip: 'text', color: 'transparent' }}>Inspire.</span>
        </div>
        <div style={{ marginTop: 24, fontSize: 32, fontWeight: 500, color: '#94a3b8' }}>NexZen Studio</div>
      </div>
    ),
    { ...size }
  );
}
