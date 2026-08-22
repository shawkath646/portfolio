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
    lang: Locale | string, 
    namespaces: string
) {
    const selectedLocale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;

    try {
        const langPack = await import(`@/language-pack/${selectedLocale}/${namespaces}.json`);
        return langPack.default;
        
    } catch {         
        if (selectedLocale === defaultLocale) {
            throw new Error(`CRITICAL: Default language pack missing. Could not find "${defaultLocale}/${namespaces}.json".`);
        }

        console.warn(`Language pack missing for "${selectedLocale}/${namespaces}". Falling back to default "${defaultLocale}".`);
        
        try {
            const fallbackPack = await import(`@/language-pack/${defaultLocale}/${namespaces}.json`);
            return fallbackPack.default;
            
        } catch {
            throw new Error(`CRITICAL: Both requested ("${selectedLocale}") and fallback ("${defaultLocale}") language packs missing for namespace "${namespaces}".`);
        }
    }
}