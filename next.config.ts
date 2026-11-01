import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      // rrryoutube.com (루트 도메인) → ripavid.com
      {
        source: '/shorts/:id',
        has: [
          {
            type: 'host',
            value: 'rrryoutube.com',
          },
        ],
        destination: 'https://ripavid.com/dashboard?v=:id',
        permanent: true,
      },
      // www.rrryoutube.com → ripavid.com
      {
        source: '/shorts/:id',
        has: [
          {
            type: 'host',
            value: 'www.rrryoutube.com',
          },
        ],
        destination: 'https://ripavid.com/dashboard?v=:id',
        permanent: true,
      },
      // rrryoutube.com의 다른 모든 경로는 ripavid.com 대시보드로
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'rrryoutube.com',
          },
        ],
        destination: 'https://ripavid.com/dashboard',
        permanent: true,
      },
      // www.rrryoutube.com의 다른 모든 경로는 ripavid.com 대시보드로
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.rrryoutube.com',
          },
        ],
        destination: 'https://ripavid.com/dashboard',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
