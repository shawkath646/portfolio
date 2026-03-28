import { AddressType } from "./common.types";

export type AccessScopeLabel = "personal_life" | "friends_corner" | "love_corner";

export interface AccessScopeType {
    passwordId: string;
    scopeLabel: AccessScopeLabel;
    createdAt: Date;
    expiresAt: Date;
}

export interface GenericAuthSessionRecordType {
    id: string;
    ip: string;
    userAgent: string;
    address: AddressType | null;
    accessScope: AccessScopeType[];
}

export interface GenericAuthPasswordRecordType {
    id: string;
    accessScope: AccessScopeLabel[];
    password: string;
    passwordHint: string;
    usableTimes: number | 'unlimited';
    createdAt: Date;
    expiresAt: Date;
    length: number;
    usedTimes: number;
}

export interface GenericSessionTokenType {
    token: string;
    maxExpireAt: Date;
}