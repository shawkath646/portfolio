import { db } from "@/lib/firebase";
import {
    LoginFailureEvent,
    LoginFailureRecord,
} from "@/types/auth.types";
import { timestampToDate } from "@/utils/dateTime";

const MAX_FAILED_LOGIN_ATTEMPTS = 3;
const LOGIN_LOCK_DURATION_MS = 60 * 60 * 1000;

export async function isLoginAllowed(
    ipAddress: string
): Promise<{ allowed: boolean; attemptsLeft: number }> {
    const recordRef = db.collection("login-failure-records").doc(ipAddress);
    const recordSnapshot = await recordRef.get();

    if (!recordSnapshot.exists) {
        return {
            allowed: true,
            attemptsLeft: MAX_FAILED_LOGIN_ATTEMPTS,
        };
    }

    const record = recordSnapshot.data() as LoginFailureRecord;
    record.lastFailedAt = timestampToDate(record.lastFailedAt);

    const remainingAttempts =
        MAX_FAILED_LOGIN_ATTEMPTS - record.failedAttemptCount;

    if (remainingAttempts > 0) {
        return {
            allowed: true,
            attemptsLeft: remainingAttempts,
        };
    }

    const lockExpiresAt =
        record.lastFailedAt.getTime() + LOGIN_LOCK_DURATION_MS;

    if (Date.now() > lockExpiresAt) {
        await recordRef.delete();
        return {
            allowed: true,
            attemptsLeft: MAX_FAILED_LOGIN_ATTEMPTS,
        };
    }

    return {
        allowed: false,
        attemptsLeft: 0,
    };
}


export async function recordFailedLoginAttempt(
    event: LoginFailureEvent
): Promise<void> {
    const recordRef = db.collection("login-failure-records").doc(event.ipAddress);
    const recordSnapshot = await recordRef.get();

    if (!recordSnapshot.exists) {
        const newRecord: LoginFailureRecord = {
            id: event.ipAddress,
            failedAttemptCount: 1,
            lastFailedAt: new Date(),
            timestamp: new Date()
        };

        await recordRef.set(newRecord);
        return;
    }

    const existingRecord = recordSnapshot.data() as LoginFailureRecord;

    await recordRef.update({
        failedAttemptCount: existingRecord.failedAttemptCount + 1,
        lastFailedAt: new Date(),
    });
}

export async function clearLoginFailureRecord(
    ipAddress: string
): Promise<void> {
    await db.collection("login-failure-records").doc(ipAddress).delete();
}
