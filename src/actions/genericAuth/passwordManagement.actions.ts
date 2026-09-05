"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/actions/authentication/authSession";
import { RouteScope } from "@/data/site_scopes";
import { db } from "@/lib/firebase";
import { APIResponseType } from "@/types/common.types";
import { GenericAuthPasswordRecordType } from "@/types/genericAuth.types";
import {
    GeneratePasswordPropsType,
    GeneratePasswordResponseType,
    getAllPasswords,
    getDynamicRouteScopes,
    hashGenericPassword,
} from "./passwordManagement";

export async function getDynamicRouteScopesAction(): Promise<RouteScope[]> {
    return await getDynamicRouteScopes();
}

export async function generatePassword(
    props: GeneratePasswordPropsType
): Promise<GeneratePasswordResponseType> {
    const adminSession = await getAuthSession();
    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found.",
        };
    }

    try {
        const { name, allowedRoutes, expireDays, usableTimes } = props;

        if (!name || !name.trim()) {
            return { success: false, message: "Error: Password name is required." };
        }

        if (!allowedRoutes || !Array.isArray(allowedRoutes) || allowedRoutes.length === 0) {
            return { success: false, message: "Error: At least one allowed route must be selected." };
        }

        if (expireDays <= 0) {
            return { success: false, message: "Error: Expiration days must be greater than 0." };
        }

        // Generate cryptographically secure UUID password
        const rawPassword = crypto.randomUUID().replace('-', '');
        const passwordHash = hashGenericPassword(rawPassword);

        const createdAt = new Date();
        const expiresAt = new Date();
        expiresAt.setDate(createdAt.getDate() + expireDays);

        const record: GenericAuthPasswordRecordType = {
            id: passwordHash,
            name: name.trim(),
            allowedRoutes,
            usableTimes,
            usedTimes: 0,
            createdAt,
            expiresAt,
        };

        // Store with password hash as document ID; raw password is never stored in DB
        await db.collection("generic-passwords").doc(passwordHash).set(record);
        revalidatePath("/admin/security");

        return {
            success: true,
            message: "Password generated successfully.",
            password: rawPassword,
        };
    } catch (error) {
        console.error("Password generation error:", error);
        return {
            success: false,
            message: "Error: Something went wrong! Failed to generate password.",
        };
    }
}

export async function deletePassword(passwordId: string): Promise<APIResponseType> {
    const adminSession = await getAuthSession();
    if (!adminSession) {
        return {
            success: false,
            message: "Error: Permission denied! Session not found.",
        };
    }

    await db.collection("generic-passwords").doc(passwordId).delete();
    revalidatePath("/admin/security");

    return {
        success: true,
        message: "Password deleted successfully.",
    };
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

        const batch = db.batch();
        for (const password of expiredPasswords) {
            batch.delete(db.collection("generic-passwords").doc(password.id));
        }
        await batch.commit();

        revalidatePath("/admin/security");

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
