import Image from "next/image";
import Link from "next/link";
import { type Locale } from "@/lib/locale";
import type { Dictionary } from "@/types/dictionary.types";
import LocaleSwitcher from "../LocaleSwitcher";
import { Suspense } from "react";

export default async function Footer({
  languagePack,
  locale,
}: {
  languagePack: Dictionary<"footer-component">;
  locale: Locale;
}) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: languagePack.quickLinks.adminPanel, href: "/admin" },
    { name: languagePack.quickLinks.sitemap, href: "/sitemap.xml" },
    { name: languagePack.quickLinks.privacyPolicy, href: "#" },
    { name: languagePack.quickLinks.termsOfService, href: "#" },
  ];

  return (
    <footer
      className="w-full bg-linear-to-br from-gray-900 via-blue-900 to-gray-900 dark:from-gray-950 dark:via-blue-950/50 dark:to-gray-950 text-white border-t border-blue-500/20"
      role="contentinfo"
      aria-label={languagePack.siteFooterAriaLabel}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Links Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-blue-300 mb-4 text-center sm:text-left">
            {languagePack.quickLinksTitle}
          </h3>
          <nav
            aria-label={languagePack.footerNavigationAriaLabel}
            className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-3"
          >
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <Suspense fallback={<p>Loading...</p>}>
            <LocaleSwitcher
              languagePack={{
                languageSwitcherAriaLabel: languagePack.languageSwitcherAriaLabel,
                languageSwitcherTitle: languagePack.languageSwitcherTitle,
                languageEnglish: languagePack.languageEnglish,
                languageKorean: languagePack.languageKorean
              }}
              locale={locale}
            />
          </Suspense>
        </div>

        <div className="border-t border-gray-700/50 my-6"></div>

        <div className="mb-6 text-center">
          <p className="text-xs sm:text-sm text-yellow-200/90 font-medium leading-relaxed max-w-4xl mx-auto">
            {languagePack.warningText}
          </p>
        </div>

        <div className="border-t border-gray-700/50 my-6"></div>

        <div className="space-y-3 text-center text-xs sm:text-sm text-gray-400">
          <p className="flex flex-wrap items-center justify-center gap-1">
            <span>{languagePack.websiteBuiltByText}</span>
            <Link
              href="https://gh.shawkath646.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
            >
              shawkath646
            </Link>
            <span>&</span>
            <Link
              href="https://clouburstlab.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:opacity-80 transition-opacity duration-200"
            >
              <Image
                src="https://assets.clouburstlab.com/branding/icon_light.png"
                alt={languagePack.logoAlt}
                width={200}
                height={35}
                className="h-4 w-32 block dark:hidden"
              />
              <Image
                src="https://assets.clouburstlab.com/branding/icon_dark.png"
                alt={languagePack.logoAlt}
                width={200}
                height={35}
                className="h-4 w-32 hidden dark:block"
              />
            </Link>
          </p>

          <p className="text-gray-500">
            {languagePack.copyrightText
              .replace("{currentYear}", String(currentYear))
              .replace("{brandName}", languagePack.brandName)}
          </p>
        </div>
      </div>
    </footer>
  );
}