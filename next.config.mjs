/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'd1d5tqaqgxfrly.cloudfront.net',
          },
        ],
      },
};

export default nextConfig;
