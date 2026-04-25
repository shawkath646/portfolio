import getJsonLd from "@/actions/mixed/getJsonLd";
import BreadcrumbJsonLd from "@/components/navigation/BreadcrumbJsonLd";
import Footer from "@/components/navigation/Footer";
import Navbar from "@/components/navigation/Navbar";
import { getLanguagePack, locales } from "@/lib/locale";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function GeneralLayout({
    children,
    params
}: Readonly<LayoutProps<"/[lang]">>) {
    const jsonLd = await getJsonLd();

    const resolvedParams = await params;

    const navLanguagePack = await getLanguagePack(resolvedParams.lang, "navbar");
    const footerLanguagePack = await getLanguagePack(resolvedParams.lang, "footer-component");

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                }}
            />
            <BreadcrumbJsonLd />
            <Navbar navLanguagePack={navLanguagePack}  />
            {children}
            <Footer languagePack={footerLanguagePack} />
        </>
    );
}
