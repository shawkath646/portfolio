"use server";

import { cache } from "react";
import { jwtVerify, JWTPayload, JWTVerifyResult } from "jose";
import { SiteCodeType } from "@/types";

const ADMIN_AUTH_SECRET = process.env.ADMIN_AUTH_SECRET;
if (!ADMIN_AUTH_SECRET) throw Error("Error: ADMIN_AUTH_SECRET not found!");
const SITE_AUTH_SECRET = process.env.SITE_AUTH_SECRET;
if (!SITE_AUTH_SECRET) throw Error("Error: SITE_AUTH_SECRET not found!");

/**
 * Custom payload type that we expect to find in the JWTs.
 * Both admin and site tokens carry loginAttemptId.
 */
interface AuthPayload extends JWTPayload {
    loginAttemptId?: string;
    passwordId?: string; // Optional for site tokens
}

/**
 * Verifies a JWT token against the appropriate secret(s) for the given site code.
 * @param token The JWT string to verify.
 * @param siteCode The site context ("admin-panel" or others) to determine which secret(s) to use.
 * @returns The loginAttemptId string if verification is successful and the ID is present, otherwise returns null.
 */
export const verifyTokens = cache(async (token: string, siteCode: SiteCodeType): Promise<string | null> => {
    
    let verifiedPayload: AuthPayload | null = null;
    const encoder = new TextEncoder();

    const secrets = siteCode === "admin-panel"
        ? [encoder.encode(ADMIN_AUTH_SECRET), encoder.encode(SITE_AUTH_SECRET)]
        : [encoder.encode(SITE_AUTH_SECRET)];
    
    for (const secretKey of secrets) {
        try {
            const verifyResult: JWTVerifyResult<AuthPayload> = await jwtVerify(token, secretKey);
            verifiedPayload = verifyResult.payload;
            
            if (verifiedPayload?.loginAttemptId) {
                return verifiedPayload.loginAttemptId;
            }
            
        } catch (error) {
            // Log failure but continue to the next secret if available
            console.debug(`JWT verification failed with one secret for site ${siteCode}. Error:`, (error as Error).message);
        }
    }

    return null;
});

export default verifyTokens;
