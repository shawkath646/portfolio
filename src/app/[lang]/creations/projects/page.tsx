import { Metadata } from 'next';
import { locales, resolveLocale, getLanguagePack, defaultLocale } from '@/lib/locale';
import getProjectsData from '@/actions/creations/getProjectsData';
import NumberPagination from '@/components/navigation/NumberPagination';
import appBaseUrl from '@/data/appBaseUrl';
import ProjectsClient from './ProjectsClient';

const PROJECTS_PER_PAGE = 20;

export async function generateMetadata(
  { params, searchParams }: PageProps<'/[lang]/creations/projects'>
): Promise<Metadata> {

  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = await getLanguagePack(locale, 'projects-page');

  const requestedPage = Number((await searchParams).page) || 1;

  const projectsData = await getProjectsData({
    page: requestedPage,
    limit: PROJECTS_PER_PAGE,
  });

  const { page, totalPages } = projectsData;

  const baseUrl = `/${locale}/creations/projects`;

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

  const languages: Record<string, string> = {};
  for (const l of locales) {
      languages[l] = new URL(`/${l}/creations/projects`, appBaseUrl).toString();
  }
  languages["x-default"] = new URL(`/${defaultLocale}/creations/projects`, appBaseUrl).toString();

  return {
    title:
      page > 1
        ? `${dict.metaTitle} (Page ${page})`
        : dict.metaTitle,

    description:
      page > 1
        ? `${dict.metaDescription} - Page ${page} of ${totalPages}`
        : dict.metaDescription,

    alternates: {
      canonical:
        page > 1
          ? new URL(`${baseUrl}?page=${page}`, appBaseUrl)
          : new URL(baseUrl, appBaseUrl),
      languages
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

export default async function ProjectsPage({ searchParams, params }: PageProps<'/[lang]/creations/projects'>) {
  const requestedPage = Number((await searchParams).page) || 1;
  const lang = await params.then((p) => p.lang);
  const resolvedLang = resolveLocale(lang);

  const [projectsData, clientDict, cardDict, paginationDict] = await Promise.all([
      getProjectsData({
        page: requestedPage,
        limit: PROJECTS_PER_PAGE,
      }),
      getLanguagePack(resolvedLang, "projects-client-component"),
      getLanguagePack(resolvedLang, "projects-card-component"),
      getLanguagePack(resolvedLang, "number-pagination-component")
  ]);

  const clientLanguagePack = {
      ...clientDict,
      cardLanguagePack: cardDict,
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
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
        languagePack={clientLanguagePack}
      />

      <div className="container mx-auto relative z-10 w-full">
        <NumberPagination
          basePath="/creations/projects"
          currentPage={projectsData.page}
          totalPages={projectsData.totalPages}
          languagePack={paginationDict}
        />
      </div>
    </main>
  );
}
