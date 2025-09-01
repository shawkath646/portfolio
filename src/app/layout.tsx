import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import "./globals.css";

// Optimized font loading with preload and fallback
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
    default: "Shawkat Hossain Maruf - Full-stack Developer & Tech Blogger",
    template: "%s | Shawkat Hossain Maruf",
  },
  description:
    "Shawkat Hossain Maruf (@shawkath646) is a Computer Science and Engineering student at Sejong University and a passionate full-stack developer. He specializes in building fast, modern web applications using React, Next.js, and Tailwind CSS, and also develops high-performance Android apps with React Native. Currently expanding his expertise in Artificial Intelligence, Data Science, and Analytics.",
  applicationName: "Shawkat Hossain Maruf Portfolio",
  metadataBase: new URL("https://shawkath646.pro"),
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
    url: "https://shawkath646.pro",
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
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Shawkat Hossain Maruf Portfolio",
    images: [
      {
        url: "https://shawkath646.pro/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Shawkat Hossain Maruf - Full-stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@shawkath646",
    creator: "@shawkath646",
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual code
    yandex: "yandex-verification-code", // Add if needed
  },
  other: {
    "google-site-verification": "your-google-verification-code",
    "msvalidate.01": "bing-verification-code", // Bing verification
  },
};


// Enhanced structured data with more comprehensive information
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Shawkat Hossain Maruf",
  "alternateName": ["shawkath646", "SH Maruf"],
  "url": "https://shawkath646.pro",
  "email": "shawkath646@gmail.com",
  "image": {
    "@type": "ImageObject",
    "url": "https://shawkath646.pro/profile.jpg",
    "width": 400,
    "height": 400
  },
  "sameAs": [
    "https://github.com/shawkath646",
    "https://www.youtube.com/@shawkath646",
    "https://linkedin.com/in/shawkath645",
    "https://www.facebook.com/shawkath646",
    "https://www.instagram.com/shawkath646",
  ],
  "jobTitle": [
    "Full-stack Web Developer", 
    "Android App Developer", 
    "Freelancer/Remote Worker", 
    "Computer Science Student"
  ],
  "worksFor": [
    {
      "@type": "Organization",
      "name": "Freelance",
      "url": "https://shawkath646.pro",
      "description": "Independent software development services"
    },
    {
      "@type": "OrganizationRole",
      "roleName": "Founder & CEO",
      "startDate": "2024-01",
      "worksFor": {
        "@type": "Organization",
        "name": "Cloudburst Lab",
        "url": "https://cloudburstlab.vercel.app",
        "description": "Software development and digital solutions company"
      }
    }
  ],
  "alumniOf": [
    {
      "@type": "CollegeOrUniversity",
      "name": "Sejong University",
      "sameAs": "https://www.sejong.ac.kr",
      "department": "Computer Science and Engineering"
    },
    {
      "@type": "HighSchool", 
      "name": "Narsingdi Model College",
      "sameAs": "https://narsingdimodelcollege.codetreebd.com"
    },
    {
      "@type": "HighSchool",
      "name": "Monohard Government Pilot Model High School", 
      "sameAs": "http://www.monohardimphs.edu.bd"
    }
  ],
  "hasSkill": [
    "JavaScript", "TypeScript", "Python", "C Programming",
    "React.js", "Next.js", "Node.js", "React Native",
    "Tailwind CSS", "Firebase", "MongoDB",
    "Data Analysis", "Machine Learning", "UI/UX Design"
  ],
  "knowsLanguage": [
    {"@type": "Language", "name": "Bengali", "alternateName": "bn"},
    {"@type": "Language", "name": "English", "alternateName": "en"}, 
    {"@type": "Language", "name": "Korean", "alternateName": "ko"},
    {"@type": "Language", "name": "Hindi", "alternateName": "hi"}
  ],
  "description": "Shawkat Hossain Maruf (@shawkath646) is a Computer Science and Engineering student at Sejong University and a passionate full-stack developer. He specializes in building fast, modern web applications using React, Next.js, and Tailwind CSS, and also develops high-performance Android apps with React Native. Currently expanding his expertise in Artificial Intelligence, Data Science, and Analytics.",
  "gender": "Male",
  "birthDate": "2005-12-30", 
  "nationality": {
    "@type": "Country",
    "name": "Bangladesh"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "South Korea",
    "addressLocality": "Seoul",
    "addressRegion": "Seoul"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://shawkath646.pro"
  }
};


// Navigation loading component
function NavigationLoading() {
  return (
    <div className="fixed left-0 top-0 w-full z-50 bg-white/70 dark:bg-[#0a192f]/80 backdrop-blur shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="hidden md:flex space-x-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className="scroll-smooth"
      suppressHydrationWarning
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
        
        {/* Enhanced structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
        
        {/* Viewport and theme color */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#3b82f6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a192f" media="(prefers-color-scheme: dark)" />
        
        {/* Performance and security headers */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
        suppressHydrationWarning
      >
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all focus:ring-2 focus:ring-blue-400"
        >
          Skip to main content
        </a>
        
        {/* Navigation with loading state */}
        <Suspense fallback={<NavigationLoading />}>
          <Navbar />
        </Suspense>
        
        {/* Main content area */}
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
        
        {/* Footer with loading state */}
        <Suspense fallback={
          <div className="w-full h-32 bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 dark:from-[#17223b] dark:via-[#172a39] dark:to-[#1a1e2d] animate-pulse"></div>
        }>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
