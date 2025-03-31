/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
    // Only run ESLint on the 'src' directory during production builds
    dirs: ['src'],
  },
};

module.exports = nextConfig;
