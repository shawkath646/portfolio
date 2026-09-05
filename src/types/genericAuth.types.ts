import { AddressType } from "./common.types";

export type AccessScopeLabel = string;

export interface AccessScopeType {
    passwordId: string;
    route: string;
    createdAt: Date;
    expiresAt: Date;
}

export interface GenericAuthSessionRecordType {
    id: string;
    ip: string;
    userAgent: string;
    address: AddressType | null;
    allowedRoutes: string[];
    accessScope: AccessScopeType[];
}

export interface GenericAuthPasswordRecordType {
    id: string;
    name: string;
    allowedRoutes: string[];
    usableTimes: number | "unlimited";
    usedTimes: number;
    createdAt: Date;
    expiresAt: Date;
}

export interface GenericSessionTokenType {
    token: string;
    maxExpireAt: Date;
}