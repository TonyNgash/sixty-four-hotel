/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Add this line here
  output: 'standalone',

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
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
  
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@libsql/hrana-client');
    }
    return config;
  },
};

// 2. Change the export to standard CommonJS for better compatibility with cPanel
module.exports = nextConfig;