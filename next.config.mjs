/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1d5tqaqgxfrly.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'jrabd.org',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/auth/callback/credentials", // Disable cache for login route
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
      {
        source: "/(.*)", // Apply to all other routes
        headers: process.env.NODE_ENV === "development"
          ? [
              {
                key: "Cache-Control",
                value: "no-store",
              },
            ]
          : [
              {
                key: "Cache-Control",
                value: "s-maxage=3600, stale-while-revalidate=59",
              },
            ],
      },
    ];
  },
};

export default nextConfig;
