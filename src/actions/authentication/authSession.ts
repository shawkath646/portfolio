"use server";
import crypto from "node:crypto";
import { db } from "@/lib/firebase";
import { AuthSessionRecord, AuthTokensType } from "@/types/auth.types"
import { AddressType, PlatformType } from "@/types/common.types";
import { timestampToDate } from "@/utils/dateTime";
import { generateToken, verifyToken } from "@/utils/tokens";

interface CreateAuthSessionPropsType {
  ipAddress: string;
  userAgent: string;
  platform: PlatformType;
  address: AddressType | null;
}

const ACCESS_TOKEN_MAX_VALIDITY = 7;
const REFRESH_TOKEN_MAX_VALIDITY = 30;

export const createAuthSession = async (props: CreateAuthSessionPropsType): Promise<AuthTokensType> => {
  const sessionId = crypto.randomBytes(32).toString("hex");

  const now = Date.now();
  const accessTokenTtlMs = now + ACCESS_TOKEN_MAX_VALIDITY * 24 * 60 * 60 * 1000;
  const refreshTokenTtlMs = now + REFRESH_TOKEN_MAX_VALIDITY * 24 * 60 * 60 * 1000;

  const accessToken = await generateToken({ sessionId }, accessTokenTtlMs);
  const refreshToken = await generateToken({ sessionId }, refreshTokenTtlMs);

  const tokens: AuthTokensType = {
    accessToken,
    refreshToken,
    accessTokenExpireAt: new Date(accessTokenTtlMs),
    refreshTokenExpireAt: new Date(refreshTokenTtlMs)
  }

  const sessionObject: AuthSessionRecord = {
    id: sessionId,
    tokens,
    updatedAt: new Date(),
    createdAt: new Date(),
    address: props.address,
    ipAddress: props.ipAddress,
    platform: props.platform,
    userAgent: props.userAgent
  }

  await db.collection("auth-sessions").doc(sessionId).set(sessionObject);

  return tokens;
}

export const refreshAuthSession = async (
  presentedRefreshToken: string
): Promise<AuthTokensType | null> => {
  const sessionId = await verifyToken(presentedRefreshToken);
  if (!sessionId) return null;

  const sessionRef = db.collection("auth-sessions").doc(sessionId);
  const sessionSnap = await sessionRef.get();
  if (!sessionSnap.exists) return null;

  const sessionRecord = sessionSnap.data() as AuthSessionRecord;

  const refreshTokenExpireAt = timestampToDate(
    sessionRecord.tokens.refreshTokenExpireAt
  );

  if (sessionRecord.tokens.refreshToken !== presentedRefreshToken) {
    return null;
  }

  if (refreshTokenExpireAt.getTime() <= Date.now()) {
    return null;
  }

  const now = Date.now();

  const newAccessTokenExpireAt = new Date(now + 7 * 24 * 60 * 60 * 1000);
  const newRefreshTokenExpireAt = new Date(now + 30 * 24 * 60 * 60 * 1000);

  const newAccessToken = await generateToken(
    { sessionId },
    newAccessTokenExpireAt
  );

  const newRefreshToken = await generateToken(
    { sessionId },
    newRefreshTokenExpireAt
  );

  await sessionRef.update({
    tokens: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpireAt: newAccessTokenExpireAt,
      refreshTokenExpireAt: newRefreshTokenExpireAt,
    },
    updatedAt: new Date(),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenExpireAt: newAccessTokenExpireAt,
    refreshTokenExpireAt: newRefreshTokenExpireAt,
  };
};


export const clearAuthSession = async (accessToken: string): Promise<boolean> => {
  const sessionId = await verifyToken(accessToken);
  if (!sessionId) return false;

  await db.collection("auth-sessions").doc(sessionId).delete();
  return true;
}

export const resolveSession = async (
  accessToken: string
): Promise<AuthSessionRecord | null> => {
  const sessionId = await verifyToken(accessToken);
  if (!sessionId) {
    return null;
  }

  const sessionDoc = await db
    .collection("auth-sessions")
    .doc(sessionId)
    .get();

  if (!sessionDoc.exists) {
    return null;
  }

  const session = sessionDoc.data() as AuthSessionRecord;

  session.tokens.accessTokenExpireAt = timestampToDate(
    session.tokens.accessTokenExpireAt
  );
  session.tokens.refreshTokenExpireAt = timestampToDate(
    session.tokens.refreshTokenExpireAt
  );

  if (session.tokens.accessTokenExpireAt.getTime() < Date.now()) {
    await clearAuthSession(accessToken);
    return null;
  }

  if (session.tokens.accessToken !== accessToken) {
    await clearAuthSession(accessToken);
    return null;
  }

  return session;
};
