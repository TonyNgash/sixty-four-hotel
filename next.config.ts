import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint:{
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // 💡 NEW: Configuration for Webpack/Turbopack externals
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark the problematic package as external on the server side
      config.externals.push('@libsql/hrana-client');
    }
    
    // Clear the previous raw-loader configuration (it likely wasn't the issue)
    
    return config;
  },
};

export default nextConfig;