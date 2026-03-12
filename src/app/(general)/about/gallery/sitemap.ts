import type { MetadataRoute } from "next";
import { getGallerySnapshot } from "@/actions/gallery/getGalleryData";
import appBaseUrl from "@/data/appBaseUrl";
import { GalleryImageType } from "@/types/gallery.types";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { albums, images } = await getGallerySnapshot();

    const albumMap = new Map(
        albums.map((album) => [album.id, album])
    );

    const albumRoutes: MetadataRoute.Sitemap = albums.map((album) => ({
        url: new URL(
            `/about/gallery/${album.slug}`,
            appBaseUrl
        ).toString(),
        lastModified: album.timestamp,
        changeFrequency: "weekly",
        priority: album.imageCount > 10 ? 0.7 : 0.6,
    }));

    const imageRoutes: MetadataRoute.Sitemap = images
        .filter(
            (image): image is GalleryImageType & { albumId: string } =>
                !!image.albumId && albumMap.has(image.albumId)
        )
        .map((image) => {
            const album = albumMap.get(image.albumId)!;

            return {
                url: new URL(
                    `/about/gallery/${album.slug}/${image.slug}`,
                    appBaseUrl
                ).toString(),
                lastModified: image.timestamp,
                changeFrequency: "monthly",
                priority: 0.4,
                images: [image.src],
            };
        });

    return [...albumRoutes, ...imageRoutes];
}