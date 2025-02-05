import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //Directly redirect to users route
  async redirects() {
    return [
      {
        source: "/",
        destination: "/users",
        permanent: true, // Set to `false` if you may change this later
      },
    ];
  },
};

export default nextConfig;
