// src/utils/timestampToDate.ts

export type FirebaseTimestamp =
  | { toDate: () => Date }
  | { seconds: number; nanoseconds?: number };

/**
 * Converts a Firebase Timestamp to a native Date.
 */
export function timestampToDate(ts: FirebaseTimestamp | Date): Date {
  if (ts instanceof Date) {
    return ts;
  }

  if ("toDate" in ts && typeof ts.toDate === "function") {
    return ts.toDate();
  }

  // At this point, ts must be the { seconds; nanoseconds } type
  const { seconds, nanoseconds = 0 } = ts as { seconds: number; nanoseconds?: number };
  const ms = seconds * 1000 + Math.floor(nanoseconds / 1e6);

  return new Date(ms);
}
