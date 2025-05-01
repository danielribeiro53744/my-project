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
   
};

module.exports = nextConfig;
