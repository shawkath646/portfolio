"use server";

import { generateStoragePath, generateSignedUploadURL, MAX_FILE_SIZE } from "../storage/storageUtils";

interface GenerateGalleryUploadURLParams {
    albumId: string;
    imageId: string;
    fileType: string;
    fileSize: number;
}

interface GenerateGalleryUploadURLResult {
    success: boolean;
    uploadURL?: string;
    storagePath?: string;
    error?: string;
}

export async function generateGalleryUploadURL(params: GenerateGalleryUploadURLParams): Promise<GenerateGalleryUploadURLResult> {
    try {
        const { albumId, imageId, fileType, fileSize } = params;

        if (!albumId || !imageId || !fileType) {
            return { success: false, error: "Album ID, image ID, and file type are required" };
        }

        if (fileSize > MAX_FILE_SIZE) {
            return { success: false, error: "File size exceeds 100MB limit" };
        }

        const storagePath = `gallery/${albumId}/${imageId}`;
        const uploadURL = await generateSignedUploadURL(storagePath, fileType);

        return { success: true, uploadURL, storagePath };
    } catch (error: any) {
        return { success: false, error: `Failed to generate upload URL: ${error.message}` };
    }
}