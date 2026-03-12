"use server";
import { bucket } from "@/lib/firebase";
import { sanitizeStr } from "./string";

const SIGNED_URL_EXPIRY_DAYS = 7;
const DEFAULT_UPLOAD_URL_EXPIRY_MS = 900000;


export async function generateStoragePath(prefix: string, fileName: string): Promise<string> {
    const timestamp = Date.now();
    const sanitized = sanitizeStr(fileName);
    return `${prefix}/${timestamp}_${sanitized}`;
}

interface GenerateSignedUploadURLProps {
    storagePath: string;
    contentType: string;
    maxSizeBytes: number;
    expiryMs?: number; 
}

export async function generateSignedUploadURL({
    storagePath,
    contentType,
    maxSizeBytes,
    expiryMs = DEFAULT_UPLOAD_URL_EXPIRY_MS,
}: GenerateSignedUploadURLProps): Promise<string> {
    
    const file = bucket.file(storagePath);
    
    const [uploadURL] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + expiryMs,
        contentType,
        extensionHeaders: {
            'x-goog-content-length-range': `0,${maxSizeBytes}`,
        },
    });
    
    return uploadURL;
}

export async function generateSignedDownloadURL(
    storagePath: string,
    expiryDays: number = SIGNED_URL_EXPIRY_DAYS
): Promise<string> {
    const file = bucket.file(storagePath);
    const [downloadURL] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + expiryDays * 24 * 60 * 60 * 1000,
    });

    return downloadURL;
}

export async function generatePublicUrl(storagePath: string) {
    const file = bucket.file(storagePath);
    await file.makePublic();

    const downloadURL = file.publicUrl();
    return downloadURL;
}

export async function verifyFileExists(storagePath: string): Promise<boolean> {
    const file = bucket.file(storagePath);
    const [exists] = await file.exists();
    return exists;
}
