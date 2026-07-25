/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  // Allow Replit preview proxy origins
  allowedDevOrigins: ['*.replit.dev', '*.sisko.replit.dev', '*.repl.co', '127.0.0.1'],
};

export default nextConfig;
