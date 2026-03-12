"use server";
import crypto from "crypto";
import { APIResponseType } from "@/types/common.types";
import { generateSignedUploadURL } from "@/utils/storage";

interface RequestFileUploadURLParams {
    fileType: string;
    fileSize: number;
}

interface RequestUploadURLResult extends APIResponseType {
    fileId?: string;
    uploadURL?: string;
}

const MAX_FILE_SIZE = 250 * 1024 * 1024;

export async function requestSharedFileUploadURL(
    { fileType, fileSize }: RequestFileUploadURLParams
): Promise<RequestUploadURLResult> {

    if (fileSize <= 0 || fileSize > MAX_FILE_SIZE) {
        return { success: false, message: "Error: File size exceeds 250MB limit" };
    }

    const fileId = crypto.randomUUID()
    const storagePath = `shared-files/${fileId}`;

    const uploadURL = await generateSignedUploadURL({
        storagePath,
        contentType: fileType,
        maxSizeBytes: fileSize
    });

    return {
        success: true,
        message: "Upload URL generated.",
        fileId,
        uploadURL
    };
}

