"use server";
import { unauthorized } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, bucket } from "@/lib/firebase";
import getLoginSession from "@/actions/secure/getLoginSession";


export async function deleteImage(albumId: string, imageId: string, imagePath: string) {
    try {
        const session = await getLoginSession("admin-panel");
        if (!session) unauthorized();

        await db.collection("gallery").doc(albumId).collection("images").doc(imageId).delete();

        const fileName = imagePath.split('/').pop();
        if (fileName) {
            try {
                await bucket.file(fileName).delete();
            } catch (storageError) {
                console.error("Error deleting file from storage:", storageError);
            }
        }

        revalidatePath(`/admin/gallery/${albumId}`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting image:", error);
        return { success: false, error: "Failed to delete image" };
    }
}
