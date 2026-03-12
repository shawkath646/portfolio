import { Metadata } from 'next';
import getProjectsData from '@/actions/creations/getProjectsData';
import NumberPagination from '@/components/navigation/NumberPagination';
import appBaseUrl from '@/data/appBaseUrl';
import ProjectsClient from './ProjectsClient';

const PROJECTS_PER_PAGE = 20;

export async function generateMetadata(
  { searchParams }: PageProps<'/creations/projects'>
): Promise<Metadata> {

  const requestedPage = Number((await searchParams).page) || 1;

  const projectsData = await getProjectsData({
    page: requestedPage,
    limit: PROJECTS_PER_PAGE,
  });

  const { page, totalPages, totalItems } = projectsData;

  const baseUrl = "/creations/projects";

  const previous =
    page > 1
      ? page === 2
        ? baseUrl
        : `${baseUrl}?page=${page - 1}`
      : null;

  const next =
    page < totalPages
      ? `${baseUrl}?page=${page + 1}`
      : null;

  return {
    title:
      page > 1
        ? `Projects Portfolio (Page ${page})`
        : "Projects Portfolio",

    description:
      page > 1
        ? `Page ${page} of ${totalPages} showcasing projects by Shawkat Hossain Maruf (shawkath646) including React, Next.js, TypeScript and open-source work.`
        : `Browse ${totalItems} projects by Shawkat Hossain Maruf (shawkath646) - Full-stack developer specializing in React, Next.js and TypeScript.`,

    alternates: {
      canonical:
        page > 1
          ? `${appBaseUrl}${baseUrl}?page=${page}`
          : `${appBaseUrl}${baseUrl}`,
    },

    pagination: {
      previous,
      next,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
  };
}

export default async function ProjectsPage({ searchParams }: PageProps<'/creations/projects'>) {
  const requestedPage = Number((await searchParams).page) || 1;

  const projectsData = await getProjectsData({
    page: requestedPage,
    limit: PROJECTS_PER_PAGE,
  });

  return (
    <main
      id="main-content"
      className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-purple-100 dark:from-[#0a192f] dark:via-[#1e293b] dark:to-[#0f172a] transition-all duration-700 py-20 px-4 md:px-6"
      role="main"
      aria-label="Projects Portfolio"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl opacity-40 animate-pulse-fade"></div>
        <div className="absolute top-1/4 -right-8 w-96 h-96 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl opacity-30 animate-pulse-fade" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-cyan-200 dark:bg-cyan-900/30 rounded-full blur-3xl opacity-35 animate-pulse-fade" style={{ animationDelay: '4s' }}></div>
      </div>
      <ProjectsClient
        key={projectsData.page}
        projects={projectsData.projects}
        totalProjects={projectsData.totalItems}
        currentPage={projectsData.page}
      />

      <div className="container mx-auto max-w-7xl relative z-10 w-full">
        <NumberPagination
          basePath="/creations/projects"
          currentPage={projectsData.page}
          totalPages={projectsData.totalPages}
        />
      </div>
    </main>
  );
}
