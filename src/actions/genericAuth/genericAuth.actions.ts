"use server";

import { cookies, headers } from "next/headers";
import { db } from "@/lib/firebase";
import verifyRecaptchaToken from "@/lib/GoogleRecaptchaV3/verifyRecaptchaToken";
import { APIResponseType } from "@/types/common.types";
import { GenericAuthPasswordRecordType } from "@/types/genericAuth.types";
import { timestampToDate } from "@/utils/dateTime";
import getErrorMessage from "@/utils/getErrorMessage";
import { getClientIP } from "@/utils/ipAddress";
import { clearGenericAuthSession, createGenericAuthSession } from "./authSession";
import { hashGenericPassword } from "./passwordManagement";
import { isRouteAllowed } from "@/data/site_scopes";

const COOKIE_NAME = "page_access_token";

export async function handleGenericLogin(
    targetRoute: string,
    password: string,
    recaptchaToken: string
): Promise<APIResponseType> {
    const headerStore = await headers();
    const cookieStore = await cookies();

    const existingCookie = cookieStore.get(COOKIE_NAME);

    const clientIp = getClientIP(headerStore);
    if (!clientIp) {
        return {
            success: false,
            message: "Error: Failed to determine user IP address!",
        };
    }

    const recaptchaResult = await verifyRecaptchaToken(recaptchaToken, "restricted_page_login");
    if (!recaptchaResult.success) {
        return recaptchaResult;
    }

    try {
        const passwordHash = hashGenericPassword(password);
        const docRef = db.collection("generic-passwords").doc(passwordHash);

        let finalData: GenericAuthPasswordRecordType | null = null;

        await db.runTransaction(async (tx) => {
            const freshDoc = await tx.get(docRef);
            if (!freshDoc.exists) {
                throw new Error("INVALID_PASSWORD");
            }

            const freshData = freshDoc.data() as GenericAuthPasswordRecordType;

            if (timestampToDate(freshData.expiresAt) <= new Date()) {
                throw new Error("EXPIRED");
            }

            if (!freshData.allowedRoutes || !isRouteAllowed(freshData.allowedRoutes, targetRoute)) {
                throw new Error("UNAUTHORIZED_ROUTE");
            }

            if (
                freshData.usableTimes !== "unlimited" &&
                freshData.usedTimes >= freshData.usableTimes
            ) {
                throw new Error("LIMIT_EXCEEDED");
            }

            tx.update(docRef, {
                usedTimes: (freshData.usedTimes || 0) + 1,
            });

            finalData = freshData;
        });

        if (!finalData) {
            return { success: false, message: "Error processing login." };
        }

        const tokenObj = await createGenericAuthSession({
            usedPasswordObj: finalData,
            clientIp,
            userAgent: headerStore.get("user-agent") ?? "unknown",
            existingCookie: existingCookie?.value,
        });

        if (!tokenObj) {
            return {
                success: false,
                message: "Error: Failed to generate user session!",
            };
        }

        cookieStore.set(COOKIE_NAME, tokenObj.token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            expires: tokenObj.maxExpireAt,
            path: "/",
        });

        return {
            success: true,
            message: "Access granted.",
        };
    } catch (error) {
        const message = getErrorMessage(error);
        if (message === "INVALID_PASSWORD") {
            return { success: false, message: "Invalid password." };
        }
        if (message === "EXPIRED") {
            return { success: false, message: "This password has expired." };
        }
        if (message === "UNAUTHORIZED_ROUTE") {
            return { success: false, message: "This password is not authorized for this page." };
        }
        if (message === "LIMIT_EXCEEDED") {
            return { success: false, message: "This password has reached its usage limit." };
        }

        console.error("Generic login error:", error);
        return { success: false, message: "Login failed. Please try again." };
    }
}

export async function handleGenericLogout(): Promise<APIResponseType> {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(COOKIE_NAME);
    cookieStore.delete(COOKIE_NAME);

    if (authCookie && authCookie.value) {
        const result = await clearGenericAuthSession(authCookie.value);

        if (result) {
            return {
                success: true,
                message: "Logged out successfully",
            };
        }
    }

    return {
        success: false,
        message: "Error: Failed to clear session!",
    };
}
