import { AddressType, PlatformType } from "@/types/common.types";

export interface LoginAttemptRecord {
    id: string;
    ipAddress: string;
    userAgent: string;
    platform: PlatformType;
    address: AddressType | null;
    timestamp: Date;
    status: "failed" | "waiting" | "success" | "locked" | "expired";
    shouldCount: boolean;
    type: "admin" | "generic";
    attemptCount2FA: number;
}

export interface AuthSessionRecord {
    id: string;
    ipAddress: string;
    userAgent: string;
    platform: PlatformType;
    address: AddressType | null;
    createdAt: Date;
    updatedAt: Date;
    tokens: AuthTokensType;
}

export interface AuthTokensType {
    accessToken: string;
    refreshToken: string;
    accessTokenExpireAt: Date;
    refreshTokenExpireAt: Date;
}

export interface AdminCredentialsRecord {
    password: string;
    lastChangedOn: Date;
    blockedIPs: string[];
    totpSecret: string;
    totpCreatedOn: Date | null;
}
