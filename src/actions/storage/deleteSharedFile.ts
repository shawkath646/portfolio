"use server";

import { db, bucket } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

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
    } catch (error: any) {
        return { success: false, error: `Failed to delete file: ${error.message}` };
    }
}
