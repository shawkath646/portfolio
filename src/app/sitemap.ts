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
    ];

    // Album pages
    const albumRoutes: MetadataRoute.Sitemap = albums.map<MetadataRoute.Sitemap[number]>(({ id, timestamp }) => ({
        url: `${baseUrl}/about/gallery/${id}`,
        lastModified: timestamp,
        changeFrequency: "weekly",
        priority: 0.6,
    }));

    // Image preview URLs with image sitemap data
    const imageRoutes: MetadataRoute.Sitemap = images.map<MetadataRoute.Sitemap[number]>(({ 
        albumId, 
        imageId, 
        src,
        timestamp 
    }) => ({
        url: `${baseUrl}/about/gallery/${albumId}?preview=${imageId}`,
        lastModified: timestamp,
        changeFrequency: "monthly",
        priority: 0.5,
        images: [src],
    }));

    return [...staticRoutes, ...albumRoutes, ...imageRoutes];
}
