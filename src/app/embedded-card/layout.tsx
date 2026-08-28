import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  title: "Shawkat Hossain Maruf | Embed Card",
  description: "Embeddable profile badge card for Shawkat Hossain Maruf.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmbeddedCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-transparent">
      <body className={`${geistSans.variable} ${geistMono.variable} m-0 bg-transparent p-0 antialiased`}>
        {children}
      </body>
    </html>
  );
}
