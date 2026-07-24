/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  // Allow Replit proxy host
  allowedDevHosts: ['.replit.dev', '.repl.co'],
};

export default nextConfig;
