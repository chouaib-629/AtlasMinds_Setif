import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // For static export (recommended for cPanel hosting)
  // output: 'export',
  // trailingSlash: true,
  
  // For standalone server (if using Node.js on cPanel)
  // output: 'standalone',
  
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yourdomain.com/api',
  },
};

export default nextConfig;
