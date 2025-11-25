"use server";
import { unauthorized } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import getLoginSession from "./getLoginSession";

interface CleanupResult {
    success: boolean;
    count: number;
    message?: string;
}

const cleanupExpiredPasswords = async (): Promise<CleanupResult> => {
    try {
        const loginSession = await getLoginSession("admin-panel");
        if (!loginSession.isAdministrator) unauthorized();
        // Find all expired passwords (where expiresAt is less than current time)
        const now = new Date();
        const snapshot = await db.collection("passwords")
            .where("expiresAt", "<", now)
            .get();
        
        if (snapshot.empty) {
            return { success: true, count: 0, message: "No expired passwords found" };
        }
        
        // Delete each expired password
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        await batch.commit();
        
        // Revalidate the security page to refresh the data
        revalidatePath("/admin/security");
        
        return { 
            success: true, 
            count: snapshot.size,
            message: `Successfully removed ${snapshot.size} expired password${snapshot.size === 1 ? '' : 's'}`
        };
    } catch (error) {
        return { 
            success: false, 
            count: 0,
            message: "Failed to cleanup expired passwords"
        };
    }
};

export default cleanupExpiredPasswords;
