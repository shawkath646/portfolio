import { bucket } from "@/lib/firebase";

export const MAX_FILE_SIZE = 100 * 1024 * 1024;
export const SIGNED_URL_EXPIRY_DAYS = 7;
export const UPLOAD_URL_EXPIRY_MINUTES = 15;

export function sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function generateStoragePath(prefix: string, fileName: string): string {
    const timestamp = Date.now();
    const sanitized = sanitizeFileName(fileName);
    return `${prefix}/${timestamp}_${sanitized}`;
}

export async function generateSignedUploadURL(
    storagePath: string,
    contentType: string,
    expiryMinutes: number = UPLOAD_URL_EXPIRY_MINUTES
): Promise<string> {
    const file = bucket.file(storagePath);
    const [uploadURL] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + expiryMinutes * 60 * 1000,
        contentType,
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

export async function verifyFileExists(storagePath: string): Promise<boolean> {
    const file = bucket.file(storagePath);
    const [exists] = await file.exists();
    return exists;
}
