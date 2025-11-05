import type { Metadata } from 'next';
import AboutHero from "./AboutHero";
import DreamCards from "./DreamCards";
import EducationFlowChart from "./EducationFlowChart";
import WorkExperience from "./WorkExperience";
import PersonalLifeSection from "./PersonalLifeSection";

// Enhanced metadata for better SEO
export const metadata: Metadata = {
  title: "About Shawkat Hossain Maruf - Computer Science Student & Developer",
  description: "Learn about Shawkat Hossain Maruf, a 20-year-old Computer Science student at Sejong University with a passion for software engineering, web development, and creating innovative solutions. Discover my academic journey, technical skills, work experience, and aspirations.",
  keywords: [
    "Shawkat Hossain Maruf",
    "About Shawkat Hossain",
    "Software Engineer",
    "Web Developer",
    "Sejong University",
    "Computer Science Student",
    "Developer Portfolio",
    "Personal Journey",
    "Tech Career",
    "Student Developer",
    "Software Development",
  ],
  alternates: {
    canonical: "https://shawkath646.pro/about"
  },
  openGraph: {
    title: "About Shawkat Hossain Maruf - Computer Science Student & Developer",
    description: "Discover my academic journey, technical skills, and aspirations as a Computer Science student at Sejong University and aspiring software engineer.",
    url: "https://shawkath646.pro/about",
    siteName: "Shawkat Hossain Maruf Portfolio",
    locale: "en_US",
    type: "profile",
    images: [
      {
        url: "https://shawkath646.pro/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Shawkat Hossain Maruf - Computer Science Student",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@shawkath646",
    creator: "@shawkath646",
    title: "About Shawkat Hossain Maruf - Computer Science Student & Developer",
    description: "Discover my academic journey, technical skills, and aspirations as a Computer Science student and aspiring software engineer.",
    images: ["https://shawkath646.pro/profile.jpg"],
  },
};

export default function About() {
  return (
    <main 
      className="min-h-screen relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 overflow-hidden"
      aria-labelledby="about-page-title"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-pink-200/20 to-purple-300/20 dark:from-pink-900/10 dark:to-purple-800/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-blue-200/20 to-indigo-300/20 dark:from-blue-900/10 dark:to-indigo-800/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 z-0"></div>
      
      {/* Content with updated order */}
      <AboutHero />
      <DreamCards />
      <EducationFlowChart />
      <WorkExperience />
      <PersonalLifeSection />
    </main>
  );
}
