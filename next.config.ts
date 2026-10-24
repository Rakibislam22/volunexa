import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    // Force worker threads for Turbopack loader execution on Windows
    turbopackPluginRuntimeStrategy: "workerThreads",
  } as any,
};

export default nextConfig;
