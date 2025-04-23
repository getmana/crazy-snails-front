import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/uk',
        permanent: true,
      },
    ]
  }
};

export default nextConfig;
