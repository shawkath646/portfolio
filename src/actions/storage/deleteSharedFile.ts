"use server";

import { revalidatePath } from "next/cache";
import { db, bucket } from "@/lib/firebase";

export async function deleteSharedFile(fileId: string, storagePath: string): Promise<{ success: boolean; error?: string }> {
    try {
        await db.collection("file-uploads").doc(fileId).delete();
        
        const file = bucket.file(storagePath);
        const [exists] = await file.exists();
        if (exists) {
            await file.delete();
        }

        revalidatePath("/admin/shared-files");
        return { success: true };
    } catch (error: unknown) {
        return { success: false, error: `Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}` };
    }
}
