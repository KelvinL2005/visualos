import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/array",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;