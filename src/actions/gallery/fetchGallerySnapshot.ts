"use server";
import { cache } from "react";
import { db } from "@/lib/firebase";
import { timestampToDate } from "@/utils/timestampToDate";
import { GalleryImageType } from "./uploadImage";

export const fetchGallerySnapshot = cache(async (limit: number = 15): Promise<GalleryImageType[]> => {
    try {
        // Get all albums
        const albumsSnapshot = await db.collection("gallery").get();
        
        if (albumsSnapshot.empty) {
            return [];
        }

        // Collect all images from all albums
        const allImages: GalleryImageType[] = [];

        for (const albumDoc of albumsSnapshot.docs) {
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
                    timestamp: timestampToDate(data.timestamp)
                };
            });

            allImages.push(...albumImages);
        }

        // Sort all images by timestamp (newest first) and return limited number
        const sortedImages = allImages
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit);

        return sortedImages;
    } catch (error) {
        console.error("Error fetching gallery snapshot:", error);
        return [];
    }
});
