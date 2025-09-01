"use server";
import { cookies } from "next/headers";
import { cache } from "react";
import bcrypt from "bcryptjs";
import { db } from "@/lib/firebase";

interface PasswordsDocType {
    [key: string]: string;
}

const getSiteAccess = cache(async (siteCode: string, password: string) => {
    const adminDoc = await db.collection("site-config").doc("passwords").get();

    if (!adminDoc.exists) return {
        success: false,
        error: "Admin configuration not found."
    }
    const passwordDoc = adminDoc.data() as PasswordsDocType;

    const isMatch = await bcrypt.compare(password, passwordDoc[siteCode]);
    if (!isMatch) return {
        success: false,
        error: "Invalid password."
    };

    const cookieStore = await cookies();
    cookieStore.set(siteCode, "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
    });

    return { success: true };
});

export default getSiteAccess;