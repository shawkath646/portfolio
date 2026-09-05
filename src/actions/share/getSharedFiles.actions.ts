"use server";

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/actions/authentication/authSession";
import { db } from "@/lib/firebase";
import { APIResponseType } from "@/types/common.types";
import { generateSignedDownloadURL, verifyFileExists } from "@/utils/storage";

export async function getSharedFileDownloadURL(fileId: string): Promise<APIResponseType & { signedUrl?: string }> {
    const adminSession = await getAuthSession();
    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found."
        };
    }

    const storagePath = `shared-files/${fileId}`;

    if (!(await verifyFileExists(storagePath))) {
        return {
            success: false,
            message: "Error: File not exist in server."
        };
    }

    const signedUrl = await generateSignedDownloadURL(storagePath, { expireIn: 30 * 60 * 1000 });

    await db.collection("shared-files").doc(fileId).update({ reviewed: true });

    revalidatePath("/admin/shared-files");

    return {
        success: true,
        message: "Signed URL generated.",
        signedUrl
    };
}
