"use server";
import crypto from "node:crypto";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { verifySync } from "otplib";
import { clearAuthSession, createAuthSession, resolveSession } from "@/actions/authentication/authSession";
import { db } from "@/lib/firebase";
import { AdminCredentialsRecord, AuthSessionRecord, LoginAttemptRecord } from "@/types/auth.types";
import { APIResponseType } from "@/types/common.types";
import { getAddressFromIP, getClientIP } from "@/utils/ipAddress";
import { getClientPlatform } from "@/utils/clientPlatform";
import { isLoginAllowed, recordFailedLoginAttempt, clearLoginFailureRecord } from "./loginRateLimit";


const LOGIN_ATTEMPT_TTL_MINUTES = 5;


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

    const userAgent = requestHeaders.get("user-agent") ?? "unknown";
    const platform = getClientPlatform(requestHeaders);
    const clientAddress = await getAddressFromIP(ipAddress);

    const adminPasswordDoc = await db.collection("site-config").doc("admin-pass").get();
    if (!adminPasswordDoc.exists) {
        return { success: false, message: "Authentication unavailable" };
    }

    const adminPasswordRecord = adminPasswordDoc.data() as AdminCredentialsRecord;

    if (adminPasswordRecord.blockedIPs.includes(ipAddress)) {
        return { success: false, message: "Access denied." };
    }

    const passwordMatches = await bcrypt.compare(
        plainPassword,
        adminPasswordRecord.password
    );

    if (!passwordMatches) {
        await recordFailedLoginAttempt({
            id: crypto.randomUUID(),
            ipAddress,
            userAgent,
            platform,
            occurredAt: new Date(),
            address: clientAddress,
            failureReason: "INVALID_PASSWORD",
        });

        return { success: false, message: "Invalid credentials! Please check your password." };
    }

    await clearLoginFailureRecord(ipAddress);

    const attemptId = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + LOGIN_ATTEMPT_TTL_MINUTES * 60 * 1000);

    const attemptRecord: LoginAttemptRecord = {
        id: attemptId,
        ipAddress,
        userAgent,
        platform,
        address: clientAddress,
        createdAt: now,
        expiresAt,
        verified: false,
    };

    await db.collection("login-attempts").doc(attemptId).set(attemptRecord);

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
    const responseCookies = await cookies();

    const attemptRef = db.collection("login-attempts").doc(attemptId);
    const attemptSnap = await attemptRef.get();

    if (!attemptSnap.exists) {
        return { success: false, message: "Login session expired. Please start over." };
    }

    const attempt = attemptSnap.data() as LoginAttemptRecord;

    if (attempt.verified) {
        return { success: false, message: "This login attempt has already been used." };
    }

    if (new Date(attempt.expiresAt).getTime() < Date.now()) {
        await attemptRef.delete();
        return { success: false, message: "Login session expired. Please start over." };
    }

    // Verify TOTP code
    const adminPasswordDoc = await db.collection("site-config").doc("admin-pass").get();
    if (!adminPasswordDoc.exists) {
        return { success: false, message: "Authentication unavailable" };
    }

    const adminPasswordRecord = adminPasswordDoc.data() as AdminCredentialsRecord;

    if (!adminPasswordRecord.totpSecret) {
        return { success: false, message: "Authenticator app is not configured." };
    }

    const result = verifySync({ token: code, secret: adminPasswordRecord.totpSecret });
    if (!result.valid) {
        return { success: false, message: "Invalid verification code." };
    }

    // Mark attempt as consumed
    await attemptRef.update({ verified: true });

    // Create the actual auth session and issue tokens
    const session = await createAuthSession({
        ipAddress: attempt.ipAddress,
        userAgent: attempt.userAgent,
        platform: attempt.platform,
        address: attempt.address,
    });

    if (attempt.platform === "web") {
        responseCookies.set("access_token", session.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            expires: session.accessTokenExpireAt,
        });

        responseCookies.set("refresh_token", session.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            expires: session.refreshTokenExpireAt,
        });
    }

    await attemptRef.delete();

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
