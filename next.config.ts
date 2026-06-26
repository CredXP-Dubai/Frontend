import type { NextConfig } from "next";

const apiUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://backend-cumg.onrender.com"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  /**
   * Proxy API traffic through Next.js so the browser stays same-origin.
   * Fixes CORS failures when the frontend runs on localhost (e.g. :3001)
   * and the API is on another host (Render, local backend, etc.).
   */
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${apiUrl}/api/v1/:path*` },
      { source: "/health", destination: `${apiUrl}/health` },
    ];
  },
};

export default nextConfig;
