"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import { APIResponseType } from "@/types/common.types";
import {
    AccessScopeLabel,
    GenericAuthPasswordRecordType,
} from "@/types/genericAuth.types";
import { timestampToDate } from "@/utils/dateTime";
import { getAuthSession } from "../authentication/authActions";

interface GeneratePasswordPropsType {
    scopeLabels: AccessScopeLabel[];
    length: number;
    expireDays: number;
    includeLowercase: boolean;
    includeSpecial: boolean;
    includeUppercase: boolean;
    includeNumbers: boolean;
    usableTimes: number | "unlimited";
}

interface GeneratePasswordResponseType extends APIResponseType {
    password?: string;
}


const CHARSETS = {
    LOWERCASE: "abcdefghijklmnopqrstuvwxyz",
    UPPERCASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    NUMBERS: "0123456789",
    SPECIAL: "!@#$%^&*()-_=+[]{}<>?",
};

// Cryptographically secure Fisher-Yates shuffle
function secureShuffle(str: string): string {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = crypto.randomInt(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

export async function generatePassword(
    props: GeneratePasswordPropsType
): Promise<GeneratePasswordResponseType> {

    const adminSession = await getAuthSession();
    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found."
        };
    }

    try {
        const {
            scopeLabels,
            length,
            expireDays,
            includeLowercase,
            includeUppercase,
            includeNumbers,
            includeSpecial,
            usableTimes,
        } = props;

        if (length < 6) {
            return { success: false, message: "Password length must be at least 6 characters." };
        }

        let isUnique = false;
        let finalPassword = "";

        while (!isUnique) {
            let charset = "";
            let password = "";

            if (includeLowercase) {
                charset += CHARSETS.LOWERCASE;
                password += CHARSETS.LOWERCASE[crypto.randomInt(CHARSETS.LOWERCASE.length)];
            }
            if (includeUppercase) {
                charset += CHARSETS.UPPERCASE;
                password += CHARSETS.UPPERCASE[crypto.randomInt(CHARSETS.UPPERCASE.length)];
            }
            if (includeNumbers) {
                charset += CHARSETS.NUMBERS;
                password += CHARSETS.NUMBERS[crypto.randomInt(CHARSETS.NUMBERS.length)];
            }
            if (includeSpecial) {
                charset += CHARSETS.SPECIAL;
                password += CHARSETS.SPECIAL[crypto.randomInt(CHARSETS.SPECIAL.length)];
            }

            if (!charset) {
                return { success: false, message: "At least one character type must be selected." };
            }

            const remainingLength = length - password.length;
            for (let i = 0; i < remainingLength; i++) {
                password += charset[crypto.randomInt(charset.length)];
            }

            password = secureShuffle(password);

            const existingDoc = await db.collection("generic-passwords")
                .where("password", "==", password)
                .limit(1)
                .get();

            if (existingDoc.empty) {
                isUnique = true;
                finalPassword = password;
            }
        }

        const createdAt = new Date();
        const expiresAt = new Date();
        expiresAt.setDate(createdAt.getDate() + expireDays);

        const docRef = db.collection("generic-passwords").doc();

        const record: GenericAuthPasswordRecordType = {
            id: docRef.id,
            accessScope: scopeLabels,
            password: finalPassword,
            passwordHint: finalPassword.slice(0, 4),
            usableTimes,
            createdAt,
            expiresAt,
            length,
            usedTimes: 0,
        };

        await docRef.set(record);
        revalidatePath("/admin/secure");

        return {
            success: true,
            message: "Password generated successfully.",
            password: finalPassword
        };

    } catch (error) {
        console.error("Password generation error:", error);
        return {
            success: false,
            message: "Error: Something went wrong! Failed to generate password.",
        };
    }
}

interface GetAllGenericPasswordResponseType extends APIResponseType {
    passwordList?: GenericAuthPasswordRecordType[];
    expiredCount?: number;
}

export const getAllPasswords = async (): Promise<GetAllGenericPasswordResponseType> => {
    const adminSession = await getAuthSession();
    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found."
        };
    }

    const passwordSnapshot = await db.collection("generic-passwords").get();

    const now = Date.now();

    let expiredCount = 0;

    const passwordList: GenericAuthPasswordRecordType[] =
        passwordSnapshot.docs.map(doc => {
            const passwordData = doc.data() as GenericAuthPasswordRecordType;

            passwordData.createdAt = timestampToDate(passwordData.createdAt);
            passwordData.expiresAt = timestampToDate(passwordData.expiresAt);

            if (passwordData.expiresAt.getTime() <= now) {
                expiredCount++;
            }

            return passwordData;
        });

    return {
        success: true,
        message: "Password list fetched successfully.",
        passwordList,
        expiredCount
    };
};

export async function deletePassword(passwordId: string): Promise<APIResponseType> {
    const adminSession = await getAuthSession();

    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found."
        };
    }

    await db.collection("generic-passwords").doc(passwordId).delete();

    revalidatePath("/admin/secure");
    revalidatePath("/admin/security");

    return {
        success: true,
        message: "Password deleted successfully."
    }
}

export async function cleanupExpirePassword(): Promise<APIResponseType> {
    const adminSession = await getAuthSession();

    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found.",
        };
    }

    try {
        const allPasswordResponse = await getAllPasswords();
        if (!allPasswordResponse.success || !allPasswordResponse.passwordList) {
            return {
                success: false,
                message: allPasswordResponse.message,
            };
        }

        const now = new Date();

        const expiredPasswords = allPasswordResponse.passwordList.filter(
            (password) => new Date(password.expiresAt) <= now
        );

        if (expiredPasswords.length === 0) {
            return {
                success: true,
                message: "No expired passwords found.",
            };
        }

        await Promise.all(
            expiredPasswords.map((password) =>
                db.collection("generic-passwords").doc(password.id).delete()
            )
        );

        revalidatePath("/admin/secure");

        return {
            success: true,
            message: `${expiredPasswords.length} expired password(s) cleaned successfully.`,
        };

    } catch (error) {
        console.error("cleanupExpirePassword error:", error);

        return {
            success: false,
            message: "Error: Failed to clean expired passwords.",
        };
    }
}

