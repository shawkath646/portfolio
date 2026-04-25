import {
    QueryDocumentSnapshot,
    Query,
    Timestamp,
} from "firebase-admin/firestore";

type CursorToken = {
    timestamp: number;
    id: string;
};

export const encodeCursor = (doc: QueryDocumentSnapshot): string => {
    const timestampValue = doc.get("timestamp");
    const timestampMillis =
        typeof timestampValue?.toMillis === "function"
            ? timestampValue.toMillis()
            : timestampValue instanceof Date
                ? timestampValue.getTime()
                : Number(timestampValue);

    const cursor: CursorToken = { timestamp: timestampMillis, id: doc.id };
    return Buffer.from(JSON.stringify(cursor)).toString("base64url");
};

export const decodeCursor = (cursor?: string): CursorToken | null => {
    if (!cursor) return null;
    try {
        const parsed = JSON.parse(
            Buffer.from(cursor, "base64url").toString("utf8")
        ) as Partial<CursorToken>;

        if (
            typeof parsed.timestamp !== "number" ||
            !Number.isFinite(parsed.timestamp) ||
            typeof parsed.id !== "string" ||
            !parsed.id
        ) {
            return null;
        }
        return parsed as CursorToken;
    } catch {
        return null;
    }
};

export const applyStartAfterCursor = (query: Query, startAfter?: string): Query => {
    const cursor = decodeCursor(startAfter);
    if (!cursor) return query;
    return query.startAfter(Timestamp.fromMillis(cursor.timestamp), cursor.id);
};

export const getPreviousCursor = async (
    query: Query,
    firstDoc: QueryDocumentSnapshot,
    limit: number
): Promise<string | undefined> => {
    const previousSnapshot = await query
        .endBefore(firstDoc.get("timestamp"), firstDoc.id)
        .limitToLast(limit + 1)
        .get();

    if (previousSnapshot.docs.length <= limit) return undefined;

    return encodeCursor(previousSnapshot.docs[0]);
};

export const getCursorPageNumber = async (
    query: Query,
    startAfter: string | undefined,
    limit: number
): Promise<number> => {
    const cursor = decodeCursor(startAfter);
    if (!cursor) return 1;

    const snapshot = await query
        .endAt(Timestamp.fromMillis(cursor.timestamp), cursor.id)
        .count()
        .get();

    return Math.floor(snapshot.data().count / limit) + 1;
};

export const buildCursorUrl = (
    basePath: string,
    cursor?: string
): string | undefined => {
    if (!cursor) return undefined;
    return `${basePath}?startAfter=${cursor}`;
};