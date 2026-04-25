"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/locale";

type FooterLanguagePack = {
  quickLinksTitle: string;
  siteFooterAriaLabel: string;
  footerNavigationAriaLabel: string;
  languageSwitcherTitle: string;
  languageSwitcherAriaLabel: string;
  languageEnglish: string;
  languageKorean: string;
  warningText: string;
  websiteBuiltByText: string;
  copyrightText: string;
  logoAlt: string;
  brandName: string;
  quickLinks: {
    adminPanel: string;
    sitemap: string;
    privacyPolicy: string;
    termsOfService: string;
  };
};

export default function Footer({ languagePack }: { languagePack: FooterLanguagePack }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentYear = new Date().getFullYear();
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentLocale: Locale =
    pathSegments.length > 0 && isLocale(pathSegments[0])
      ? pathSegments[0]
      : "en";

  const pathWithoutLocale =
    pathSegments.length > 0 && isLocale(pathSegments[0])
      ? `/${pathSegments.slice(1).join("/")}`
      : pathname;

  const normalizedPath =
    pathWithoutLocale === "" ? "/" : pathWithoutLocale;

  const queryString = searchParams.toString();

  const buildLocaleHref = (targetLocale: Locale) => {
    const targetPath =
      normalizedPath === "/"
        ? `/${targetLocale}`
        : `/${targetLocale}${normalizedPath}`;

    return queryString ? `${targetPath}?${queryString}` : targetPath;
  };

  const localeOptions: Array<{ code: Locale; label: string }> = [
    { code: "en", label: languagePack.languageEnglish },
    { code: "ko", label: languagePack.languageKorean },
  ];
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

          <div className="mt-5 flex flex-col items-center sm:items-start gap-2">
            <h4 className="text-xs font-semibold tracking-wide uppercase text-blue-200/90">
              {languagePack.languageSwitcherTitle}
            </h4>
            <div
              className="inline-flex rounded-full border border-blue-300/25 bg-blue-950/30 p-1"
              role="group"
              aria-label={languagePack.languageSwitcherAriaLabel}
            >
              {localeOptions.map((localeOption) => {
                const isActive = currentLocale === localeOption.code;

                return (
                  <Link
                    key={localeOption.code}
                    href={buildLocaleHref(localeOption.code)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-linear-to-r from-blue-500 to-cyan-400 text-white shadow-md"
                        : "text-blue-100/90 hover:text-white hover:bg-white/10"
                    }`}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={localeOption.label}
                  >
                    {localeOption.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 my-6"></div>

        {/* Notice Section */}
        <div className="mb-6 text-center">
          <p className="text-xs sm:text-sm text-yellow-200/90 font-medium leading-relaxed max-w-4xl mx-auto">
            {languagePack.warningText}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 my-6"></div>

        {/* Bottom Section */}
        <div className="space-y-3 text-center text-xs sm:text-sm text-gray-400">
          <p className="flex flex-wrap items-center justify-center gap-1">
            <span>{languagePack.websiteBuiltByText}</span>
            <a
              href="https://github.com/shawkath646"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
            >
              shawkath646
            </a>
            <span>&</span>
            <a
              href="https://cloudburstlab.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:opacity-80 transition-opacity duration-200"
            >
              <Image
                src="https://cloudburstlab.vercel.app/api/branding/logo?variant=transparent"
                alt={languagePack.logoAlt}
                width={64}
                height={32}
                className="h-8 w-16"
              />
            </a>
          </p>

          <p className="text-gray-500">
            {languagePack.copyrightText.replace("{currentYear}", String(currentYear)).replace("{brandName}", languagePack.brandName)}
          </p>
        </div>
      </div>
    </footer>
  );
}