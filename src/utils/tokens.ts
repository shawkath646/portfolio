import { jwtVerify, SignJWT, JWTPayload, errors } from "jose";
import { AuthTokenPayload } from "@/types/common.types";
import { getEnv } from "@/utils/getEnv";

const secret = new TextEncoder().encode(getEnv("AUTH_TOKEN_SECRET"));
const defaultExpirationTime = getEnv("TOKEN_DEFAULT_EXPIRATION_TIME");

type JwtTokenPayload = AuthTokenPayload & JWTPayload;

async function verifyToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify<JwtTokenPayload>(token, secret);

    return payload.sessionId || null;
  } catch (error) {

    if (error instanceof errors.JWTExpired) {
      return null;
    }

    if (error instanceof Error) {
      console.warn("[Auth] JWT Verification failed for non-expiration reason:", error.message);
    } else {
      console.warn("[Auth] JWT Verification failed with an unknown error.");
    }

    return null;
  }
}

function generateToken(
  payload: AuthTokenPayload,
  expirationTime: number | string | Date = defaultExpirationTime
): Promise<string> {
  if (!payload.sessionId) {
    throw new Error("sessionId is required to generate token");
  }

  return new SignJWT({
    sessionId: payload.sessionId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(secret);
}

export { verifyToken, generateToken };