"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { verifySync } from "otplib";
import { Query } from "firebase-admin/firestore";
import { getAuthSession } from "./authSession";
import { db } from "@/lib/firebase";
import { AdminCredentialsRecord, LoginAttemptRecord } from "@/types/auth.types";
import { APIResponseType } from "@/types/common.types";


export async function changeAdminPassword(
    oldPassword: string,
    newPassword: string,
    apcOtp: string
): Promise<APIResponseType> {
    try {
        const loginSession = await getAuthSession();

        if (!loginSession) {
            return {
                success: false,
                message: "Error: Permission denied! Session not found."
            };
        }

        const adminDoc = await db
            .collection("site-config")
            .doc("admin-pass")
            .get();

        if (!adminDoc.exists) {
            return {
                success: false,
                message: "Admin password configuration not found."
            };
        }

        const adminCredentials = adminDoc.data() as AdminCredentialsRecord;

        const isOldPasswordValid = await bcrypt.compare(
            oldPassword,
            adminCredentials.password
        );

        if (!isOldPasswordValid) {
            return {
                success: false,
                message: "Error: Old password is incorrect."
            };
        }

        const isSameAsOld = await bcrypt.compare(
            newPassword,
            adminCredentials.password
        );

        if (isSameAsOld) {
            return {
                success: false,
                message: "Error: New password must be different from the old password."
            };
        }

        const result = verifySync({ token: apcOtp, secret: adminCredentials.totpSecret });
        if (!result.valid) {
            return { success: false, message: "Error: Invalid OTP code." };
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 12);

        await db.collection("site-config").doc("admin-pass").update({
            password: newHashedPassword,
            lastChangedOn: new Date()
        });

        // Invalidate all active sessions in the database
        const sessionsSnapshot = await db.collection("auth-sessions").get();
        if (!sessionsSnapshot.empty) {
            const batch = db.batch();
            for (const doc of sessionsSnapshot.docs) {
                batch.delete(doc.ref);
            }
            await batch.commit();
        }

        const cookieStore = await cookies();
        cookieStore.delete("access_token");
        cookieStore.delete("refresh_token");

        return {
            success: true,
            message: "Admin password updated successfully. All active sessions have been invalidated. Please log in again."
        };
    } catch (error) {
        console.error("Password change error:", error);

        return {
            success: false,
            message: "Failed to update admin password. Please try again."
        };
    }
};

export async function revokeSession(sessionId: string): Promise<APIResponseType> {
    const currentSession = await getAuthSession();
    if (!currentSession) {
        return { success: false, message: "Unauthorized" };
    }

    if (sessionId === currentSession.id) {
        return { success: false, message: "Cannot revoke your current session. Use logout instead." };
    }

    const sessionRef = db.collection("auth-sessions").doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
        return { success: false, message: "Session not found" };
    }

    await sessionRef.delete();
    revalidatePath("/admin/security");
    return { success: true, message: "Session revoked successfully" };
}

export async function revokeAllOtherSessions(): Promise<APIResponseType> {
    const currentSession = await getAuthSession();
    if (!currentSession) {
        return { success: false, message: "Unauthorized" };
    }

    const snapshot = await db.collection("auth-sessions").get();
    const batch = db.batch();
    let count = 0;

    for (const doc of snapshot.docs) {
        if (doc.id !== currentSession.id) {
            batch.delete(doc.ref);
            count++;
        }
    }

    if (count > 0) {
        await batch.commit();
    }

    revalidatePath("/admin/security");
    return { success: true, message: `${count} session(s) revoked` };
}

export async function revokeAllSessions(): Promise<APIResponseType> {
    const currentSession = await getAuthSession();
    if (!currentSession) {
        return { success: false, message: "Unauthorized" };
    }

    const snapshot = await db.collection("auth-sessions").get();
    const batch = db.batch();

    for (const doc of snapshot.docs) {
        batch.delete(doc.ref);
    }

    if (snapshot.size > 0) {
        await batch.commit();
    }

    revalidatePath("/admin/security");
    return { success: true, message: `All ${snapshot.size} session(s) terminated. You will be logged out.` };
}

export async function clearLoginAttempt(attemptId: string): Promise<APIResponseType> {
    const session = await getAuthSession();
    if (!session) {
        return { success: false, message: "Unauthorized" };
    }

    const ref = db.collection("login-attempts").doc(attemptId);
    const snap = await ref.get();
    if (!snap.exists) {
        return { success: false, message: "Attempt not found" };
    }

    await ref.delete();

    revalidatePath("/admin/security");

    return { success: true, message: "Login attempt cleared" };
}

export async function clearAllLoginAttempts(
    category?: LoginAttemptRecord["status"]
): Promise<APIResponseType> {
    const session = await getAuthSession();
    if (!session) {
        return { success: false, message: "Error: Session not found!" };
    }

    let query: Query = db.collection("login-attempts");

    if (category) {
        query = query.where("status", "==", category);
    }

    const snapshot = await query.get();
    const batch = db.batch();

    for (const doc of snapshot.docs) {
        batch.delete(doc.ref);
    }

    if (snapshot.size > 0) {
        await batch.commit();
    }

    revalidatePath("/admin/security");

    return {
        success: true,
        message: `${snapshot.size} attempt(s) cleared${category ? ` (status: ${category})` : ""}`,
    };
}

export async function addBlockedIP(ip: string): Promise<APIResponseType> {
    const session = await getAuthSession();
    if (!session) {
        return { success: false, message: "Unauthorized" };
    }

    const trimmedIP = ip.trim();
    if (!trimmedIP) {
        return { success: false, message: "IP address is required" };
    }

    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
    if (!ipv4Regex.test(trimmedIP) && !ipv6Regex.test(trimmedIP)) {
        return { success: false, message: "Invalid IP address format" };
    }

    const doc = await db.collection("site-config").doc("admin-pass").get();
    if (!doc.exists) {
        return { success: false, message: "Configuration not found" };
    }

    const data = doc.data() as AdminCredentialsRecord;
    const currentIPs = data.blockedIPs ?? [];

    if (currentIPs.includes(trimmedIP)) {
        return { success: false, message: "IP is already blocked" };
    }

    await db.collection("site-config").doc("admin-pass").update({
        blockedIPs: [...currentIPs, trimmedIP],
    });

    revalidatePath("/admin/security");

    return { success: true, message: `${trimmedIP} has been blocked` };
}

export async function removeBlockedIP(ip: string): Promise<APIResponseType> {
    const session = await getAuthSession();
    if (!session) {
        return { success: false, message: "Unauthorized" };
    }

    const doc = await db.collection("site-config").doc("admin-pass").get();
    if (!doc.exists) {
        return { success: false, message: "Configuration not found" };
    }

    const data = doc.data() as AdminCredentialsRecord;
    const currentIPs = data.blockedIPs ?? [];
    const filtered = currentIPs.filter((blocked) => blocked !== ip);

    if (filtered.length === currentIPs.length) {
        return { success: false, message: "IP not found in blocked list" };
    }

    await db.collection("site-config").doc("admin-pass").update({
        blockedIPs: filtered,
    });

    revalidatePath("/admin/security");

    return { success: true, message: `${ip} has been unblocked` };
}

export async function clearAllBlockedIPs(): Promise<APIResponseType> {
    const session = await getAuthSession();
    if (!session) {
        return { success: false, message: "Unauthorized" };
    }

    await db.collection("site-config").doc("admin-pass").update({
        blockedIPs: [],
    });

    revalidatePath("/admin/security");

    return { success: true, message: "All blocked IPs cleared" };
}
