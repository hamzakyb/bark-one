/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Enable React Strict Mode
  reactStrictMode: true,
  // Enable SWC minification
  swcMinify: true,
};

export default nextConfig;
