import { AddressType, PlatformType } from "@/types/common.types";

export interface LoginFailureEvent {
    id: string;
    ipAddress: string;
    userAgent: string;
    platform: PlatformType;
    occurredAt: Date;
    address: AddressType | null;
    failureReason: string;
}

export interface LoginFailureRecord {
    id: string;
    failedAttemptCount: number;
    lastFailedAt: Date;
    timestamp: Date;
}

export interface LoginAttemptRecord {
    id: string;
    ipAddress: string;
    userAgent: string;
    platform: PlatformType;
    address: AddressType | null;
    createdAt: Date;
    expiresAt: Date;
    verified: boolean;
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
