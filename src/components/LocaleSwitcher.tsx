"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { isLocale } from "@/lib/locale";
import type { Dictionary } from "@/types/dictionary.types";
import type { Locale } from "@/lib/locale";

type LocaleSwitcherLanguagePack = Pick<
    Dictionary<"footer-component">,
    "languageSwitcherTitle"
    | "languageSwitcherAriaLabel"
    | "languageEnglish"
    | "languageKorean"
>;

export default function LocaleSwitcher({
    languagePack,
    locale
}: {
    languagePack: LocaleSwitcherLanguagePack,
    locale: Locale
}) {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const query = search ? `?${search}` : "";

    const pathSegments = pathname.split("/").filter(Boolean);
    const normalizedPath =
        pathSegments.length > 0 && isLocale(pathSegments[0])
            ? `/${pathSegments.slice(1).join("/")}` || "/"
            : pathname || "/";

    const buildLocaleHref = (targetLocale: Locale) => {
        const targetPath =
            normalizedPath === "/" ? `/${targetLocale}` : `/${targetLocale}${normalizedPath}`;
        return `${targetPath}${query}`;
    };

    const localeOptions: Array<{ code: Locale; label: string }> = [
        { code: "en", label: languagePack.languageEnglish },
        { code: "ko", label: languagePack.languageKorean },
    ];

    return (
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
                    const isActive = locale === localeOption.code;

                    return (
                        <Link
                            key={localeOption.code}
                            href={buildLocaleHref(localeOption.code)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${isActive
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
    );
}