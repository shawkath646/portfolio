"use server";
import { unauthorized } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/firebase";
import getLoginSession from "./getLoginSession";


const changeAdminPassword = async (newPassword: string) => {
    try {
        const loginSession = await getLoginSession("admin-panel");
        if (!loginSession.isAdministrator) unauthorized();
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        
        await db.collection("site-config").doc("admin-pass").update({
            passoword: newHashedPassword,
            lastChangedOn: new Date()
        });

        return {
            success: true,
            message: "Admin password updated successfully"
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to update admin password. Please try again."
        };
    }
};

export default changeAdminPassword;