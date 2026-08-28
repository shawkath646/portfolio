import type { Metadata } from 'next';
import ShareFilesSection from '@/components/HomePage/ShareFilesSection';
import appBaseUrl from '@/data/appBaseUrl';
import { getLanguagePack, locales, resolveLocale, defaultLocale } from '@/lib/locale';
import BuyMeACoffee from "./BuyMeACoffee";
import Connections from "./Connections";
import ContactForm from "./ContactForm";

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ lang: string }>;
}>): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = await getLanguagePack(locale, "contact-page");

  const languages: Record<string, string> = {};
  for (const l of locales) {
      languages[l] = new URL(`/${l}/contact`, appBaseUrl).toString();
  }
  languages["x-default"] = new URL(`/${defaultLocale}/contact`, appBaseUrl).toString();

  return {
    title: dict.metaTitle,
    description: dict.metaDescription,
    keywords: dict.metaKeywords,
    alternates: {
      canonical: new URL(`/${locale}/contact`, appBaseUrl),
      languages,
    }
  };
}

export default async function ContactPage({
  params,
}: Readonly<{
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

  const [
    pageLanguagePack,
    connectionsLanguagePack,
    shareFilesLanguagePack,
    buyMeACoffeeLanguagePack,
    contactFormLanguagePack,
  ] = await Promise.all([
    getLanguagePack(lang, "contact-page"),
    getLanguagePack(lang, "contact-connections-component"),
    getLanguagePack(lang, "homepage-share-files-component"),
    getLanguagePack(lang, "contact-buy-me-a-coffee-component"),
    getLanguagePack(lang, "contact-form-component"),
  ]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      role="main"
      className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-purple-100 dark:from-[#0a192f] dark:via-[#1e293b] dark:to-[#0f172a] pt-22 pb-10 px-3"
      aria-label={pageLanguagePack.mainAriaLabel}
    >
      <div className="container mx-auto space-y-22">
        <Connections languagePack={connectionsLanguagePack} />
        <ShareFilesSection languagePack={shareFilesLanguagePack} />
        <BuyMeACoffee languagePack={buyMeACoffeeLanguagePack} />
        <ContactForm languagePack={contactFormLanguagePack} />
      </div>
    </main>
  );
};