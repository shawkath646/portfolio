"use server";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { db } from "@/lib/firebase";
import { timestampToDate } from "@/utils/timestampToDate";


export interface GalleryAlbumType {
    id: string;
    albumSlug: string;
    name: string;
    timestamp: Date;
    imageCount?: number;
}

// Helper function to generate slug from text
function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export const getGalleryAlbums = cache(async (): Promise<GalleryAlbumType[]> => {
    const albumSnapshot = await db.collection("gallery").get();
    const albumList = await Promise.all(albumSnapshot.docs.map(async (doc) => {
        const album = doc.data() as GalleryAlbumType;
        album.timestamp = timestampToDate(album.timestamp);
        
        const imagesSnapshot = await doc.ref.collection("images").count().get();
        album.imageCount = imagesSnapshot.data().count;
        
        return album;
    }));

    return albumList;
});

// Get album by slug (new function for slug-based routing)
export const getAlbumBySlug = cache(async (albumSlug: string): Promise<GalleryAlbumType | null> => {
    try {
        const albumSnapshot = await db.collection("gallery")
            .where("albumSlug", "==", albumSlug)
            .limit(1)
            .get();
        
        if (albumSnapshot.empty) {
            return null;
        }

        const doc = albumSnapshot.docs[0];
        const album = doc.data() as GalleryAlbumType;
        album.timestamp = timestampToDate(album.timestamp);
        
        const imagesSnapshot = await doc.ref.collection("images").count().get();
        album.imageCount = imagesSnapshot.data().count;
        
        return album;
    } catch (error) {
        console.error("Error fetching album by slug:", error);
        return null;
    }
});

// For sitemap generation - returns albums with IDs and slugs
export const getGalleryAlbumsForSitemap = cache(async (): Promise<Array<{ id: string, albumSlug: string, name: string, timestamp: Date }>> => {
    const albumSnapshot = await db.collection("gallery").get();
    const albums = albumSnapshot.docs.map((doc) => {
        const albumData = doc.data();
        return {
            id: doc.id,
            albumSlug: albumData.albumSlug || generateSlug(albumData.name || "untitled-album"),
            name: albumData.name || "Untitled Album",
            timestamp: timestampToDate(albumData.timestamp)
        };
    });

    return albums;
});

export const getGalleryImagesForSitemap = cache(async (): Promise<Array<{
    albumId: string,
    albumSlug: string,
    imageId: string,
    imageSlug: string,
    src: string,
    title: string,
    alt: string,
    location?: string,
    timestamp: Date
}>> => {
    const albumSnapshot = await db.collection("gallery").get();
    const images: Array<{
        albumId: string,
        albumSlug: string,
        imageId: string,
        imageSlug: string,
        src: string,
        title: string,
        alt: string,
        location?: string,
        timestamp: Date
    }> = [];

    for (const albumDoc of albumSnapshot.docs) {
        const albumData = albumDoc.data();
        const albumSlug = albumData.albumSlug || generateSlug(albumData.name || "untitled-album");
        
        const imagesSnapshot = await albumDoc.ref.collection("images").get();
        
        imagesSnapshot.docs.forEach((imageDoc) => {
            const imageData = imageDoc.data();
            images.push({
                albumId: albumDoc.id,
                albumSlug: albumSlug,
                imageId: imageDoc.id,
                imageSlug: imageData.imageSlug || generateSlug(imageData.title || "untitled-image"),
                src: imageData.src || "",
                title: imageData.title || "Untitled",
                alt: imageData.alt || imageData.title || "Image",
                location: imageData.location,
                timestamp: timestampToDate(imageData.timestamp)
            });
        });
    }

    return images;
});

export const createAlbum = async (albumName: string) => {
    const docRef = db.collection("gallery").doc();
    const albumSlug = generateSlug(albumName);
    
    const albumObject: GalleryAlbumType = {
        id: docRef.id,
        albumSlug: albumSlug,
        name: albumName,
        timestamp: new Date()
    }
    await docRef.set(albumObject);
    revalidatePath("/admin/gallery");
    revalidatePath("/about/gallery");
    return { id: docRef.id, albumSlug };
};

export const updateAlbum = async (albumId: string, newName: string) => {
    const newSlug = generateSlug(newName);
    await db.collection("gallery").doc(albumId).set({ 
        name: newName,
        albumSlug: newSlug 
    }, { merge: true });
    revalidatePath("/admin/gallery");
    revalidatePath("/about/gallery");
};

export const deleteAlbum = async (albumId: string) => {
    const docRef = db.collection("gallery").doc(albumId);
    const collectionList = await docRef.listCollections();

    for (const collection of collectionList) {
        let snapshot;
        do {
            snapshot = await collection.limit(100).get();
            if (snapshot.empty) {
                break;
            }

            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();

        } while (!snapshot.empty);
    }
    await docRef.delete();
    revalidatePath("/admin/gallery");
    revalidatePath("/about/gallery");
};