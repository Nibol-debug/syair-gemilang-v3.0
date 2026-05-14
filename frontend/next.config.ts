import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns", "recharts", "leaflet"],
  },
  // Allow development access from the local network IP
  allowedDevOrigins: ['192.168.4.55', 'localhost:3000'],
  // Restrict Turbopack to only watch files within the frontend directory
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
