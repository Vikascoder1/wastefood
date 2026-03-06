import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  images: {
// Allows food images to display from Supabase Storage
// Allows profile images to display from Supabase Storage
// Prevents the error you were seeing: "hostname is not configured under images"
    domains: ['bqyulioidcfblqtwvlgm.supabase.co']
  }
};

export default nextConfig;
