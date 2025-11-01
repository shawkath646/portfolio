"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { db } from "@/lib/firebase";
import { webcrypto as crypto } from "crypto";
import bcrypt from "bcryptjs";
import { timestampToDate } from "@/utils/timestampToDate";
import getAddressFromIP from "@/utils/getAddressFromIP";
import { AddressType, SiteCodeType } from "@/types";


interface GeneratePasswordResponseType {
    success: boolean;
    message: string;
    data?: {
        id: string;
        password: string;
        createdAt: Date;
        expiresAt: Date
    };
}

export interface PasswordObjectType {
    id: string;
    siteCode: string;
    password: string;
    passwordHint: string;
    usableTimes: number | 'unlimited';
    deviceAddress: AddressType | null;
    createdAt: Date;
    expiresAt: Date;
    length: number;
    usedTimes: number;
    loginAttemptId?: string;
}

export const getPasswordList = cache(async () => {
    const passwordSnapshot = await db.collection("passwords")
        .orderBy("createdAt", "desc")
        .get();

    const passwordList = passwordSnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
            id: doc.id,
            ...data,
            createdAt: timestampToDate(data.createdAt),
            expiresAt: timestampToDate(data.expiresAt),
        };
    }) as PasswordObjectType[];

    return passwordList;
});

// ✅ FIX 2: Replaced insecure createPassword with a secure version
function createSecurePassword(
    length: number,
    includeUppercase: boolean,
    includeLowercase: boolean,
    includeNumbers: boolean,
    includeSpecial: boolean
): string {
    let charset = '';

    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSpecial) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
        charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    }

    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset[randomValues[i] % charset.length];
    }

    return password;
}

interface GeneratePasswordPropsType {
    siteCode: SiteCodeType;
    length: number;
    expireDays: number;
    usableTimes: "unlimited" | number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeSpecial: boolean;
    includeNumbers: boolean;
}

export async function generatePassword({
    siteCode, expireDays, length, usableTimes,
    includeLowercase = true,
    includeNumbers = true,
    includeSpecial = true,
    includeUppercase = true
}: GeneratePasswordPropsType): Promise<GeneratePasswordResponseType> {

    const headerList = await headers();
    const deviceIP = headerList.get('x-forwarded-for') || headerList.get('x-real-ip');

    try {
        if (!siteCode || !length || !expireDays || !usableTimes) {
            return {
                success: false,
                message: "Missing required fields",
            };
        }

        // ✅ FIX 2: Use the secure password generator
        const generatedPassword = createSecurePassword(
            length,
            includeUppercase,
            includeLowercase,
            includeNumbers,
            includeSpecial
        );

        // ✅ FIX 1: Hash the password before storing it
        const passwordHash = await bcrypt.hash(generatedPassword, 10);

        // Create password hint - show last 6 chars with asterisks prefix
        // For passwords < 6 chars, show last 3 chars
        const hintLength = Math.min(6, Math.floor(length / 2));
        const lastChars = generatedPassword.slice(-hintLength);
        const asterisks = '*'.repeat(Math.max(4, length - hintLength));
        const passwordHint = `${asterisks}${lastChars}`;

        const docRef = db.collection("passwords").doc();

        const passwordData: PasswordObjectType = {
            id: docRef.id,
            siteCode,
            length,
            usableTimes: usableTimes === 'unlimited' ? 'unlimited' : usableTimes,
            password: passwordHash, // <-- FIX 1: Store the hash
            passwordHint, // Store the hint for display
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000),
            deviceAddress: deviceIP ? await getAddressFromIP(deviceIP) : null,
            usedTimes: 0
        };

        await docRef.set(passwordData);

        revalidatePath("/admin/security");

        return {
            success: true,
            message: `Password generated successfully for ${siteCode.replace("-", " ")}`,
            data: {
                id: passwordData.id,
                password: generatedPassword, // <-- FIX 1: Return the original plaintext
                createdAt: passwordData.createdAt,
                expiresAt: passwordData.expiresAt
            }
        };

    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Internal server error!"
        };
    }
}

export const removePassword = async (id: string) => {
    await db.collection("passwords").doc(id).delete();
    revalidatePath("/admin/security");
    return { success: true };
};