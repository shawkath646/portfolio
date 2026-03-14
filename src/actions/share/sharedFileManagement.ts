"use server";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt, JWTPayload } from "jose";
import { bucket, db } from "@/lib/firebase";
import { APIResponseType } from "@/types/common.types";
import { SharedFileType } from "@/types/share.types";
import { getEnv } from "@/utils/getEnv";
import getErrorMessage from "@/utils/getErrorMessage";
import { generateSignedUploadURL, verifyFileExists } from "@/utils/storage";
import { getAuthSession } from "../authentication/authActions";

const secret = new TextEncoder().encode(getEnv("SHARED_FILE_COOKIE_SECRET"));

interface RequestFileUploadURLParams {
    fileType: string;
    fileSize: number;
}

interface RequestUploadURLResult extends APIResponseType {
    fileId?: string;
    uploadURL?: string;
}

const MAX_FILE_SIZE = 500 * 1024 * 1024;

export async function requestSharedFileUploadURL(
    { fileType, fileSize }: RequestFileUploadURLParams
): Promise<RequestUploadURLResult> {

    if (fileSize <= 0 || fileSize > MAX_FILE_SIZE) {
        return { success: false, message: "Error: File size exceeds 500MB limit" };
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

type SaveSharedFilesProps = Omit<SharedFileType, "timestamp" | "reviewed">;

export async function saveSharedFile(
    props: SaveSharedFilesProps
): Promise<APIResponseType> {

    const storagePath = `shared-files/${props.id}`;

    const fileExist = await verifyFileExists(storagePath);
    if (!fileExist) {
        return {
            success: false,
            message: "Error: File not uploaded to server."
        };
    }

    const fileObj: SharedFileType = {
        ...props,
        reviewed: false,
        timestamp: new Date()
    };

    await db.collection("shared-files").doc(props.id).set(fileObj);

    const cookieList = await cookies();
    const fileCookie = cookieList.get("sfc");

    let existingIds: string[] = [];

    if (fileCookie && fileCookie.value) {
        try {
            const { payload } = await jwtDecrypt<JWTPayload & { fileIdList: string[] }>(
                fileCookie.value,
                secret
            );

            if (payload.fileIdList) {
                existingIds = payload.fileIdList;
            }
        } catch { }
    }

    const uniqueIds = Array.from(new Set([...existingIds, props.id]));

    const newToken = await new EncryptJWT({ fileIdList: uniqueIds })
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .encrypt(secret);

    cookieList.set("sfc", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30
    });

    revalidatePath("/contact/share-files");
    revalidatePath("/admin/shared-files");

    return {
        success: true,
        message: "File uploaded to server"
    };
}

export async function deleteSharedFile(fileId: string): Promise<APIResponseType> {
    const adminSession = await getAuthSession();
    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found."
        };
    };

    try {
        const storagePath = `shared-files/${fileId}`;

        await bucket.file(storagePath).delete();
        await db.collection("shared-files").doc(fileId).delete();
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error) || "Error: Failed to delete file."
        }
    }

    revalidatePath("/contact/share-files");
    revalidatePath("/admin/shared-files");

    return {
        success: true,
        message: "File deleted successfully."
    }
};