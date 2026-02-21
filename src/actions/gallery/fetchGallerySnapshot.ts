"use server";
import { db } from "@/lib/firebase";
import { timestampToDate } from "@/utils/dateTime";
import { GalleryImageType } from "./saveGalleryImage";

export type GallerySnapshotImage = GalleryImageType & {
    albumSlug?: string;
};

export const fetchGallerySnapshot = async (limit: number = 15): Promise<GallerySnapshotImage[]> => {
    try {
        const albumsSnapshot = await db.collection("gallery").get();
        
        if (albumsSnapshot.empty) {
            return [];
        }

        const allImages: GallerySnapshotImage[] = [];

        for (const albumDoc of albumsSnapshot.docs) {
            const albumData = albumDoc.data();
            const albumSlug = typeof albumData?.albumSlug === "string" ? albumData.albumSlug : undefined;

            const imagesSnapshot = await albumDoc.ref
                .collection("images")
                .orderBy("timestamp", "desc")
                .limit(limit)
                .get();

            const albumImages = imagesSnapshot.docs.map(doc => {
                const data = doc.data() as GalleryImageType;
                return {
                    ...data,
                    id: doc.id,
                    timestamp: timestampToDate(data.timestamp),
                    albumSlug,
                };
            });

            allImages.push(...albumImages);
        }

        const sortedImages = allImages
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit);

        return sortedImages;
    } catch {
        return [];
    }
};
