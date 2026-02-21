"use server";

import bcrypt from "bcryptjs";
import { verifySync } from "otplib";
import { db } from "@/lib/firebase";
import { AdminCredentialsRecord } from "@/types/auth.types";
import { APIResponseType } from "@/types/common.types";
import { getAuthSession } from "./authActions";

const changeAdminPassword = async (
    oldPassword: string,
    newPassword: string,
    apcOtp: string
): Promise<APIResponseType> => {
    try {
        const loginSession = await getAuthSession();

        if (!loginSession) {
            return {
                success: false,
                message: "Error: Permission denied! Session not found."
            };
        }

        const adminDoc = await db
            .collection("site-config")
            .doc("admin-pass")
            .get();

        if (!adminDoc.exists) {
            return {
                success: false,
                message: "Admin password configuration not found."
            };
        }

        const adminCredentials = adminDoc.data() as AdminCredentialsRecord;

        const isOldPasswordValid = await bcrypt.compare(
            oldPassword,
            adminCredentials.password
        );

        if (!isOldPasswordValid) {
            return {
                success: false,
                message: "Error: Old password is incorrect."
            };
        }

        const isSameAsOld = await bcrypt.compare(
            newPassword,
            adminCredentials.password
        );

        if (isSameAsOld) {
            return {
                success: false,
                message: "Error: New password must be different from the old password."
            };
        };

        const result = verifySync({ token: apcOtp, secret: adminCredentials.totpSecret });
        if (!result.valid) {
            return { success: false, message: "Error: Invalid OTP code." };
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 12);

        await db.collection("site-config").doc("admin-pass").update({
            password: newHashedPassword,
            lastChangedOn: new Date()
        });

        return {
            success: true,
            message: "Admin password updated successfully."
        };
    } catch (error) {
        console.error("Password change error:", error);

        return {
            success: false,
            message: "Failed to update admin password. Please try again."
        };
    }
};

export default changeAdminPassword;