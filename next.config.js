/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracing: true,
  compiler: {
    emotion: true,
  },
};

module.exports = nextConfig;
