import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["192.168.0.2", "assets.directdigitalworld.com"],
  },
};

export default nextConfig;
