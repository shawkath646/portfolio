"use server";
import { cache } from "react";
import { cookies } from "next/headers";
import { unauthorized } from "next/navigation";
import { db } from "@/lib/firebase";
import { LoginAttemptObjectType } from "./getSiteAccess";
import verifyTokens from "@/utils/verifyTokens";
import { SiteCodeType } from "@/types";


const getLoginSession = cache(async (siteCode: SiteCodeType): Promise<LoginAttemptObjectType> => {
    const cookieList = await cookies();
    
    const accessTokenCookie = cookieList.get(`${siteCode}_access_token`);
    
    if (!accessTokenCookie?.value) {
        console.debug(`Access denied for site ${siteCode}: Missing token.`);
        unauthorized();
    }

    const loginAttemptId = await verifyTokens(accessTokenCookie.value, siteCode);
    
    if (!loginAttemptId) {
        console.debug(`Access denied for site ${siteCode}: Invalid token payload or signature.`);
        unauthorized();
    }

    const docRef = await db.collection("login-attempts").doc(loginAttemptId).get();
    
    if (!docRef.exists) {
        console.warn(`Access denied for site ${siteCode}: Login attempt ID ${loginAttemptId} not found in DB.`);
        unauthorized();
    }

    const loginAttempObject = docRef.data() as LoginAttemptObjectType;
    
    if (!loginAttempObject.success || loginAttempObject.siteCode !== siteCode || loginAttempObject.tokens?.accessToken !== accessTokenCookie.value) {
        console.warn(`Access denied for site ${siteCode}: Session failed success check, tokens or site mismatch.`);
        unauthorized();
    }

    return loginAttempObject;
});

export default getLoginSession;
