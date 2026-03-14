"use server";
import { bucket } from "@/lib/firebase";

const DEFAULT_DOWNLOAD_URL_EXPIRY_MS = 1 * 60 * 60 * 1000; // 1hour
const DEFAULT_UPLOAD_URL_EXPIRY_MS = 5 * 60 * 1000; // 5min


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
    { expireIn = DEFAULT_DOWNLOAD_URL_EXPIRY_MS }: { expireIn?: number }
): Promise<string> {
    const file = bucket.file(storagePath);
    const [downloadURL] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + expireIn,
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
