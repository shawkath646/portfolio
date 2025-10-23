"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import { PasswordObjectType } from "@/app/admin/security/PasswordManagement";
import getAddressFromIP from "@/utils/getAddressFromIP";
import { SiteCodeType } from "@/types";

interface ServerResponse {
    success: boolean;
    message: string;
    data?: {
        id: string;
        password: string;
        createdAt: Date;
        expiresAt: Date
    };
}

function createPassword(
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

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
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

export async function generatePasswordAction({
    siteCode, expireDays, length, usableTimes,
    includeLowercase = true,
    includeNumbers = true,
    includeSpecial = true,
    includeUppercase = true
}: GeneratePasswordPropsType): Promise<ServerResponse> {

    const headerList = await headers();
    const deviceIP = headerList.get('x-forwarded-for') || headerList.get('x-real-ip');

    try {
        if (!siteCode || !length || !expireDays || !usableTimes) {
            return {
                success: false,
                message: "Missing required fields",
            };
        }

        const generatedPassword = createPassword(
            length,
            includeUppercase,
            includeLowercase,
            includeNumbers,
            includeSpecial
        );

        const docRef = db.collection("passwords").doc();

        const passwordData: PasswordObjectType = {
            id: docRef.id,
            siteCode,
            length,
            usableTimes: usableTimes === 'unlimited' ? 'unlimited' : usableTimes,
            password: generatedPassword,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000),
            deviceAddress: deviceIP ? await getAddressFromIP(deviceIP) : "Unknown device",
            usedTimes: 0
        };

        await docRef.set(passwordData);

        revalidatePath("/admin/security");

        return {
            success: true,
            message: `Password generated successfully for ${siteCode.replace("-", " ")}`,
            data: {
                id: passwordData.id,
                password: passwordData.password,
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
