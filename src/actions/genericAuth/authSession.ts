"use server";

import crypto from "node:crypto";
import { db } from "@/lib/firebase";
import {
    GenericAuthSessionRecordType,
    GenericAuthPasswordRecordType,
    AccessScopeType,
    GenericSessionTokenType,
    AccessScopeLabel,
} from "@/types/genericAuth.types";
import { timestampToDate } from "@/utils/dateTime";
import { getAddressFromIP } from "@/utils/ipAddress";
import { generateToken, verifyToken } from "@/utils/tokens";


interface GenericAuthPasswordRecordPropsType {
    usedPasswordObj: GenericAuthPasswordRecordType;
    clientIp: string;
    userAgent: string;
    existingCookie?: string;
}


export async function createGenericAuthSession(props: GenericAuthPasswordRecordPropsType): Promise<GenericSessionTokenType | null> {
    try {
        const now = new Date();
        const sessionsDb = db.collection("generic-sessions");
        
        let sessionId: string | null = null;
        let sessionRecord: GenericAuthSessionRecordType | null = null;

        if (props.existingCookie) {
            const decodedSessionId = await verifyToken(props.existingCookie);

            if (decodedSessionId) {
                const docSnap = await sessionsDb.doc(decodedSessionId).get();

                if (docSnap.exists) {
                    const data = docSnap.data() as GenericAuthSessionRecordType;

                    const validScopes = data.accessScope.filter(
                        (scope) => timestampToDate(scope.expiresAt) > now
                    );

                    if (validScopes.length > 0) {
                        sessionId = data.id;
                        sessionRecord = {
                            ...data,
                            accessScope: validScopes,
                        };
                    } else {
                        await sessionsDb.doc(data.id).delete();
                    }
                }
            }
        }

        if (!sessionRecord || !sessionId) {
            sessionId = crypto.randomBytes(32).toString("hex");
            sessionRecord = {
                id: sessionId,
                ip: props.clientIp,
                userAgent: props.userAgent,
                address: await getAddressFromIP(props.clientIp),
                accessScope: [],
            };
        }

        const scopeMap = new Map<string, AccessScopeType>();
        
        for (const scope of sessionRecord.accessScope) {
            scopeMap.set(scope.scopeLabel, scope);
        }

        for (const scopeLabel of props.usedPasswordObj.accessScope) {
            const newScope: AccessScopeType = {
                passwordId: props.usedPasswordObj.id,
                scopeLabel,
                createdAt: now,
                expiresAt: props.usedPasswordObj.expiresAt,
            };

            const existingScope = scopeMap.get(scopeLabel);
            
            if (!existingScope || timestampToDate(newScope.expiresAt) > timestampToDate(existingScope.expiresAt)) {
                scopeMap.set(scopeLabel, newScope);
            }
        }

        sessionRecord.accessScope = Array.from(scopeMap.values());

        let maxExpireAt = new Date(0);
        for (const scope of sessionRecord.accessScope) {
            const expireDate = timestampToDate(scope.expiresAt);
            if (expireDate > maxExpireAt) {
                maxExpireAt = expireDate;
            }
        }

        await sessionsDb.doc(sessionId).set(sessionRecord);

        const token = await generateToken(
            { sessionId },
            maxExpireAt
        );

        return { token, maxExpireAt };
    } catch (error) {
        console.error("Session creation error:", error);
        return null;
    }
}

export async function clearGenericAuthSession(authToken: string): Promise<boolean> {
    const sessionId = await verifyToken(authToken);
    if (!sessionId) {
        return false;
    }

    await db.collection("geneic-sessions").doc(sessionId).delete();
    return true;
}

export async function resolveGenericAuthSession(
    authToken: string,
    requestedScope: AccessScopeLabel
): Promise<GenericAuthSessionRecordType | null> {
    const sessionId = await verifyToken(authToken);
    if (!sessionId) {
        return null;
    }

    const sessionDoc = await db
        .collection("generic-sessions")
        .doc(sessionId)
        .get();

    if (!sessionDoc.exists) {
        return null;
    }

    const session = sessionDoc.data() as GenericAuthSessionRecordType;

    const matchedScope = session.accessScope.find(
        (scope) => scope.scopeLabel === requestedScope
    );

    if (!matchedScope) {
        return null;
    }

    const now = new Date();

    if (timestampToDate(matchedScope.expiresAt) <= now) {
        return null;
    }

    return session;
}
