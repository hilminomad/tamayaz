/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io'],
  },
};

module.exports = nextConfig;

module.exports = {
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
