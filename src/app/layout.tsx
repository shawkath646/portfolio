import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  keywords: [
    "Shawkat Hossain Maruf",
    "shawkath646",
    "Full-stack Developer",
    "Web Developer",
    "Android App Developer",
    "Next.js Developer",
    "Bangladeshi Developer",
    "Sejong University",
    "Computer Science Student",
    "Portfolio",
    "Data Science Learner",
    "Programming",
    "Tech Enthusiast",
  ],
  authors: {
    name: "Shawkat Hossain Maruf",
    url: "https://shawkath646.pro",
  },
  creator: "Shawkat Hossain Maruf",
  publisher: "Shawkat Hossain Maruf",
  category: "Technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};


const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Shawkat Hossain Maruf",
  "alternateName": "shawkath646",
  "url": "https://shawkath646.pro",
  "email": "shawkath646@gmail.com",
  "sameAs": [
    "https://github.com/shawkath646",
    "https://www.youtube.com/@shawkath646",
    "https://linkedin.com/in/shawkath645",
    "https://www.facebook.com/shawkath646",
    "https://www.instagram.com/shawkath646",
  ],
  "jobTitle": ["Full-stack Web Developer", "Android App Developer", "Freelancer/Remote Worker",  "Student"],
  "worksFor": [
    {
      "@type": "Organization",
      "name": "Freelance",
      "url": "https://shawkath646.pro"
    },
    {
      "@type": "OrganizationRole",
      "jobTitle": "Founder & CEO",
      "startDate": "2024-01",
      "memberOf": {
        "@type": "Organization",
        "name": "Cloudburst Lab",
        "url": "https://cloudburstlab.vercel.app"
      }
    }
  ]
  ,
  "alumniOf": [
    {
      "@type": "CollegeOrUniversity",
      "name": "Sejong University",
      "sameAs": "https://www.sejong.ac.kr"
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
  "knowsAbout": [
    "C Programming",
    "Python",
    "JavaScript",
    "TypeScript",
    "React.js", "Next.js", "Tailwind CSS", "Node.js"
  ],
  "knowsLanguage": ["English", "Korean", "Hindi", "Bengali"],
  "image": "https://shawkath646.pro/profile.jpg",
  "description": "Shawkat Hossain Maruf (@shawkath646) is a Computer Science and Engineering student at Sejong University and a passionate full-stack developer. He specializes in building fast, modern web applications using React, Next.js, and Tailwind CSS, and also develops high-performance Android apps with React Native. Currently expanding his expertise in Artificial Intelligence, Data Science, and Analytics."
  ,
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
    "addressRegion": "Seoul",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
