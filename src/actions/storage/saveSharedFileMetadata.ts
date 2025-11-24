"use server";

import { db } from "@/lib/firebase";
import { Timestamp } from "firebase-admin/firestore";
import { addFileToUserTracking } from "./getSharedFileUploads";
import { revalidatePath } from "next/cache";
import { generateSignedDownloadURL, verifyFileExists } from "./storageUtils";

interface FileMetadata {
    storagePath: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    lastModified?: number;
    userNote?: string;
}

interface SaveMetadataResult {
    success: boolean;
    fileId?: string;
    downloadURL?: string;
    error?: string;
}

export async function saveSharedFileMetadata(metadata: FileMetadata): Promise<SaveMetadataResult> {
    try {
        const { storagePath, fileName, fileSize, fileType, lastModified, userNote } = metadata;

        if (!storagePath || !fileName) {
            return { success: false, error: "Storage path and file name are required" };
        }

        const exists = await verifyFileExists(storagePath);
        if (!exists) {
            return { success: false, error: "File not found in storage" };
        }

        const downloadURL = await generateSignedDownloadURL(storagePath);

        const uploadData = {
            storagePath,
            fileName,
            fileSize,
            fileType,
            lastModified: lastModified ? Timestamp.fromMillis(lastModified) : null,
            userNote: userNote || null,
            downloadURL,
            uploadedAt: Timestamp.now(),
            reviewed: false,
            reviewedAt: null,
            reviewedBy: null,
        };

        const docRef = await db.collection("file-uploads").add(uploadData);
        await addFileToUserTracking(docRef.id);
        revalidatePath("/share");

        return { success: true, fileId: docRef.id, downloadURL };
    } catch (error: any) {
        return { success: false, error: `Failed to save metadata: ${error.message}` };
    }
}
