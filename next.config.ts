import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for the `'use cache'` + `cacheLife()` data layer in
  // lib/defillama.ts (plan/04-mock-data-and-state.md §4.2).
  cacheComponents: true,
};

export default nextConfig;
