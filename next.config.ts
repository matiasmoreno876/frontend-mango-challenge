import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Dev only: log each server-side fetch (e.g. the mock API calls) with its full URL.
  logging: { fetches: { fullUrl: true } },
};

export default nextConfig;
