import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  experimental: {
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.qrserver.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.clouburstlab.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
    qualities: [70, 75, 85],
  },
  async headers() {
    return [
      {
        source: "/embedded-card(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *;",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
        ],
      },
      {
        source: "/.well-known/discord",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain; charset=utf-8",
          },
        ],
      },
    ];
  },
};

export default nextConfig;