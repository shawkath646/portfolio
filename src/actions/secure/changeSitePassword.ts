"use server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/firebase";

const changeSitePassword = async (siteCode: string, newPassword: string) => {
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await db.collection("site-config").doc("passwords").update({
        [siteCode]: newHashedPassword
    });
};

export default changeSitePassword;