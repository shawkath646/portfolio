"use server";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "@/lib/firebase";
import { PasswordObjectType } from "@/app/admin/security/PasswordManagement";
import { timestampToDate } from "@/utils/timestampToDate";
import getAddressFromIP, { AddressType } from "@/utils/getAddressFromIP";
import { PartialBy, SiteCodeType } from "@/types";

const ADMIN_AUTH_SECRET = process.env.ADMIN_AUTH_SECRET;
if (!ADMIN_AUTH_SECRET) throw Error("Error: ADMIN_AUTH_SECRET not found!");
const SITE_AUTH_SECRET = process.env.SITE_AUTH_SECRET;
if (!SITE_AUTH_SECRET) throw Error("Error: SITE_AUTH_SECRET not found!");

const ADMIN_TOKEN_EXPIRY = "7d";

export interface AdminPassType {
    password: string;
    lastChangedOn: Date;
    blockedIPs: string[];
}

export const getAdminPassData = cache(async (): Promise<AdminPassType> => {
    const adminPassDoc = await db.collection("site-config").doc("admin-pass").get();
    if (!adminPassDoc.exists) {
        throw new Error("Admin password configuration not found");
    }
    const adminPassData = adminPassDoc.data() as AdminPassType;
    return adminPassData;
});

export interface TokensType {
    accessToken: string;
    refreshToken?: string;
    expireAt?: Date;
}

export interface LoginAttemptObjectType {
    id: string;
    ip: string;
    userAgent: string;
    success: boolean;
    siteCode: string;
    timestamp: Date;
    isAdministrator: boolean;
    failedReason?: string;
    address: string | AddressType;
    tokens?: TokensType;
}

export const saveLoginAttempt = async (
    props: PartialBy<LoginAttemptObjectType, "id">
): Promise<{ docId: string; update: (object: Partial<LoginAttemptObjectType>) => Promise<void> }> => {
    
    const docRef = await db.collection("login-attempts").add(props);
    const update = async (object: Partial<LoginAttemptObjectType>): Promise<void> => {
        await docRef.update(object);
    };

    return { docId: docRef.id, update };
};

export const checkLoginAbility = cache(async (ip: string, siteCode: SiteCodeType): Promise<{
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


    const finalAttemptsLeft = Math.min(strictAttemptsLeft, looseAttemptsLeft);
    const finalAllowed = true;

    return {
        allowed: finalAllowed,
        attemptsLeft: finalAttemptsLeft
    };
});


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


const getSiteAccess = async (siteCode: SiteCodeType, password: string) => {

    const headersList = await headers();
    const cookieStore = await cookies();

    const rawIP = headersList.get("x-forwarded-for") || headersList.get("x-real-ip");
    const clientIP = rawIP ? rawIP.split(',')[0].trim() : null;

    if (!clientIP) {
        return {
            success: false,
            message: "Unable to determine client IP address."
        };
    }

    const address = await getAddressFromIP(clientIP);

    try {
        const loginStatus = await checkLoginAbility(clientIP, siteCode);
        if (!loginStatus.allowed) {
            return {
                success: false,
                message: await generateAttemptMessage(loginStatus)
            };
        }

        if (siteCode === "admin-panel") {
            const adminPassData = await getAdminPassData();

            if (adminPassData.blockedIPs.includes(clientIP)) {
                return {
                    success: false,
                    message: "Access from your IP has been blocked."
                };
            }

            const passwordMatch = await bcrypt.compare(password, adminPassData.password);
            if (passwordMatch) {
                const { docId: loginAttemptId, update } = await saveLoginAttempt({
                    ip: clientIP,
                    userAgent: headersList.get("user-agent") || "unknown",
                    success: true,
                    siteCode,
                    isAdministrator: true,
                    timestamp: new Date(),
                    address,
                });

                const token = jwt.sign({ loginAttemptId }, ADMIN_AUTH_SECRET, {
                    expiresIn: ADMIN_TOKEN_EXPIRY
                });

                await update({ tokens: { accessToken: token }});

                cookieStore.set("admin-panel_access_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                });
                

                return {
                    success: true,
                    message: "Authentication successful",
                };
            } else {
                await saveLoginAttempt({
                    ip: clientIP,
                    userAgent: headersList.get("user-agent") || "unknown",
                    success: false,
                    siteCode,
                    isAdministrator: true,
                    timestamp: new Date(),
                    failedReason: "Invalid admin credentials",
                    address,
                });

                const updatedStatus = await checkLoginAbility(clientIP, siteCode);
                const attemptMessage = await generateAttemptMessage(updatedStatus);

                return {
                    success: false,
                    message: `Invalid admin credentials. ${attemptMessage}`
                };
            }
        }

        // TEMPORARY PASSWORD CHECK (SECURE HASH CHECK)
        const passwordQuery = await db.collection("passwords")
            .where("siteCode", "==", siteCode)
            .get();

        if (passwordQuery.empty) {
            await saveLoginAttempt({
                ip: clientIP,
                userAgent: headersList.get("user-agent") || "unknown",
                success: false,
                siteCode,
                isAdministrator: false,
                timestamp: new Date(),
                failedReason: "No matching site code for password",
                address,
            });

            const updatedStatus = await checkLoginAbility(clientIP, siteCode);
            const attemptMessage = await generateAttemptMessage(updatedStatus);

            return {
                success: false,
                message: `Invalid credentials. ${attemptMessage}`
            };
        }

        const passwordDoc = passwordQuery.docs[0];
        const rawPasswordData = passwordDoc.data() as PasswordObjectType;
        const passwordData = {
            ...rawPasswordData,
            expiresAt: timestampToDate(rawPasswordData.expiresAt)
        } as PasswordObjectType & { expiresAt: Date };
        
        const passwordId = passwordDoc.id;
        
        const passwordMatch = await bcrypt.compare(password, passwordData.password);

        if (!passwordMatch) {
            await saveLoginAttempt({
                ip: clientIP,
                userAgent: headersList.get("user-agent") || "unknown",
                success: false,
                siteCode,
                isAdministrator: false,
                timestamp: new Date(),
                failedReason: "Invalid temporary password hash",
                address,
            });

            const updatedStatus = await checkLoginAbility(clientIP, siteCode);
            const attemptMessage = await generateAttemptMessage(updatedStatus);

            return {
                success: false,
                message: `Invalid credentials. ${attemptMessage}`
            };
        }

        const now = Date.now();
        const expiryDate = passwordData.expiresAt.getTime();

        if (expiryDate < now) {
            await saveLoginAttempt({
                ip: clientIP,
                userAgent: headersList.get("user-agent") || "unknown",
                success: false,
                siteCode,
                isAdministrator: false,
                timestamp: new Date(),
                failedReason: "Password expired",
                address,
            });

            const updatedStatus = await checkLoginAbility(clientIP, siteCode);
            const attemptMessage = await generateAttemptMessage(updatedStatus);

            return {
                success: false,
                message: `This password has expired. ${attemptMessage}`
            };
        }

        if (passwordData.usableTimes !== "unlimited" &&
            passwordData.usedTimes >= passwordData.usableTimes) {
            await saveLoginAttempt({
                ip: clientIP,
                userAgent: headersList.get("user-agent") || "unknown",
                success: false,
                siteCode,
                isAdministrator: false,
                timestamp: new Date(),
                failedReason: "Password usage limit has been reached",
                address,
            });

            const updatedStatus = await checkLoginAbility(clientIP, siteCode);
            const attemptMessage = await generateAttemptMessage(updatedStatus);

            return {
                success: false,
                message: `Password usage limit has been reached. ${attemptMessage}`
            };
        }


        const { docId: loginAttemptId, update: updateLoginAttempt } = await saveLoginAttempt({
            ip: clientIP,
            userAgent: headersList.get("user-agent") || "unknown",
            success: true,
            siteCode,
            isAdministrator: false,
            timestamp: new Date(),
            address,
        });
        
        const tokenExpirationSeconds = Math.floor(expiryDate / 1000);

        const token = jwt.sign(
            { loginAttemptId, passwordId, exp: tokenExpirationSeconds },
            SITE_AUTH_SECRET
        );

        await updateLoginAttempt({
            tokens: {
                accessToken: token,
                expireAt: passwordData.expiresAt,
            }
        });

        await db.collection("passwords").doc(passwordId).update({
            usedTimes: passwordData.usedTimes + 1,
            loginAttemptId
        } as Partial<PasswordObjectType>);

        cookieStore.set(`${siteCode}_access_token`, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: Math.max(1, tokenExpirationSeconds - Math.floor(Date.now() / 1000)),
        });

        return {
            success: true,
            message: "Authentication successful",
        };
    } catch (error) {
        const failedReason = error instanceof Error ? error.message : "Internal server error";
        
        const finalIp = clientIP || "unknown";
        const finalAddress = address || "unknown";
        const isAdministrator = siteCode === "admin-panel";

        await saveLoginAttempt({
            ip: finalIp,
            userAgent: headersList.get("user-agent") || "unknown",
            success: false,
            siteCode,
            isAdministrator,
            timestamp: new Date(),
            failedReason: finalIp === "unknown" ? "IP determination failed: " + failedReason : failedReason,
            address: finalAddress,
        });

        return {
            success: false,
            message: failedReason
        };
    }
};

export default getSiteAccess;
