"use server";
import { cache } from "react";
import { db } from "@/lib/firebase";
import { timestampToDate } from "@/utils/timestampToDate";
import { GalleryImageType } from "./uploadImage";

export interface AlbumDetailsType {
    id: string;
    name: string;
    timestamp: Date;
    imageCount: number;
}

export interface PaginatedImagesResponse {
    images: GalleryImageType[];
    hasMore: boolean;
    total: number;
}

export const getAlbumDetails = cache(async (albumId: string): Promise<AlbumDetailsType | null> => {
    try {
        const albumDoc = await db.collection("gallery").doc(albumId).get();
        
        if (!albumDoc.exists) {
            return null;
        }

        const albumData = albumDoc.data();
        const imagesSnapshot = await albumDoc.ref.collection("images").count().get();
        
        return {
            id: albumDoc.id,
            name: albumData?.name || "Unknown Album",
            timestamp: timestampToDate(albumData?.timestamp),
            imageCount: imagesSnapshot.data().count
        };
    } catch (error) {
        console.error("Error fetching album details:", error);
        return null;
    }
});

export const getAlbumImages = async (
    albumId: string, 
    limit: number = 20, 
    startAfter?: Date
): Promise<PaginatedImagesResponse> => {
    try {
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
        console.error("Error fetching album images:", error);
        return {
            images: [],
            hasMore: false,
            total: 0
        };
    }
};
