import { Metadata } from 'next';
import ProjectsClient from './ProjectsClient';
import { getProjectsData } from '@/actions/github/getProjectsData';

export const metadata: Metadata = {
  title: "Projects Portfolio - Shawkat Hossain Maruf (shawkath646) | Full-Stack Developer",
  description: "Browse 100+ projects by Shawkat Hossain Maruf (shawkath646) - Full-stack developer specializing in React, Next.js, TypeScript. View web applications, mobile apps, open-source libraries, and client work on GitHub.",
  keywords: [
    "Shawkat Hossain Maruf projects",
    "shawkath646 GitHub",
    "shawkath646 portfolio",
    "React developer projects",
    "Next.js projects",
    "TypeScript projects",
    "Full-stack developer portfolio",
    "Web development projects",
    "Open source contributions",
    "Mobile app development",
    "JavaScript projects",
    "Bangladesh developer",
    "Sejong University projects",
    "Software engineer portfolio"
  ],
  authors: {
    name: "Shawkat Hossain Maruf",
    url: "https://shawkath646.pro",
  },
  creator: "Shawkat Hossain Maruf (shawkath646)",
  publisher: "Shawkat Hossain Maruf",
  alternates: {
    canonical: "https://shawkath646.pro/projects",
  },
  openGraph: {
    title: "Projects Portfolio - Shawkat Hossain Maruf (shawkath646)",
    description: "Browse 100+ projects by Shawkat Hossain Maruf - Full-stack developer. React, Next.js, TypeScript, mobile apps, open-source libraries, and more.",
    url: "https://shawkath646.pro/projects",
    siteName: "Shawkat Hossain Maruf Portfolio",
    locale: "en_US",
    type: "profile",
    images: [
      {
        url: "https://shawkath646.pro/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Shawkat Hossain Maruf - Projects Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@shawkath646",
    creator: "@shawkath646",
    title: "Projects Portfolio - Shawkat Hossain Maruf (shawkath646)",
    description: "Browse 100+ projects by Shawkat Hossain Maruf - React, Next.js, TypeScript, mobile apps, and more.",
    images: ["https://shawkath646.pro/profile.jpg"],
  },
};

export default async function ProjectsPage() {
  const projectsData = await getProjectsData();

  return <ProjectsClient projectsData={projectsData} />;
}
