/** @type {import('next').NextConfig} */

/**
 * In-app WebViews (Instagram, Facebook, TikTok) ignore normal cache
 * revalidation and happily serve a stale HTML snapshot to repeat visitors —
 * which is how a deployed fix can appear to "not ship" for those users.
 *
 * These headers apply to HTML documents ONLY. Hashed build output under
 * /_next/static and optimised images under /_next/image keep their long-lived
 * immutable caching, so normal browsers lose no asset-level performance.
 */
const NO_STORE_HEADERS = [
  { key: 'Cache-Control', value: 'no-store, must-revalidate' },
  { key: 'Pragma', value: 'no-cache' },
  { key: 'Expires', value: '0' },
];

const nextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }] },
  // Allow Replit preview proxy origins
  allowedDevOrigins: ['*.replit.dev', '*.sisko.replit.dev', '*.repl.co', '127.0.0.1'],

  async headers() {
    return [
      // Home page.
      { source: '/', headers: NO_STORE_HEADERS },
      // Every other document route, excluding build assets and API routes.
      {
        source: '/:path((?!_next/|api/|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)',
        headers: NO_STORE_HEADERS,
      },
    ];
  },
};

export default nextConfig;
