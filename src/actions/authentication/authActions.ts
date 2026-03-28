"use server";
import crypto from "node:crypto";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { FieldValue } from "firebase-admin/firestore";
import { verifySync } from "otplib";
import { clearAuthSession, createAuthSession, resolveSession } from "@/actions/authentication/authSession";
import { db } from "@/lib/firebase";
import { AdminCredentialsRecord, AuthSessionRecord, LoginAttemptRecord } from "@/types/auth.types";
import { APIResponseType } from "@/types/common.types";
import { getClientPlatform } from "@/utils/clientPlatform";
import { timestampToDate } from "@/utils/dateTime";
import { getAddressFromIP, getClientIP } from "@/utils/ipAddress";
import { isLoginAllowed } from "./loginRateLimit";


const LOGIN_ATTEMPT_TTL_MINUTES = 5;
const MAX_2FA_ATTEMPTS = 3;


interface PasswordCheckResponse extends APIResponseType {
    attemptId?: string;
}

export const performLogin = async (
    plainPassword: string
): Promise<PasswordCheckResponse> => {
    const requestHeaders = await headers();

    const ipAddress = getClientIP(requestHeaders);
    if (!ipAddress) {
        return { success: false, message: "Request validation failed" };
    }

    const rateLimitStatus = await isLoginAllowed(ipAddress);
    if (!rateLimitStatus.allowed) {
        return { success: false, message: "Too many attempts. Try later." };
    }

    const adminPasswordDoc = await db.collection("site-config").doc("admin-pass").get();
    if (!adminPasswordDoc.exists) {
        return { success: false, message: "Authentication unavailable" };
    }

    const adminPasswordRecord = adminPasswordDoc.data() as AdminCredentialsRecord;

    if (adminPasswordRecord.blockedIPs.includes(ipAddress)) {
        return { success: false, message: "Access denied." };
    }

    const [passwordMatches, clientAddress] = await Promise.all([
        bcrypt.compare(plainPassword, adminPasswordRecord.password),
        getAddressFromIP(ipAddress)
    ]);

    const userAgent = requestHeaders.get("user-agent") ?? "unknown";
    const platform = getClientPlatform(requestHeaders);
    const attemptId = crypto.randomUUID();
    
    const attemptRecord: LoginAttemptRecord = {
        id: attemptId,
        ipAddress,
        userAgent,
        platform,
        address: clientAddress,
        status: passwordMatches ? "waiting" : "failed",
        shouldCount: true,
        type: "admin",
        attemptCount2FA: 0,
        timestamp: new Date() 
    };

    await db.collection("login-attempts").doc(attemptId).set(attemptRecord);

    if (!passwordMatches) {
        return { 
            success: false, 
            message: "Invalid credentials! Please check your password." 
        };
    }

    return {
        success: true,
        message: "Password verified. Please complete two-factor authentication.",
        attemptId,
    };
};


export const verify2FA = async (
    attemptId: string,
    code: string
): Promise<APIResponseType> => {
    const attemptRef = db.collection("login-attempts").doc(attemptId);

    const [attemptSnap, adminPasswordDoc] = await Promise.all([
        attemptRef.get(),
        db.collection("site-config").doc("admin-pass").get()
    ]);

    if (!attemptSnap.exists) {
        return { success: false, message: "Login session not found." };
    }

    const attempt = attemptSnap.data() as LoginAttemptRecord;

    if (attempt.status !== "waiting") {
        return { success: false, message: `This attempt is invalid (Status: ${attempt.status}).` };
    }

    if (attempt.attemptCount2FA >= MAX_2FA_ATTEMPTS) {
        await attemptRef.update({ status: "locked" });
        return { success: false, message: "Maximum verification attempts exceeded. Please log in again." };
    }

    const expirationTime = timestampToDate(attempt.timestamp).getTime() + (LOGIN_ATTEMPT_TTL_MINUTES * 60 * 1000);
    if (Date.now() > expirationTime) {
        await attemptRef.update({ status: "expired" });
        return { success: false, message: "Login session expired. Please start over." };
    }

    if (!adminPasswordDoc.exists) {
        return { success: false, message: "Authentication unavailable" };
    }

    const adminPasswordRecord = adminPasswordDoc.data() as AdminCredentialsRecord;
    if (!adminPasswordRecord.totpSecret) {
        return { success: false, message: "Authenticator app is not configured." };
    }

    const result = verifySync({ token: code, secret: adminPasswordRecord.totpSecret });
    if (!result.valid) {
        await attemptRef.update({ 
            attemptCount2FA: FieldValue.increment(1) 
        });
        
        const attemptsLeft = MAX_2FA_ATTEMPTS - (attempt.attemptCount2FA + 1);
        return { 
            success: false, 
            message: `Invalid verification code. ${attemptsLeft} attempts remaining.` 
        };
    }

    const session = await createAuthSession({
        ipAddress: attempt.ipAddress,
        userAgent: attempt.userAgent,
        platform: attempt.platform,
        address: attempt.address,
    });

    if (attempt.platform === "web") {
        const responseCookies = await cookies();
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict" as const,
            path: "/",
        };

        responseCookies.set("access_token", session.accessToken, {
            ...cookieOptions,
            expires: session.accessTokenExpireAt,
        });
        responseCookies.set("refresh_token", session.refreshToken, {
            ...cookieOptions,
            expires: session.refreshTokenExpireAt,
        });
    }

    await attemptRef.update({ 
        status: "success",
        attemptCount: FieldValue.increment(1)
    });

    return { success: true, message: "Verification successful" };
};


export async function performLogout(): Promise<APIResponseType> {
    const requestHeaders = await headers();
    const responseCookies = await cookies();
    const platform = getClientPlatform(requestHeaders);

    let accessToken: string | null = null;

    if (platform === "web") {
        accessToken = responseCookies.get("access_token")?.value ?? null;

        responseCookies.delete("access_token");
        responseCookies.delete("refresh_token");
    } else {
        const authHeader = requestHeaders.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
            accessToken = authHeader.slice(7);
        }
    }

    if (accessToken) {
        await clearAuthSession(accessToken);
    }

    if (platform === "web") {
        redirect("/");
    }

    return {
        success: true,
        message: "Logged out successfully",
    };
}


export const getAuthSession = async (): Promise<AuthSessionRecord | null> => {
    const responseCookies = await cookies();
    const accessToken = responseCookies.get("access_token");

    if (!accessToken || !accessToken.value) return null;
    const session = await resolveSession(accessToken.value);

    return session;
}
