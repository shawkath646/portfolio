import type { Metadata } from "next";
import getJsonLd from "@/actions/mixed/getJsonLd";
import LayoutWrapper from "@/components/LayoutWrapper";
import BreadcrumbJsonLd from "@/components/navigation/BreadcrumbJsonLd";
import Footer from "@/components/navigation/Footer";
import Navbar from "@/components/navigation/Navbar";
import appBaseUrl from "@/data/appBaseUrl";
import { getLanguagePack, locales, defaultLocale, resolveLocale } from "@/lib/locale";

export async function generateStaticParams() {
    return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ }: LayoutProps<"/[lang]">): Promise<Metadata> {
    const languages: Record<string, string> = {};
    for (const l of locales) {
        languages[l] = new URL(`/${l}`, appBaseUrl).toString();
    }
    languages["x-default"] = new URL(`/${defaultLocale}`, appBaseUrl).toString();

    return {
        alternates: {
            languages,
        },
    };
}

export default async function Layout({
    children,
    params
}: Readonly<LayoutProps<"/[lang]">>) {
    const jsonLd = getJsonLd();

    const resolvedParams = await params;
    const resolvedLocale = resolveLocale(resolvedParams.lang)

    const navLanguagePack = await getLanguagePack(resolvedParams.lang, "navbar");
    const footerLanguagePack = await getLanguagePack(resolvedParams.lang, "footer-component");

    return (
        <LayoutWrapper lang={resolvedLocale}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                }}
            />
            <BreadcrumbJsonLd homeName={navLanguagePack.home} />
            <Navbar navLanguagePack={navLanguagePack} />
            {children}
            <Footer locale={resolvedLocale} languagePack={footerLanguagePack} />
        </LayoutWrapper>
    );
}
