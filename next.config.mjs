/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d1d5tqaqgxfrly.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "jrabd.org",
      },
    ],
  },
  async headers() {
    return [
      // Cache only /api/public/*
      {
        source: "/api/public/:path*",
        headers: process.env.NODE_ENV === "development"
          ? [
              {
                key: "Cache-Control",
                value: "no-store", // Disable caching in development
              },
            ]
          : [
              {
                key: "Cache-Control",
                value: "s-maxage=3600, stale-while-revalidate=59", // Cache for production
              },
            ],
      },
    ];
  },
};

export default nextConfig;
