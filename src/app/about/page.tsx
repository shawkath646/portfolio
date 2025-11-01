import type { Metadata } from 'next';
import AboutHero from "./AboutHero";
import DreamCards from "./DreamCards";
import EducationFlowChart from "./EducationFlowChart";
import WorkExperience from "./WorkExperience";
import PersonalLifeSection from "./PersonalLifeSection";

// Enhanced metadata for better SEO
export const metadata: Metadata = {
  title: "About Me | Shawkat Hossain Maruf",
  description: "Learn about Shawkat Hossain Maruf, a 20-year-old Computer Science student at Sejong University with a passion for software engineering, traveling, and making a difference in the world.",
  keywords: [
    "Shawkat Hossain Maruf",
    "software engineer",
    "web developer",
    "Sejong University",
    "Computer Science",
    "portfolio about page",
    "student developer",
    "personal journey"
  ],
  alternates: {
    canonical: "https://shawkath646.pro/about"
  },
  openGraph: {
    title: "About Shawkat Hossain Maruf | Personal Journey",
    description: "Discover my academic journey, dreams, and aspirations as a Computer Science student and aspiring software engineer.",
    url: "https://shawkath646.pro/about",
    siteName: "Shawkat Hossain Maruf Portfolio",
    locale: "en_US",
    type: "website",
  }
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
