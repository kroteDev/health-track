import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: process.env.STANDALONE === 'true' ? 'standalone' : undefined,
  reactStrictMode: true,
};

export default nextConfig;
