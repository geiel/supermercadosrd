import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ixfslclarqzcptjjuodm.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/product_images/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
