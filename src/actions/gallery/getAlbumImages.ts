"use server";
import { cache } from "react";
import { db } from "@/lib/firebase";
import { timestampToDate } from "@/utils/timestampToDate";
import { GalleryImageType } from "./saveGalleryImage";

export interface AlbumDetailsType {
    id: string;
    albumSlug: string;
    name: string;
    timestamp: Date;
    imageCount: number;
}

export interface PaginatedImagesResponse {
    images: GalleryImageType[];
    hasMore: boolean;
    total: number;
}

export const getAlbumDetails = cache(async (albumSlug: string): Promise<AlbumDetailsType | null> => {
    try {
        const slugQuery = await db.collection("gallery")
            .where("albumSlug", "==", albumSlug)
            .limit(1)
            .get();
        
        if (slugQuery.empty) {
            return null;
        }

        const albumDoc = slugQuery.docs[0];
        const albumData = albumDoc.data();
        const imagesSnapshot = await albumDoc.ref.collection("images").count().get();
        
        return {
            id: albumDoc.id,
            albumSlug: albumData?.albumSlug || "",
            name: albumData?.name || "Unknown Album",
            timestamp: timestampToDate(albumData?.timestamp),
            imageCount: imagesSnapshot.data().count
        };
    } catch (error) {
        return null;
    }
});

export const getAlbumImages = async (
    albumSlug: string, 
    limit: number = 20, 
    startAfter?: Date
): Promise<PaginatedImagesResponse> => {
    try {
        const slugQuery = await db.collection("gallery")
            .where("albumSlug", "==", albumSlug)
            .limit(1)
            .get();
        
        if (slugQuery.empty) {
            return {
                images: [],
                hasMore: false,
                total: 0
            };
        }
        
        const albumId = slugQuery.docs[0].id;

        let query = db
            .collection("gallery")
            .doc(albumId)
            .collection("images")
            .orderBy("timestamp", "desc")
            .limit(limit + 1); // Fetch one extra to check if there are more

        if (startAfter) {
            query = query.startAfter(startAfter);
        }

        const snapshot = await query.get();
        const hasMore = snapshot.docs.length > limit;
        const images = snapshot.docs.slice(0, limit).map(doc => {
            const data = doc.data() as GalleryImageType;
            return {
                ...data,
                id: doc.id,
                timestamp: timestampToDate(data.timestamp)
            };
        });

        // Get total count
        const totalSnapshot = await db
            .collection("gallery")
            .doc(albumId)
            .collection("images")
            .count()
            .get();

        return {
            images,
            hasMore,
            total: totalSnapshot.data().count
        };
    } catch (error) {
        return {
            images: [],
            hasMore: false,
            total: 0
        };
    }
};

// Get single image by slug
export const getImageBySlug = cache(async (
    albumSlug: string,
    imageSlug: string
): Promise<GalleryImageType | null> => {
    try {
        const slugQuery = await db.collection("gallery")
            .where("albumSlug", "==", albumSlug)
            .limit(1)
            .get();
        
        if (slugQuery.empty) {
            return null;
        }
        
        const albumId = slugQuery.docs[0].id;

        const imageSlugQuery = await db
            .collection("gallery")
            .doc(albumId)
            .collection("images")
            .where("imageSlug", "==", imageSlug)
            .limit(1)
            .get();

        if (imageSlugQuery.empty) {
            return null;
        }
        
        const imageDoc = imageSlugQuery.docs[0];

        const data = imageDoc.data() as GalleryImageType;
        return {
            ...data,
            id: imageDoc.id,
            timestamp: timestampToDate(data.timestamp)
        };
    } catch (error) {
        return null;
    }
});
