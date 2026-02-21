"use server";
import { revalidatePath } from "next/cache";
import { unauthorized } from "next/navigation";
import { db, bucket } from "@/lib/firebase";
import { getAuthSession } from "../authentication/authActions";

export async function deleteImage(albumId: string, imageId: string, imagePath: string) {
    try {
        const loginSession = await getAuthSession();
        if (!loginSession) unauthorized();

        await db.collection("gallery").doc(albumId).collection("images").doc(imageId).delete();

        const fileName = imagePath.split('/').pop();
        if (fileName) {
            try {
                await bucket.file(imagePath).delete();
            } catch { }
        }

        revalidatePath(`/admin/gallery/${albumId}`);
        return { success: true };
    } catch {
        return { success: false, error: "Failed to delete image" };
    }
}
