"use server";

import { generateStoragePath, generateSignedUploadURL, MAX_FILE_SIZE } from "./storageUtils";

interface GenerateUploadURLParams {
    fileName: string;
    fileType: string;
    fileSize: number;
}

interface GenerateUploadURLResult {
    success: boolean;
    uploadURL?: string;
    storagePath?: string;
    error?: string;
}

export async function generateSharedFileUploadURL(params: GenerateUploadURLParams): Promise<GenerateUploadURLResult> {
    try {
        const { fileName, fileType, fileSize } = params;

        if (!fileName || !fileType) {
            return { success: false, error: "File name and type are required" };
        }

        if (fileSize > MAX_FILE_SIZE) {
            return { success: false, error: "File size exceeds 100MB limit" };
        }

        const storagePath = await generateStoragePath("uploads", fileName);
        const uploadURL = await generateSignedUploadURL(storagePath, fileType);

        return { success: true, uploadURL, storagePath };
    } catch (error: any) {
        return { success: false, error: `Failed to generate upload URL: ${error.message}` };
    }
}
