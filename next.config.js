/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true, // Add this line
  },
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    // Add WebSocket dependency fixes
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil'
    });
    return config;
  },
  // Optional: For Vercel deployments (if needed)
  env: {
    // Ensure your database URL is properly configured
    DATABASE_URL: process.env.DATABASE_URL,
  }
};

module.exports = nextConfig;
