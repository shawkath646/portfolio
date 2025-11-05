"use server";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { db } from "@/lib/firebase";
import { timestampToDate } from "@/utils/timestampToDate";


export interface GalleryAlbumType {
    id: string;
    name: string;
    timestamp: Date;
    imageCount?: number;
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

// For sitemap generation - returns albums with IDs
export const getGalleryAlbumsForSitemap = cache(async (): Promise<Array<{ id: string, name: string, timestamp: Date }>> => {
    const albumSnapshot = await db.collection("gallery").get();
    const albums = albumSnapshot.docs.map((doc) => {
        const albumData = doc.data();
        return {
            id: doc.id,
            name: albumData.name || "Untitled Album",
            timestamp: timestampToDate(albumData.timestamp)
        };
    });

    return albums;
});

export const getGalleryImagesForSitemap = cache(async (): Promise<Array<{
    albumId: string,
    imageId: string,
    src: string,
    title: string,
    alt: string,
    location?: string,
    timestamp: Date
}>> => {
    const albumSnapshot = await db.collection("gallery").get();
    const images: Array<{
        albumId: string,
        imageId: string,
        src: string,
        title: string,
        alt: string,
        location?: string,
        timestamp: Date
    }> = [];

    for (const albumDoc of albumSnapshot.docs) {
        const imagesSnapshot = await albumDoc.ref.collection("images").get();
        
        imagesSnapshot.docs.forEach((imageDoc) => {
            const imageData = imageDoc.data();
            images.push({
                albumId: albumDoc.id,
                imageId: imageDoc.id,
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
    const albumObject: GalleryAlbumType = {
        id: docRef.id,
        name: albumName,
        timestamp: new Date()
    }
    await docRef.set(albumObject);
    revalidatePath("/admin/gallery");
    return docRef.id;
};

export const updateAlbum = async (albumId: string, newName: string) => {
    await db.collection("gallery").doc(albumId).set({ name: newName }, { merge: true });
    revalidatePath("/admin/gallery");
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
};