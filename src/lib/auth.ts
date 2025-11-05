"use server";
import { cache } from "react";
import { jwtVerify, SignJWT, JWTPayload } from "jose";
import { db } from "@/lib/firebase";
import { SiteCodeType } from "@/types";
import { LoginAttemptObjectType } from "@/actions/secure/getSiteAccess";

const siteTokenExpire = 1 * 86400
const adminTokenExpire = 7 * 86400;
const accessTokenExpire = 3 * 86400;
const refreshTokenExpire = 30 * 86400;

const ADMIN_AUTH_SECRET = process.env.ADMIN_AUTH_SECRET;
if (!ADMIN_AUTH_SECRET) throw Error("Error: ADMIN_AUTH_SECRET not found!");

const SITE_AUTH_SECRET = process.env.SITE_AUTH_SECRET;
if (!SITE_AUTH_SECRET) throw Error("Error: SITE_AUTH_SECRET not found!");

const CLIENT_APP_AUTH_SECRET = process.env.CLIENT_APP_AUTH_SECRET;
if (!CLIENT_APP_AUTH_SECRET) throw new Error("Error: CLIENT_APP_AUTH_SECRET not found!");

const encoder = new TextEncoder();
const adminAuthKey = encoder.encode(ADMIN_AUTH_SECRET);
const siteAuthKey = encoder.encode(SITE_AUTH_SECRET);
const clientAppAuthKey = encoder.encode(CLIENT_APP_AUTH_SECRET);

export interface SessionTokensType {
    token: string;
    expireAt: Date;
}

export interface ClientAppTokensType {
    accessToken: string;
    refreshToken: string;
    accessExpiresAt: Date;
    refreshExpiresAt: Date;
}

export interface SessionTokenPayload extends JWTPayload {
    siteCode: SiteCodeType;
    loginAttemptId: string;
    passwordId?: string;
}

export interface ClientAppTokenPayload extends JWTPayload {
    loginAttemptId: string;
    tokenType: 'access' | 'refresh';
    clientIp: string;
}

export async function generateSessionToken(
  loginAttemptId: string,
  siteCode: SiteCodeType,
  isAdministrator: boolean,
  passwordExpiresAt?: Date,
  passwordId?: string
) {
  const now = Date.now();
  const nowInSeconds = Math.floor(now / 1000);

  const payload: SessionTokenPayload = {
    loginAttemptId,
    siteCode,
    passwordId,
  };

  let accessExpireSeconds: number;
  let refreshExpireSeconds: number;

  if (isAdministrator) {
    accessExpireSeconds = adminTokenExpire;
    refreshExpireSeconds = adminTokenExpire * 2;
  } else if (passwordExpiresAt) {
    const remainingMs = passwordExpiresAt.getTime() - now;
    const remainingSeconds = Math.max(1, Math.floor(remainingMs / 1000));

    accessExpireSeconds = Math.min(remainingSeconds, siteTokenExpire);
    refreshExpireSeconds = Math.min(remainingSeconds, siteTokenExpire * 2);
  } else {
    accessExpireSeconds = siteTokenExpire;
    refreshExpireSeconds = siteTokenExpire * 2;
  }

  const accessToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(nowInSeconds)
    .setExpirationTime(nowInSeconds + accessExpireSeconds)
    .sign(isAdministrator ? adminAuthKey : siteAuthKey);

  const refreshToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(nowInSeconds)
    .setExpirationTime(nowInSeconds + refreshExpireSeconds)
    .sign(isAdministrator ? adminAuthKey : siteAuthKey);

  const sessionTokens: SessionTokensType & { refreshToken: string } = {
    token: accessToken,
    expireAt: new Date(now + accessExpireSeconds * 1000),
    refreshToken,
  };

  await db
    .collection("login-attempts")
    .doc(loginAttemptId)
    .update({ sessionTokens } as Partial<LoginAttemptObjectType>);

  return sessionTokens;
}


export async function generateClientAppToken(
    loginAttemptId: string,
    clientIp: string
) {
    const now = Date.now();
    const nowInSeconds = Math.floor(now / 1000);

    const accessPayload: ClientAppTokenPayload = {
        loginAttemptId,
        tokenType: "access",
        clientIp
    };

    const refreshPayload: ClientAppTokenPayload = {
        loginAttemptId,
        tokenType: "refresh",
        clientIp
    };

    const accessToken = await new SignJWT(accessPayload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt(nowInSeconds)
        .setExpirationTime(nowInSeconds + accessTokenExpire)
        .sign(clientAppAuthKey);

    const refreshToken = await new SignJWT(refreshPayload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt(nowInSeconds)
        .setExpirationTime(nowInSeconds + refreshTokenExpire)
        .sign(clientAppAuthKey);

    const clientAppTokens: ClientAppTokensType = {
        accessToken,
        refreshToken,
        accessExpiresAt: new Date(now + (accessTokenExpire * 1000)),
        refreshExpiresAt: new Date(now + (refreshTokenExpire * 1000))
    };

    await db.collection("login-attempts").doc(loginAttemptId).update({ clientAppTokens } as Partial<LoginAttemptObjectType>);
    return clientAppTokens;
}

export const verifyTokens = cache(async(
    token: string,
    siteCode: SiteCodeType
): Promise<LoginAttemptObjectType | null> => {
    let keysToTry: Uint8Array[];

    switch (siteCode) {
        case "admin-panel":
            keysToTry = [adminAuthKey, siteAuthKey];
            break;
        case "client-app":
            keysToTry = [clientAppAuthKey];
            break;
        default:
            keysToTry = [siteAuthKey];
            break;
    }

    for (const key of keysToTry) {
        try {
            const { payload } = await jwtVerify(token, key) as {
                payload: SessionTokenPayload | ClientAppTokenPayload;
            };

            if (!("loginAttemptId" in payload) || !payload.loginAttemptId) {
                continue;
            }

            const docSnap = await db.collection("login-attempts").doc(payload.loginAttemptId).get();
            if (!docSnap.exists) continue;

            const data = docSnap.data() as LoginAttemptObjectType;
            data.id = docSnap.id;

            if (data.invoked) return null;
            return data;
        } catch {
            continue;
        }
    }

    return null;
});


export async function refreshClientAppTokens(refreshToken: string, clientIp: string) {
    const loginAttemptObject = await verifyTokens(refreshToken, "client-app");
    if (!loginAttemptObject || loginAttemptObject.clientAppTokens?.refreshToken !== refreshToken) {
        return { success: false, message: "Token generation failed!" };
    }
    const newTokens = await generateClientAppToken(loginAttemptObject.id, clientIp);
    return { success: true, message: "New tokens generated.", data: newTokens };
}
