"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Query } from "firebase-admin/firestore";
import { jwtDecrypt } from "jose";
import { db } from "@/lib/firebase";
import { APIResponseType, CursorPaginationOptions } from "@/types/common.types";
import { SharedFileType } from "@/types/share.types";
import { timestampToDate } from "@/utils/dateTime";
import { getEnv } from "@/utils/getEnv";
import { generateSignedDownloadURL, verifyFileExists } from "@/utils/storage";
import { getAuthSession } from "../authentication/authActions";

const secret = new TextEncoder().encode(getEnv("SHARED_FILE_COOKIE_SECRET"));

export const getAllSharedFiles = cache(
    async ({ limit = 20, startAfter }: CursorPaginationOptions = {}): Promise<SharedFileType[]> => {

        const adminSession = await getAuthSession();
        if (!adminSession) {
            throw new Error("Error: Permission denied! Session not found.");
        }

        let query: Query = db.collection("shared-files").orderBy("timestamp", "desc");

        if (startAfter) {
            query = query.startAfter(startAfter);
        }

        const sharedFileSnapshot = await query.limit(limit).get();

        return sharedFileSnapshot.docs.map(doc => {
            const data = doc.data();

            return {
                ...data,
                timestamp: timestampToDate(data.timestamp),
            } as SharedFileType;
        });
    }
);

export const getSelfSharedFiles = cache(async (): Promise<SharedFileType[]> => {
    const cookieList = await cookies();
    const fileCookie = cookieList.get("sfc");

    if (!fileCookie || !fileCookie.value) return [];

    try {
        const { payload } = await jwtDecrypt(fileCookie.value, secret);

        const fileIds = (payload.fileIdList as string[]) || [];
        if (fileIds.length === 0) return [];

        const docRefs = fileIds.map(id => db.collection("shared-files").doc(id));
        const snapshots = await db.getAll(...docRefs);

        const sharedFiles = snapshots
            .filter(snap => snap.exists)
            .map(snap => {
                const data = snap.data() as SharedFileType;

                return {
                    ...data,
                    timestamp: timestampToDate(data.timestamp),
                } as SharedFileType;
            });

        return sharedFiles;

    } catch (error) {
        console.error("Failed to fetch self-shared files:", error);
        cookieList.delete("sfc");
        return [];
    }
});

export async function getSharedFileDownloadURL(fileId: string): Promise<APIResponseType & { signedUrl?: string }> {
    const adminSession = await getAuthSession();
    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found."
        };
    };

    const storagePath = `shared-files/${fileId}`;

    if (!verifyFileExists(storagePath)) {
        return {
            success: false,
            message: "Error: File not exist in server."
        }
    }

    const signedUrl = await generateSignedDownloadURL(storagePath, { expireIn: 30 * 60 * 1000 });

    await db.collection("shared-files").doc(fileId).update({ reviewed: true });

    revalidatePath("/admin/shared-files");

    return {
        success: true,
        message: "Signed URL generated.",
        signedUrl
    }
}