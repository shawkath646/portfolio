import { NextRequest } from "next/server";
import type { DictionaryMap } from "@/types/dictionary.types";

// ─── Locale Constants ───
export const locales = ["en", "ko"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const localeSet = new Set<string>(locales);

export function isLocale(lang: string): lang is Locale {
    return localeSet.has(lang);
}

export function getLocaleFromPath(pathname: string | null): Locale {
    if (!pathname) return defaultLocale;
    const firstSegment = pathname.split("/").filter(Boolean)[0];
    return firstSegment && isLocale(firstSegment) ? firstSegment : defaultLocale;
}

export function resolveLocale(lang: string | undefined): Locale {
    return lang && isLocale(lang) ? lang : defaultLocale;
}

// ─── Accept-Language parsing (quality-aware) ───
export const getLocale = (request: NextRequest): Locale => {
    const acceptLanguage = request.headers.get("accept-language");
    if (!acceptLanguage) return defaultLocale;

    const weighted = acceptLanguage
        .split(",")
        .map((part) => {
            const [langPart, qPart] = part.trim().split(";q=");
            const quality = qPart ? parseFloat(qPart) : 1;
            const lang = langPart.split("-")[0].trim().toLowerCase();
            return { lang, quality: Number.isNaN(quality) ? 0 : quality };
        })
        .filter((entry) => entry.lang)
        .sort((a, b) => b.quality - a.quality);

    for (const { lang } of weighted) {
        if (isLocale(lang)) return lang;
    }
    return defaultLocale;
};

// ─── Namespace Registry (strongly typed) ───
export type Namespace = keyof DictionaryMap;

type RawPack = Record<string, unknown>;

const rawPackCache = new Map<string, Promise<RawPack>>();
const dictCache = new Map<string, Promise<unknown>>();

function loadRawPack(locale: Locale, namespace: Namespace, isDefault: boolean): Promise<RawPack> {
    const key = `${locale}/${String(namespace)}`;
    let cached = rawPackCache.get(key);
    if (!cached) {
        cached = import(`@/language-pack/${locale}/${String(namespace)}.json`)
            .then((mod) => mod.default as RawPack)
            .catch((err) => {
                rawPackCache.delete(key); // don't cache a failure forever
                console.warn(
                    isDefault
                        ? `CRITICAL: Default language pack missing for "${String(namespace)}".`
                        : `Language pack missing for "${key}". Falling back to default "${defaultLocale}".`,
                    err
                );
                return {};
            });
        rawPackCache.set(key, cached);
    }
    return cached;
}

export async function getLanguagePack<N extends Namespace>(
    lang: Locale | string,
    namespace: N
): Promise<DictionaryMap[N]> {
    const selectedLocale: Locale = isLocale(lang) ? lang : defaultLocale;
    const cacheKey = `${selectedLocale}/${String(namespace)}`;

    const cached = dictCache.get(cacheKey);
    if (cached) return cached as Promise<DictionaryMap[N]>;

    const built = (async () => {
        const defaultPack = await loadRawPack(defaultLocale, namespace, true);
        const selectedPack =
            selectedLocale === defaultLocale
                ? defaultPack
                : await loadRawPack(selectedLocale, namespace, false);

        const merged: RawPack = { ...defaultPack, ...selectedPack };

        const handler: ProxyHandler<RawPack> = {
            get(target, prop) {
                if (typeof prop === "string") {
                    return prop in target ? target[prop] : prop;
                }
                return Reflect.get(target, prop);
            },
        };

        return new Proxy(merged, handler) as unknown as DictionaryMap[N];
    })();

    dictCache.set(cacheKey, built);
    return built as Promise<DictionaryMap[N]>;
}