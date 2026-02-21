"use server";

import { cookies, headers } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/firebase";
import verifyRecaptchaToken from "@/lib/GoogleRecaptchaV3/verifyRecaptchaToken";
import { APIResponseType } from "@/types/common.types";
import { AccessScopeLabel, GenericAuthPasswordRecordType, GenericAuthSessionRecordType } from "@/types/genericAuth.types";
import { getClientIP } from "@/utils/ipAddress";
import { clearGenericAuthSession, createGenericAuthSession, resolveGenericAuthSession } from "./authSession";

const COOKIE_NAME = "page_access_token";

export async function handleGenericLogin(
    accessScopeLabel: AccessScopeLabel,
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
            message: "Error: Failed to determine user IP address!"
        }
    };

    const recaptchaResult = await verifyRecaptchaToken(recaptchaToken, "restricted_page_login");
    if (!recaptchaResult.success) {
        return recaptchaResult;
    }

    try {
        const now = new Date();
        const hint = password.slice(0, 4);

        const snapshot = await db
            .collection("generic-passwords")
            .where("accessScope", "array-contains", accessScopeLabel)
            .where("passwordHint", "==", hint)
            .where("expiresAt", ">", now)
            .get();

        if (snapshot.empty) {
            return { success: false, message: "Invalid password." };
        }

        for (const doc of snapshot.docs) {
            const data = doc.data() as GenericAuthPasswordRecordType;

            if (
                data.usableTimes !== "unlimited" &&
                data.usedTimes >= data.usableTimes
            ) {
                continue;
            }

            const isMatch = await bcrypt.compare(
                password,
                data.hashedPassword
            );

            if (!isMatch) continue;

            await db.runTransaction(async (tx) => {
                const ref = doc.ref;
                const freshDoc = await tx.get(ref);
                const freshData = freshDoc.data() as GenericAuthPasswordRecordType;

                if (
                    freshData.usableTimes !== "unlimited" &&
                    freshData.usedTimes >= freshData.usableTimes
                ) {
                    throw new Error("Password usage exceeded.");
                }

                tx.update(ref, {
                    usedTimes: freshData.usedTimes + 1,
                });
            });

            const tokenObj = await createGenericAuthSession({
                usedPasswordObj: data,
                clientIp,
                userAgent: headerStore.get("user-agent") ?? "unknown",
                existingCookie: existingCookie?.value
            });

            if (!tokenObj) return {
                success: false,
                message: "Error: Failed to generate user session!"
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
        }

        return { success: false, message: "Invalid password." };
    } catch (error) {
        console.error("Generic login error:", error);
        return { success: false, message: "Login failed." };
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
                message: "Logged out successfully"
            }
        }
    }

    return {
        success: false,
        message: "Error: Failed to clear session!"
    }
}

export async function getGenericAuthSession(requestedScope: AccessScopeLabel): Promise<GenericAuthSessionRecordType | null> {
    const responseCookies = await cookies();
    const authToken = responseCookies.get(COOKIE_NAME);

    if (!authToken || !authToken.value) return null;
    const session = await resolveGenericAuthSession(authToken.value, requestedScope);

    return session;
}