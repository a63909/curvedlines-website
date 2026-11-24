import type { NextConfig } from "next";

const repoRoot = process.cwd();

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: repoRoot,
  turbopack: {
    root: repoRoot,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
