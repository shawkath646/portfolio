import type { MetadataRoute } from "next";
import appBaseUrl from "@/data/appBaseUrl";
import { locales } from "@/lib/locale";

type RouteConfig = {
    path: string;
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority: number;
};

const routes: RouteConfig[] = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/creations", changeFrequency: "daily", priority: 0.9 },
    { path: "/creations/projects", changeFrequency: "daily", priority: 0.8 },
    { path: "/about/gallery", changeFrequency: "weekly", priority: 0.7 },
    { path: "/about/personal-life", changeFrequency: "monthly", priority: 0.7 },
    { path: "/about/love-corner", changeFrequency: "monthly", priority: 0.7 },
    { path: "/about/friends-corner", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
    { path: "/contact/share-files", changeFrequency: "monthly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const sitemapEntries: MetadataRoute.Sitemap = [];

    routes.forEach((route) => {
        const alternateLanguages: Record<string, string> = {};
        locales.forEach((altLocale) => {
            alternateLanguages[altLocale] = new URL(`/${altLocale}${route.path}`, appBaseUrl).toString();
        });

        locales.forEach((locale) => {
            sitemapEntries.push({
                url: new URL(`/${locale}${route.path}`, appBaseUrl).toString(),
                lastModified: new Date(),
                changeFrequency: route.changeFrequency,
                priority: route.priority,
                alternates: {
                    languages: alternateLanguages,
                },
            });
        });
    });

    return sitemapEntries;
}