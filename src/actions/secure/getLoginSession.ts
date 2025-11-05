"use server";
import { cookies } from "next/headers";
import { unauthorized } from "next/navigation";
import { cache } from "react";
import { verifyTokens } from "@/lib/auth";
import { SiteCodeType } from "@/types";


const getLoginSession = cache(async(siteCode: SiteCodeType) => {
    const cookieList = await cookies();
    const token = cookieList.get(`${siteCode}_access_token`);
    if (!token?.value) unauthorized();
    const loginAttemptObject = await verifyTokens(token.value, siteCode);
    if (!loginAttemptObject) unauthorized();
    return loginAttemptObject;
});

export default getLoginSession;