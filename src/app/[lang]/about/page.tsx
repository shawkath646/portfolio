import type { Metadata } from 'next';
import SimplePagination from '@/components/navigation/SimplePagination';
import appBaseUrl from '@/data/appBaseUrl';
import { locales, resolveLocale, getLanguagePack, defaultLocale } from '@/lib/locale';
import Achievements from "./Achievements";
import DreamCards from "./DreamCards";
import EducationFlowChart from "./EducationFlowChart";
import GalleryNavigation from "./GalleryNavigation";
import LifeNavigation from './LifeNavigvation';
import WorkExperience from "./WorkExperience";

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ lang: string }>;
}>): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = await getLanguagePack(locale, "about-page");

  const languages: Record<string, string> = {};
  for (const l of locales) {
      languages[l] = new URL(`/${l}/about`, appBaseUrl).toString();
  }
  languages["x-default"] = new URL(`/${defaultLocale}/about`, appBaseUrl).toString();

  return {
    title: dict.metaTitle,
    description: dict.metaDescription,
    keywords: dict.metaKeywords,
    alternates: {
      canonical: new URL(`/${locale}/about`, appBaseUrl),
      languages,
    },
    pagination: {
      previous: new URL(`/${locale}`, appBaseUrl).toString(),
      next: new URL(`/${locale}/creations`, appBaseUrl).toString()
    }
  };
}

export default async function About({
  params,
}: Readonly<{
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const [
    lifeNavigationLanguagePack,
    galleryNavigationLanguagePack,
    dreamCardsLanguagePack,
    achievementsLanguagePack,
    educationLanguagePack,
    workExperienceLanguagePack
  ] = await Promise.all([
    getLanguagePack(lang, "about-life-navigation-component"),
    getLanguagePack(lang, "about-gallery-navigation-component"),
    getLanguagePack(lang, "about-dream-cards-component"),
    getLanguagePack(lang, "about-achievements-component"),
    getLanguagePack(lang, "about-education-component"),
    getLanguagePack(lang, "about-work-experience-component"),
  ]);

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
      <LifeNavigation languagePack={lifeNavigationLanguagePack} />
      <DreamCards languagePack={dreamCardsLanguagePack} />
      <EducationFlowChart languagePack={educationLanguagePack} />
      <WorkExperience languagePack={workExperienceLanguagePack} />
      <Achievements languagePack={achievementsLanguagePack} />
      <GalleryNavigation languagePack={galleryNavigationLanguagePack} />

      <SimplePagination
        lang={lang}
        prevPage="/"
        prevPageLabel="Home"
        nextPage="/creations"
        nextPageLabel="Creations"
      />
    </main>
  );
}
