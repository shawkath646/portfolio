import type { MetadataRoute } from "next";
import appBaseUrl from "@/data/appBaseUrl";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: appBaseUrl.origin,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: new URL("/about", appBaseUrl).toString(),
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: new URL("/creations", appBaseUrl).toString(),
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: new URL("/creations/projects", appBaseUrl).toString(),
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: new URL("/about/gallery", appBaseUrl).toString(),
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: new URL("/about/personal-life", appBaseUrl).toString(),
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: new URL("/about/love-corner", appBaseUrl).toString(),
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: new URL("/about/friends-corner", appBaseUrl).toString(),
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: new URL("/contact", appBaseUrl).toString(),
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.6,
        },
        {
            url: new URL("/share", appBaseUrl).toString(),
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];
}
