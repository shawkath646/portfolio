"use server";

import { db } from "@/lib/firebase";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

interface SharedFileUpload {
    id: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    downloadURL: string;
    uploadedAt: string;
    userNote?: string;
}

export async function addFileToUserTracking(fileId: string): Promise<void> {
    const cookieStore = await cookies();
    const existingToken = cookieStore.get("shared_files");
    let fileIds: string[] = [];
    
    if (existingToken) {
        try {
            const { payload } = await jwtVerify(existingToken.value, JWT_SECRET);
            fileIds = (payload.fileIds as string[]) || [];
        } catch {
            fileIds = [];
        }
    }

    if (!fileIds.includes(fileId)) {
        fileIds.push(fileId);
    }

    const token = await new SignJWT({ fileIds })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("365d")
        .sign(JWT_SECRET);

    cookieStore.set("shared_files", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 365 * 24 * 60 * 60,
        path: "/",
    });
}

export async function getUserFileIds(): Promise<string[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("shared_files");

    if (!token) return [];

    try {
        const { payload } = await jwtVerify(token.value, JWT_SECRET);
        return (payload.fileIds as string[]) || [];
    } catch {
        return [];
    }
}

export async function getSharedFileUploads(): Promise<{ success: boolean; uploads?: SharedFileUpload[]; error?: string }> {
    try {
        const fileIds = await getUserFileIds();

        if (fileIds.length === 0) {
            return { success: true, uploads: [] };
        }

        const uploads: SharedFileUpload[] = [];
        
        for (const fileId of fileIds) {
            try {
                const doc = await db.collection("file-uploads").doc(fileId).get();
                
                if (doc.exists) {
                    const data = doc.data()!;
                    uploads.push({
                        id: doc.id,
                        fileName: data.fileName,
                        fileSize: data.fileSize,
                        fileType: data.fileType,
                        downloadURL: data.downloadURL,
                        uploadedAt: data.uploadedAt?.toDate().toISOString() || new Date().toISOString(),
                        userNote: data.userNote || undefined,
                    });
                }
            } catch {
                continue;
            }
        }

        uploads.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

        return { success: true, uploads };
    } catch (error: any) {
        return { success: false, error: `Failed to fetch uploads: ${error.message}` };
    }
}
