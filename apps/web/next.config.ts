import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin Turbopack to the monorepo root so Next resolves `next` from the
  // pnpm workspace (and stops guessing from stray lockfiles).
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
  output: "standalone",
};

export default nextConfig;
