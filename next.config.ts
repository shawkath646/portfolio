import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  allowedDevOrigins: ["10.0.2.2"],
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
        hostname: "cloudburstlab.vercel.app",
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
  async redirects() {
    return [
      {
        source: "/index",
        destination: "/",
        permanent: true
      },
      {
        source: "/share",
        destination: "/contact/share-files",
        permanent: true
      },
      {
        source: "/about/gallery/sejong-university",
        destination: "/about/gallery/alb-sejong-university",
        permanent: true
      }
    ]
  }
};

export default withMDX(nextConfig);
