/** @type {import('next').NextConfig} */

/**
 * In-app WebViews (Instagram, Facebook, TikTok) ignore normal cache
 * revalidation and happily serve a stale HTML snapshot to repeat visitors —
 * which is how a deployed fix can appear to "not ship" for those users.
 *
 * These headers apply to HTML documents ONLY.
 *
 * Excluded, so they keep normal (revalidatable) caching:
 *   - /_next/* build output and optimised images,
 *   - /api/* routes,
 *   - anything ending in a known asset extension, which covers every file
 *     served straight out of /public (images, fonts, webmanifest, robots.txt,
 *     sitemap.xml, ...).
 *
 * That last exclusion matters: `no-store` forbids even conditional
 * revalidation, so without it a request for /hero/portrait.webp would
 * re-download the full image on every single page view — verified against a
 * live response, which is how this was caught.
 *
 * The extension list is explicit rather than a generic `\.[a-z]{2,5}$`
 * heuristic: a heuristic both misses long extensions (.webmanifest) and risks
 * misclassifying a legitimate content slug that happens to contain a dot.
 */
const NO_STORE_HEADERS = [
  { key: 'Cache-Control', value: 'no-store, must-revalidate' },
  { key: 'Pragma', value: 'no-cache' },
  { key: 'Expires', value: '0' },
];

const ASSET_EXT =
  'js|mjs|cjs|css|map|png|jpe?g|webp|avif|gif|svg|ico|bmp|woff2?|ttf|otf|eot|' +
  'mp4|webm|ogg|mp3|wav|pdf|txt|xml|json|webmanifest|zip|csv';

const nextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }] },
  // Allow Replit preview proxy origins
  allowedDevOrigins: ['*.replit.dev', '*.sisko.replit.dev', '*.repl.co', '127.0.0.1'],

  async headers() {
    return [
      // Home page.
      { source: '/', headers: NO_STORE_HEADERS },
      // Every other document route: not /_next/*, not /api/*, not an asset.
      {
        source: `/:path((?!_next/|api/)(?!.*\\.(?:${ASSET_EXT})$).*)`,
        headers: NO_STORE_HEADERS,
      },
    ];
  },
};

export default nextConfig;
