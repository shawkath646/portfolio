"use server";
import { cookies } from "next/headers";
import { redirect, RedirectType, unauthorized } from "next/navigation";
import { verifyTokens } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";
import { SiteCodeType } from "@/types";

const siteLogout = async (siteCode: SiteCodeType) => {
    const cookieList = await cookies();
    const token = cookieList.get(`${siteCode}_access_token`);

    if (!token?.value) unauthorized();

    const verifyResult = await verifyTokens(token.value, siteCode);
    if (!verifyResult) unauthorized();

    await db.collection("login-attempts").doc(verifyResult.id).update({
        sessionTokens: FieldValue.delete(),
    });

    cookieList.delete(`${siteCode}_access_token`);
    return redirect("/", RedirectType.replace);
};

export default siteLogout;