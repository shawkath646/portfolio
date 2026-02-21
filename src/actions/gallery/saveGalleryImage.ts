"use server";

import { revalidatePath } from "next/cache";
import { db, bucket } from "@/lib/firebase";
import getErrorMessage from "@/utils/getErrorMessage";
import { verifyFileExists } from "../storage/storageUtils";

export interface GalleryImageType {
    id: string;
    imageSlug: string;
    title: string;
    description: string;
    location: string;
    alt: string;
    timestamp: Date;
    src: string;
    height: number;
    width: number;
}

interface SaveGalleryImageParams {
    albumId: string;
    imageId: string;
    storagePath: string;
    metadata: Omit<GalleryImageType, 'id' | 'src'>;
}


interface SaveGalleryImageResult {
    success: boolean;
    imageId?: string;
    publicURL?: string;
    error?: string;
}

export async function saveGalleryImage(params: SaveGalleryImageParams): Promise<SaveGalleryImageResult> {
    try {
        const { albumId, imageId, storagePath, metadata } = params;

        if (!albumId || !imageId || !storagePath) {
            return { success: false, error: "Album ID, image ID, and storage path are required" };
        }

        const exists = await verifyFileExists(storagePath);
        if (!exists) {
            return { success: false, error: "File not found in storage" };
        }

        const file = bucket.file(storagePath);
        await file.makePublic();
        const publicURL = file.publicUrl();

        const imageObject: GalleryImageType = {
            id: imageId,
            src: publicURL,
            ...metadata,
        };

        await db.collection("gallery").doc(albumId).collection("images").doc(imageId).set(imageObject);
        revalidatePath("/admin/gallery");
        revalidatePath(`/admin/gallery/${albumId}`);
        revalidatePath("/about/gallery");

        return { success: true, imageId, publicURL };
    } catch (error) {
        return { success: false, error: `Failed to save image: ${getErrorMessage(error)}` };
    }
}