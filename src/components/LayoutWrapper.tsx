import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import NoJavaScript from "./NoJavaScript";
import { ToastProvider } from "./Toast";
import { getLanguagePack, Locale } from "@/lib/locale";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["ui-monospace", "monospace"],
});

const LayoutWrapper = async ({ children, lang = "en" }: { children: Readonly<React.ReactNode>, lang?: Locale }) => {
    const languagePack = await getLanguagePack(lang, "layout-wrapper-component");

    return (
        <html
            lang={lang}
            className="scroll-smooth"
            data-scroll-behavior="smooth"
            suppressHydrationWarning
        >
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
                suppressHydrationWarning
            >
                <NoJavaScript lang={lang} />
                <Link
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all focus:ring-2 focus:ring-blue-400"
                >
                    {languagePack.skipToMainContent}
                </Link>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </body>
        </html>
    );
};

export default LayoutWrapper;
