/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
    // Only run ESLint on the 'src' directory during production builds
    dirs: ['src'],
  },
  // Allow cross-origin requests during development
  allowedDevOrigins: process.env.NEXT_PUBLIC_ALLOWED_ORIGINS
    ? process.env.NEXT_PUBLIC_ALLOWED_ORIGINS.split(',')
    : ['http://localhost', 'https://localhost'],
};

module.exports = nextConfig;
