import { NextRequest } from "next/server";

export const locales = ['en', 'ko'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function isLocale(lang: string): lang is Locale {
    return (locales as readonly string[]).includes(lang);
}

export function getLocaleFromPath(pathname: string | null): Locale {
    if (!pathname) return defaultLocale;

    const firstSegment = pathname.split('/').filter(Boolean)[0];

    return isLocale(firstSegment) ? firstSegment : defaultLocale;
}

export const getLocale = (request: NextRequest): Locale => {
    const acceptLanguage = request.headers.get('accept-language');
    if (!acceptLanguage) return defaultLocale;

    const preferredLocales = acceptLanguage
        .split(',')
        .map((lang) => lang.split(';')[0].trim().split('-')[0])
        .filter(Boolean);

    const match = preferredLocales.find(isLocale);
    return match ?? defaultLocale;
};

export async function getLanguagePack(
    lang: string,
    namespaces: string
) {
    const selectedLocale: Locale = isLocale(lang) ? lang : defaultLocale;
    const results = await import(`@/language-pack/${selectedLocale}/${namespaces}.json`)
        .then((m) => m.default)
        .catch(() => ({}))

    return results;
}