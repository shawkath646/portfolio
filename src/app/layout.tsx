import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import appBaseUrl from "@/data/appBaseUrl";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0a192f" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(appBaseUrl),
  title: {
    default: "Shawkat Hossain Maruf | Full-Stack Software Engineer",
    template: "%s | Shawkat Hossain Maruf",
  },
  description:
    "Full-stack developer and Computer Science student at Sejong University specializing in React, Next.js, TypeScript, and Android development. Building modern web applications and mobile solutions with cutting-edge technologies.",
  applicationName: "Shawkat Hossain Maruf Portfolio",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Shawkat Hossain Maruf",
    "shawkath646",
    "Full-stack Developer",
    "Web Developer",
    "Android App Developer",
    "Next.js Developer",
    "React Developer",
    "Bangladeshi Developer",
    "Sejong University",
    "Computer Science Student",
    "Developer Portfolio",
    "Data Science Learner",
    "Programming",
    "Tech Enthusiast",
    "Tech Blogger",
    "Software Engineer",
    "Freelancer",
    "Remote Worker",
  ],
  authors: { name: "Shawkat Hossain Maruf", url: appBaseUrl },
  creator: "Shawkat Hossain Maruf",
  publisher: "Shawkat Hossain Maruf",
  category: "Technology",
  classification: "Portfolio Website",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ko_KR"],
    url: appBaseUrl,
    siteName: "Shawkat Hossain Maruf",
    title: "Shawkat Hossain Maruf | Full-Stack Software Engineer",
    description:
      "Full-stack developer and Computer Science student at Sejong University specializing in React, Next.js, TypeScript, and Android development.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Shawkat Hossain Maruf Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shawkat Hossain Maruf | Full-Stack Software Engineer",
    description:
      "Full-stack developer and Computer Science student at Sejong University specializing in React, Next.js, TypeScript, and Android development.",
    creator: "@shawkath646",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
