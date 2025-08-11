/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  output: 'standalone',
  transpilePackages: ['@ctf/ui', '@ctf/db']
};

export default nextConfig;
