"use server";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import bcrypt from "bcryptjs";
import { db } from "@/lib/firebase";
import { ClientAppTokensType, generateClientAppToken, generateSessionToken, SessionTokensType } from "@/lib/auth";
import { timestampToDate } from "@/utils/timestampToDate";
import getAddressFromIP from "@/actions/geo/getAddressFromIP";
import { PasswordObjectType } from "./passwordFunc";
import { AddressType, PartialBy, SiteCodeType } from "@/types";


interface AdminPassType {
    password: string;
    lastChangedOn: Date;
    blockedIPs: string[];
}

export interface LoginAttemptObjectType {
    id: string;
    ip: string;
    userAgent: string;
    success: boolean;
    invoked: boolean;
    siteCode: string;
    timestamp: Date;
    isAdministrator: boolean;
    failedReason?: string;
    address: AddressType | null;
    sessionTokens?: SessionTokensType;
    clientAppTokens?: ClientAppTokensType;
}


const getAdminPassData = cache(async (): Promise<AdminPassType> => {
    const adminPassDoc = await db.collection("site-config").doc("admin-pass").get();
    if (!adminPassDoc.exists) {
        throw new Error("Admin password configuration not found");
    }
    return adminPassDoc.data() as AdminPassType;
});

const saveLoginAttempt = async (
    props: PartialBy<LoginAttemptObjectType, "id">
): Promise<string> => {
    const docRef = await db.collection("login-attempts").add(props);
    return docRef.id;
};

const checkLoginAbility = async (ip: string, siteCode: SiteCodeType): Promise<{
    allowed: boolean;
    attemptsLeft: number;
    lockoutEndTime?: Date;
}> => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const strictMaxAttempts = 5;
    const strictFailedReason = "Invalid admin credentials";
    const strictLockoutHours = 1;
    const looseMaxAttempts = 10;

    const strictFailedQuery = db.collection("login-attempts")
        .where("ip", "==", ip)
        .where("siteCode", "==", siteCode)
        .where("success", "==", false)
        .where("failedReason", "==", strictFailedReason)
        .where("timestamp", ">=", oneHourAgo);

    const strictAttemptsSnapshot = await strictFailedQuery.get();
    const strictFailedCount = strictAttemptsSnapshot.size;

    if (strictFailedCount >= strictMaxAttempts) {
        const lockoutEnd = new Date(Date.now() + strictLockoutHours * 60 * 60 * 1000);
        return {
            allowed: false,
            attemptsLeft: 0,
            lockoutEndTime: lockoutEnd
        };
    }

    const strictAttemptsLeft = Math.max(0, strictMaxAttempts - strictFailedCount);

    // NOTE: Ensure a composite index exists in Firestore for this query.
    const allFailedQuery = db.collection("login-attempts")
        .where("ip", "==", ip)
        .where("siteCode", "==", siteCode)
        .where("success", "==", false)
        .where("timestamp", ">=", oneHourAgo);

    const allAttemptsSnapshot = await allFailedQuery.get();
    const allFailedCount = allAttemptsSnapshot.size;
    const looseFailedCount = allFailedCount - strictFailedCount;
    const looseAttemptsLeft = Math.max(0, looseMaxAttempts - looseFailedCount);

    if (looseFailedCount >= looseMaxAttempts) {
        return {
            allowed: false,
            attemptsLeft: 0
        };
    }

    return {
        allowed: true,
        attemptsLeft: Math.min(strictAttemptsLeft, looseAttemptsLeft)
    };
};

export const generateAttemptMessage = cache(async (loginStatus: { attemptsLeft: number; lockoutEndTime?: Date }): Promise<string> => {
    if (loginStatus.attemptsLeft > 0) {
        return `You have ${loginStatus.attemptsLeft} login attempts remaining.`;
    } else if (loginStatus.lockoutEndTime) {
        const lockoutEndTime = loginStatus.lockoutEndTime;
        const lockoutMinutes = Math.ceil((lockoutEndTime.getTime() - Date.now()) / (60 * 1000));
        const lockoutHours = Math.ceil(lockoutMinutes / 60);

        if (lockoutHours >= 2) {
            return `Account locked for ${lockoutHours} hours until ${lockoutEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} on ${lockoutEndTime.toLocaleDateString()}.`;
        } else if (lockoutMinutes > 60) {
            return `Account locked for ${Math.floor(lockoutMinutes / 60)} hour and ${lockoutMinutes % 60} minutes.`;
        } else {
            return `Account locked for ${lockoutMinutes} minutes.`;
        }
    } else {
        return "This was your last attempt. Further attempts will be blocked for 1 hour.";
    }
});

// --- Main Handler ---
const getSiteAccess = async (siteCode: SiteCodeType, password: string) => {
    const headersList = await headers();
    const cookieStore = await cookies();

    const rawIP = headersList.get("x-forwarded-for") || headersList.get("x-real-ip");
    const clientIP = rawIP ? rawIP.split(',')[0].trim() : null;
    const userAgent = headersList.get("user-agent") || "unknown";

    if (!clientIP) {
        return { success: false, message: "Unable to determine client IP address." };
    }

    const address = await getAddressFromIP(clientIP);

    try {
        const loginStatus = await checkLoginAbility(clientIP, siteCode);
        if (!loginStatus.allowed) {
            return { success: false, message: await generateAttemptMessage(loginStatus) };
        }

        if (["admin-panel", "client-app"].includes(siteCode)) {
            const adminPassData = await getAdminPassData();

            if (adminPassData.blockedIPs.includes(clientIP)) {
                return { success: false, message: "Access from your IP has been blocked." };
            }

            const passwordMatch = await bcrypt.compare(password, adminPassData.password);

            if (passwordMatch) {
                const loginAttemptId = await saveLoginAttempt({
                    ip: clientIP,
                    userAgent,
                    success: true,
                    siteCode,
                    isAdministrator: true,
                    timestamp: new Date(),
                    address,
                    invoked: false,
                });

                if (siteCode == "admin-panel") {
                    const tokenObject = await generateSessionToken(loginAttemptId, siteCode, true);
                    const expiresInSeconds = Math.max(
                        1,
                        Math.floor((tokenObject.expireAt.getTime() - Date.now()) / 1000)
                    );

                    cookieStore.set("admin-panel_access_token", tokenObject.token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict",
                        path: "/",
                        maxAge: expiresInSeconds,
                    });

                    return { success: true, message: "Authentication successful" };
                } else if (siteCode == "client-app") {
                    const tokenObject = await generateClientAppToken(loginAttemptId, clientIP);
                    return { success: true, message: "Authentication successful", data: tokenObject };
                }
            } else {
                await saveLoginAttempt({
                    ip: clientIP,
                    userAgent,
                    success: false,
                    siteCode,
                    isAdministrator: true,
                    timestamp: new Date(),
                    failedReason: "Invalid admin credentials",
                    address,
                    invoked: false
                });

                const updatedStatus = await checkLoginAbility(clientIP, siteCode);
                return { success: false, message: `Invalid admin credentials. ${await generateAttemptMessage(updatedStatus)}` };
            }
        }

        const passwordQuery = await db.collection("passwords").where("siteCode", "==", siteCode).get();

        if (passwordQuery.empty) {
            await saveLoginAttempt({
                ip: clientIP,
                userAgent,
                success: false,
                siteCode,
                isAdministrator: false,
                timestamp: new Date(),
                failedReason: "No matching site code for password",
                address,
                invoked: false
            });
            const updatedStatus = await checkLoginAbility(clientIP, siteCode);
            return { success: false, message: `Invalid credentials. ${await generateAttemptMessage(updatedStatus)}` };
        }

        const passwordDoc = passwordQuery.docs[0];
        const rawPasswordData = passwordDoc.data() as PasswordObjectType;
        const passwordData = {
            ...rawPasswordData,
            expiresAt: timestampToDate(rawPasswordData.expiresAt)
        };

        const passwordMatch = await bcrypt.compare(password, passwordData.password);
        if (!passwordMatch) {
            await saveLoginAttempt({
                ip: clientIP,
                userAgent,
                success: false,
                siteCode,
                isAdministrator: false,
                timestamp: new Date(),
                failedReason: "Invalid temporary password hash",
                address,
                invoked: false
            });
            const updatedStatus = await checkLoginAbility(clientIP, siteCode);
            return { success: false, message: `Invalid credentials. ${await generateAttemptMessage(updatedStatus)}` };
        }

        if (passwordData.expiresAt.getTime() < Date.now()) {
            await saveLoginAttempt({
                ip: clientIP,
                userAgent,
                success: false,
                siteCode,
                isAdministrator: false,
                timestamp: new Date(),
                failedReason: "Password expired",
                address,
                invoked: false
            });
            const updatedStatus = await checkLoginAbility(clientIP, siteCode);
            return { success: false, message: `This password has expired. ${await generateAttemptMessage(updatedStatus)}` };
        }

        if (passwordData.usableTimes !== "unlimited" && passwordData.usedTimes >= passwordData.usableTimes) {
            await saveLoginAttempt({
                ip: clientIP,
                userAgent,
                success: false,
                siteCode,
                isAdministrator: false,
                timestamp: new Date(),
                failedReason: "Password usage limit has been reached",
                address,
                invoked: false
            });
            const updatedStatus = await checkLoginAbility(clientIP, siteCode);
            return { success: false, message: `Password usage limit has been reached. ${await generateAttemptMessage(updatedStatus)}` };
        }
        const loginAttemptId = await saveLoginAttempt({
            ip: clientIP,
            userAgent,
            success: true,
            siteCode,
            isAdministrator: false,
            timestamp: new Date(),
            address,
            invoked: false
        });

        const tokenObject = await generateSessionToken(
            loginAttemptId,
            siteCode,
            false,
            passwordData.expiresAt,
            passwordData.id
        );

        const expiresInSeconds = Math.max(
            1,
            Math.floor((tokenObject.expireAt.getTime() - Date.now()) / 1000)
        );

        cookieStore.set(`${siteCode}_access_token`, tokenObject.token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: expiresInSeconds,
        });

        return { success: true, message: "Authentication successful" };
    } catch (error) {
        const failedReason = error instanceof Error ? error.message : "Internal server error";
        const finalIp = clientIP || "unknown";
        const isAdministrator = siteCode === "admin-panel";

        await saveLoginAttempt({
            ip: finalIp,
            userAgent,
            success: false,
            siteCode,
            isAdministrator,
            timestamp: new Date(),
            failedReason: finalIp === "unknown" ? "IP determination failed: " + failedReason : failedReason,
            address,
            invoked: false
        });

        return { success: false, message: failedReason };
    }
};

export default getSiteAccess;