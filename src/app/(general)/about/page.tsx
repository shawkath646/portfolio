import type { Metadata } from 'next';
import SimplePagination from '@/components/navigation/SimplePagination';
import appBaseUrl from '@/data/appBaseUrl';
import Achievements from "./Achievements";
import DreamCards from "./DreamCards";
import EducationFlowChart from "./EducationFlowChart";
import GalleryNavigation from "./GalleryNavigation";
import LifeNavigation from './LifeNavigvation';
import WorkExperience from "./WorkExperience";


export const metadata: Metadata = {
  title: "About me",
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
    canonical: new URL('/about', appBaseUrl),
  },
  pagination: {
    previous: appBaseUrl,
    next: new URL("/creations", appBaseUrl)
  }
};

export default function About() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      role="main"
      aria-label="About page content"
      className="min-h-screen relative bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 overflow-hidden"
      aria-labelledby="about-page-title"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-linear-to-br from-pink-200/20 to-purple-300/20 dark:from-pink-900/10 dark:to-purple-800/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-linear-to-tl from-blue-200/20 to-indigo-300/20 dark:from-blue-900/10 dark:to-indigo-800/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 z-0"></div>

      {/* Content with updated order */}
      <LifeNavigation />
      <DreamCards />
      <EducationFlowChart />
      <WorkExperience />
      <Achievements />
      <GalleryNavigation />

      <SimplePagination
        prevPage="/"
        prevPageLabel="Home"
        nextPage="/creations"
        nextPageLabel="Creations"
      />
    </main>
  );
}
