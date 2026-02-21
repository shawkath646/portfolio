"use server";
import { revalidatePath } from "next/cache";
import { generateSecret, generateURI, verifySync } from "otplib";
import { getAuthSession } from "@/actions/authentication/authActions";
import { db } from "@/lib/firebase";
import { AdminCredentialsRecord } from "@/types/auth.types";
import { APIResponseType } from "@/types/common.types";


interface Setup2FAResponse extends APIResponseType {
    secret?: string;
    otpauthUri?: string;
}

const TOTP_ISSUER = "shawkath646";
const TOTP_LABEL = "admin";

export async function generate2FASecret(): Promise<Setup2FAResponse> {
    const session = await getAuthSession();
    if (!session) {
        return { success: false, message: "Error: Permission denied! Session not found." };
    }

    const secret = generateSecret();
    const otpauthUri = generateURI({
        secret,
        issuer: TOTP_ISSUER,
        label: TOTP_LABEL,
        digits: 6
    });

    return {
        success: true,
        message: "Secret generated. Scan the QR code with your authenticator app.",
        secret,
        otpauthUri,
    };
}


export async function confirm2FASetup(
    secret: string,
    verificationCode: string
): Promise<APIResponseType> {
    const session = await getAuthSession();
    if (!session) {
        return { success: false, message: "Error: Permission denied! Session not found." };
    }

    if (!secret || !verificationCode) {
        return { success: false, message: "Secret and verification code are required" };
    }

    const result = verifySync({ token: verificationCode, secret });
    if (!result.valid) {
        return { success: false, message: "Invalid verification code. Please try again." };
    }

    await db.collection("site-config").doc("admin-pass").update({
        totpSecret: secret,
        totpCreatedOn: new Date()
    } as Partial<AdminCredentialsRecord>);

    revalidatePath("/admin/security");
    return { success: true, message: "Two-factor authentication has been enabled successfully." };
}


export async function disable2FA(): Promise<APIResponseType> {
    const session = await getAuthSession();
    if (!session) {
        return { success: false, message: "Error: Permission denied! Session not found." };
    }

    const doc = await db.collection("site-config").doc("admin-pass").get();
    if (!doc.exists) {
        return { success: false, message: "Configuration not found" };
    }

    const data = doc.data() as AdminCredentialsRecord;
    if (!data.totpSecret) {
        return { success: false, message: "2FA is not currently enabled" };
    }

    await db.collection("site-config").doc("admin-pass").update({
        totpSecret: "",
        totpCreatedOn: null
    } as Partial<AdminCredentialsRecord>);

    revalidatePath("/admin/security");
    return { success: true, message: "Two-factor authentication has been disabled." };
}
