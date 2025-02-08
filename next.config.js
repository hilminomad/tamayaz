/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io','img.clerk.com'],
  },
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/serve-file/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/upload',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Adjust for specific domains if needed
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;