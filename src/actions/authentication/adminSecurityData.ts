import { db } from "@/lib/firebase";
import { AuthSessionRecord, LoginAttemptRecord } from "@/types/auth.types";
import { PartialBy } from "@/types/common.types";
import { timestampToDate } from "@/utils/dateTime";
import { getAuthSession } from "./authSession";

export interface AuthSessionResType extends PartialBy<AuthSessionRecord, "tokens"> {
    isCurrent: boolean;
    accessTokenExpiresAt: Date;
}

export async function getActiveSessions(): Promise<AuthSessionResType[]> {
    const currentSession = await getAuthSession();
    if (!currentSession) {
        throw new Error("Error: Permission denied! Session not found.");
    }

    const snapshot = await db.collection("auth-sessions").get();
    const now = Date.now();

    const sessions: AuthSessionResType[] = [];

    for (const doc of snapshot.docs) {
        const data = doc.data() as AuthSessionRecord;

        const accessExpiry = timestampToDate(data.tokens.accessTokenExpireAt);
        if (accessExpiry.getTime() < now) continue;

        data.createdAt = timestampToDate(data.createdAt);
        data.updatedAt = timestampToDate(data.updatedAt);

        const sessionRes: AuthSessionResType = {
            ...data,
            isCurrent: doc.id === currentSession.id,
            accessTokenExpiresAt: accessExpiry,
        };
        delete sessionRes.tokens;

        sessions.push(sessionRes);
    }

    sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return sessions;
}

export type GetLoginAttemptsResponse = (LoginAttemptRecord & { isExpired: boolean })[];

export async function getLoginAttempts(): Promise<GetLoginAttemptsResponse> {
    const session = await getAuthSession();
    if (!session) {
        throw new Error("Error: Session not found.");
    }

    const snapshot = await db.collection("login-attempts").get();
    const now = Date.now();
    const EXPIRY_MS = 5 * 60 * 1000;

    const attempts: GetLoginAttemptsResponse =
        snapshot.docs.map((doc) => {
            const data = doc.data() as LoginAttemptRecord;
            const timestamp = timestampToDate(data.timestamp);

            const isExpired = timestamp.getTime() + EXPIRY_MS < now;

            return {
                ...data,
                timestamp,
                isExpired,
            };
        });

    return attempts;
}
