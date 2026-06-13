import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Disable telemetry in production
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
