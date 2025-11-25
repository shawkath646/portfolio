import type { MetadataRoute } from "next";
import { getGalleryAlbumsForSitemap, getGalleryImagesForSitemap } from "@/actions/gallery/albumManagement";

const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || "https://shawkath646.pro";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const albums = await getGalleryAlbumsForSitemap();
    const images = await getGalleryImagesForSitemap();

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about/gallery`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.6,
        },
        {
            url: `${baseUrl}/share`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    // Album pages
    const albumRoutes: MetadataRoute.Sitemap = albums.map<MetadataRoute.Sitemap[number]>(({ albumSlug, timestamp }) => ({
        url: `${baseUrl}/about/gallery/${albumSlug}`,
        lastModified: timestamp,
        changeFrequency: "weekly",
        priority: 0.6,
    }));

    // Individual image pages - with noindex robots meta
    const imageRoutes: MetadataRoute.Sitemap = images.map<MetadataRoute.Sitemap[number]>(({ 
        albumSlug,
        imageSlug,
        src,
        timestamp 
    }) => ({
        url: `${baseUrl}/about/gallery/${albumSlug}/${imageSlug}`,
        lastModified: timestamp,
        changeFrequency: "monthly",
        priority: 0.4,
        images: [src],
    }));

    return [...staticRoutes, ...albumRoutes, ...imageRoutes];
}
