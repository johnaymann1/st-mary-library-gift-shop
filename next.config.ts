import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tsnemgotldpeutarwrdh.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
      allowedOrigins: ['st-mary-library-gift-shop.vercel.app', 'localhost:3000'],
    },
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Improve FCP and TTFB with optimized caching
    staleTimes: {
      dynamic: 300,
      static: 300,
    },
  },
  reactCompiler: true,
  compress: true,
  poweredByHeader: false,
  // Generate optimized output for better performance
  output: 'standalone',
};

export default nextConfig;
