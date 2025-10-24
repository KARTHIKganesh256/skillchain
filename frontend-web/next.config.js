/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['firebasestorage.googleapis.com']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['firebase'],
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Remove experimental options that cause warnings
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['firebase', 'react-icons']
  },
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Firebase bundle
          firebase: {
            name: 'firebase',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
            priority: 40,
          },
          // React bundle
          react: {
            name: 'react',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            priority: 30,
          },
          // Common bundle
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
}

module.exports = nextConfig


