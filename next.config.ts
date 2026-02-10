import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  experimental: {
    // @ts-expect-error: outputFileTracingIncludes is a valid option for Vercel but missing in types
    outputFileTracingIncludes: {
      '/api-docs': ['./src/app/api/**/*'],
    },
  },
};

export default nextConfig;