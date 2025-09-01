"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";

const removePassword = async (id: string) => {
    await db.collection("passwords").doc(id).delete();
    
    // Revalidate the security page to refresh the data
    revalidatePath("/admin/security");
    
    return { success: true };
};

export default removePassword;