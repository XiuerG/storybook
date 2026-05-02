import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // react-pageflip directly manipulates DOM nodes. React 18 strict mode
  // double-invokes effects on mount which causes removeChild conflicts.
  reactStrictMode: false,
};

export default nextConfig;
