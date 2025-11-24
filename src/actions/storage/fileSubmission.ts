"use server";

import { bucket, db } from "@/lib/firebase";
import { generateStoragePath, generateSignedDownloadURL, MAX_FILE_SIZE } from "./storageUtils";

interface FileSubmissionData {
    fileName: string;
    fileSize: number;
    fileType: string;
    fileData: string;
    senderName: string;
    message?: string;
}

export async function submitFile(data: FileSubmissionData): Promise<{ success: boolean; fileId?: string; error?: string }> {
    try {
        if (data.fileSize > MAX_FILE_SIZE) {
            return { success: false, error: "File size exceeds 100MB limit" };
        }

        if (!data.senderName.trim()) {
            return { success: false, error: "Sender name is required" };
        }

        const matches = data.fileData.match(/^data:(.+);base64,(.*)$/);
        if (!matches || matches.length !== 3) {
            return { success: false, error: "Invalid file format" };
        }

        const contentType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");
        const storagePath = await generateStoragePath("submissions", data.fileName);
        const file = bucket.file(storagePath);

        await file.save(buffer, {
            metadata: {
                contentType,
                metadata: {
                    uploadedBy: data.senderName,
                    originalName: data.fileName,
                    uploadedAt: new Date().toISOString()
                }
            },
        });

        const downloadURL = await generateSignedDownloadURL(storagePath);

        const docRef = await db.collection("file-submissions").add({
            fileName: data.fileName,
            fileSize: data.fileSize,
            fileType: data.fileType,
            storagePath,
            downloadURL,
            senderName: data.senderName.trim(),
            message: data.message?.trim() || null,
            uploadedAt: new Date().toISOString(),
            status: "pending",
            reviewed: false,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });

        return { success: true, fileId: docRef.id };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to submit file" };
    }
}
