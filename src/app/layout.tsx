import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import NoJavaScript from "@/components/NoJavaScript";
import { ToastProvider } from "@/components/Toast";
import appBaseUrl from "@/data/appBaseUrl";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["ui-monospace", "monospace"],
});


export const metadata: Metadata = {
  title: {
    default: "Shawkat Hossain Maruf - Full-Stack Developer & Software Engineer",
    template: "%s | Shawkat Hossain Maruf",
  },
  description:
    "Full-stack developer and Computer Science student at Sejong University specializing in React, Next.js, TypeScript, and Android development. Building modern web applications and mobile solutions with cutting-edge technologies.",
  applicationName: "Shawkat Hossain Maruf Portfolio",
  metadataBase: appBaseUrl,
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
  authors: {
    name: "Shawkat Hossain Maruf",
    url: appBaseUrl,
  },
  creator: "Shawkat Hossain Maruf",
  publisher: "Shawkat Hossain Maruf",
  category: "Technology",
  classification: "Portfolio Website",
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
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      className="scroll-smooth"
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googleapis.com" />
        <link rel="preconnect" href="https://github.com" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        {/* Viewport and theme color */}
        <meta name="theme-color" content="#3b82f6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a192f" media="(prefers-color-scheme: dark)" />

        {/* Performance and security headers */}
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        {/* No JavaScript warning */}
        <NoJavaScript />

        {/* Skip to main content for accessibility */}
        <Link
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all focus:ring-2 focus:ring-blue-400"
        >
          Skip to main content
        </Link>

        <ToastProvider>
          {children}
        </ToastProvider>

        <Analytics />
      </body>
    </html>
  );
}
