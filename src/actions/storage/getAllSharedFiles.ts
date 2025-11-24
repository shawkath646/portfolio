"use server";

import { db } from "@/lib/firebase";

export interface SharedFileUpload {
    id: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    storagePath: string;
    downloadURL: string;
    uploadedAt: string;
    userNote?: string;
    reviewed: boolean;
}

export async function getAllSharedFiles(): Promise<{ success: boolean; files?: SharedFileUpload[]; error?: string }> {
    try {
        const snapshot = await db.collection("file-uploads").orderBy("uploadedAt", "desc").get();
        
        const files: SharedFileUpload[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                fileName: data.fileName,
                fileSize: data.fileSize,
                fileType: data.fileType,
                storagePath: data.storagePath,
                downloadURL: data.downloadURL,
                uploadedAt: data.uploadedAt?.toDate().toISOString() || new Date().toISOString(),
                userNote: data.userNote || undefined,
                reviewed: data.reviewed || false,
            };
        });

        return { success: true, files };
    } catch (error: any) {
        return { success: false, error: `Failed to fetch files: ${error.message}` };
    }
}
