import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/locale";
import { getGallerySnapshot } from "@/actions/gallery/getGalleryData";
import { GalleryImageType } from "@/types/gallery.types";
import appBaseUrl from "@/data/appBaseUrl";
import { SKILLS_LIST } from "@/data/skillsData";

export const revalidate = 3600;

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

type RouteConfig = {
    path: string;
    changeFrequency: ChangeFrequency;
    priority: number;
    lastModified?: Date;
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

function absoluteUrl(locale: string, path: string): string {
    return new URL(`/${locale}${path}`, appBaseUrl).toString();
}

function buildAlternates(path: string): Record<string, string> {
    const alternates: Record<string, string> = {};
    for (const altLocale of locales) {
        alternates[altLocale] = absoluteUrl(altLocale, path);
    }
    alternates["x-default"] = absoluteUrl("en", path);
    return alternates;
}

function createLocalizedEntries(
    path: string,
    meta: {
        lastModified?: Date;
        changeFrequency: ChangeFrequency;
        priority: number;
        images?: string[];
    }
): MetadataRoute.Sitemap {
    const alternates = buildAlternates(path);

    return (locales as readonly Locale[]).map((locale) => ({
        url: alternates[locale],
        lastModified: meta.lastModified,
        changeFrequency: meta.changeFrequency,
        priority: meta.priority,
        images: meta.images,
        alternates: { languages: alternates },
    }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Base Routes
    for (const route of routes) {
        sitemapEntries.push(
            ...createLocalizedEntries(route.path, {
                lastModified: route.lastModified,
                changeFrequency: route.changeFrequency,
                priority: route.priority,
            })
        );
    }

    // Dynamic Skill Routes
    for (const skill of SKILLS_LIST) {
        sitemapEntries.push(
            ...createLocalizedEntries(`/about/skills/${skill.slug}`, {
                changeFrequency: "monthly",
                priority: 0.7,
            })
        );
    }

    try {
        const { albums, images } = await getGallerySnapshot();
        const albumMap = new Map(albums.map((album) => [album.id, album]));

        for (const album of albums) {
            sitemapEntries.push(
                ...createLocalizedEntries(`/about/gallery/${album.slug}`, {
                    lastModified: album.timestamp,
                    changeFrequency: "weekly",
                    priority: album.imageCount > 10 ? 0.7 : 0.6,
                })
            );
        }

        const galleryImages = images.filter(
            (image): image is GalleryImageType & { albumId: string } =>
                !!image.albumId && albumMap.has(image.albumId)
        );

        for (const image of galleryImages) {
            const album = albumMap.get(image.albumId)!;
            sitemapEntries.push(
                ...createLocalizedEntries(`/about/gallery/${album.slug}/${image.slug}`, {
                    lastModified: image.timestamp,
                    changeFrequency: "monthly",
                    priority: 0.4,
                    images: image.images.map((item) => new URL(item.src, appBaseUrl).toString()),
                })
            );
        }
    } catch (err) {
        console.error("sitemap: failed to load gallery snapshot, returning base routes only", err);
    }

    return sitemapEntries;
}