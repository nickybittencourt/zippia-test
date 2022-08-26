/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['logo.clearbit.com'],
  },
  async redirects() {
    return [
      {
        source: '/:slug',
        destination: '/test/jobs/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
