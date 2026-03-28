import { db } from "@/lib/firebase";

const MAX_FAILED_LOGIN_ATTEMPTS = 3;
const LOGIN_LOCK_DURATION_MS = 60 * 60 * 1000;

export async function isLoginAllowed(
    ipAddress: string
): Promise<{ allowed: boolean; attemptsLeft: number }> {
    const oneHourAgo = new Date(Date.now() - LOGIN_LOCK_DURATION_MS);

    const query = db
        .collection("login-attempts")
        .where("ipAddress", "==", ipAddress)
        .where("shouldCount", "==", true)
        .where("status", "in", ["failed", "locked"])
        .where("timestamp", ">=", oneHourAgo);

    const snapshot = await query.count().get();
    const failedAttempts = snapshot.data().count;

    return {
        allowed: failedAttempts < MAX_FAILED_LOGIN_ATTEMPTS,
        attemptsLeft: Math.max(0, MAX_FAILED_LOGIN_ATTEMPTS - failedAttempts),
    };
}
