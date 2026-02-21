type FirebaseTimestamp =
    | { toDate: () => Date }
    | { seconds: number; nanoseconds?: number };

export function timestampToDate(ts: FirebaseTimestamp | Date): Date {
    if (ts instanceof Date) {
        return ts;
    }

    if ("toDate" in ts && typeof ts.toDate === "function") {
        return ts.toDate();
    }

    const { seconds, nanoseconds = 0 } = ts as { seconds: number; nanoseconds?: number };
    const ms = seconds * 1000 + Math.floor(nanoseconds / 1e6);

    return new Date(ms);
}

export function formatDateTime(date: Date): string {
    return new Date(date).toLocaleString("en-US", {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
}

export function formatRelativeTime(date: Date): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export function imageNameToDate(filename: string): Date | null {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

    const pattern1 = /(\d{8})_(\d{6})/;
    const match1 = nameWithoutExt.match(pattern1);

    if (match1) {
        const dateStr = match1[1];
        const timeStr = match1[2];

        const year = parseInt(dateStr.substring(0, 4), 10);
        const month = parseInt(dateStr.substring(4, 6), 10) - 1;
        const day = parseInt(dateStr.substring(6, 8), 10);

        const hour = parseInt(timeStr.substring(0, 2), 10);
        const minute = parseInt(timeStr.substring(2, 4), 10);
        const second = parseInt(timeStr.substring(4, 6), 10);

        const date = new Date(year, month, day, hour, minute, second);

        if (!isNaN(date.getTime())) {
            return date;
        }
    }

    const pattern2 = /(\d{4})-?(\d{2})-?(\d{2})/;
    const match2 = nameWithoutExt.match(pattern2);

    if (match2) {
        const year = parseInt(match2[1], 10);
        const month = parseInt(match2[2], 10) - 1;
        const day = parseInt(match2[3], 10);

        const date = new Date(year, month, day);

        if (!isNaN(date.getTime())) {
            return date;
        }
    }

    const pattern3 = /Screenshot_(\d{8})-(\d{6})/;
    const match3 = nameWithoutExt.match(pattern3);

    if (match3) {
        const dateStr = match3[1];
        const timeStr = match3[2];

        const year = parseInt(dateStr.substring(0, 4), 10);
        const month = parseInt(dateStr.substring(4, 6), 10) - 1;
        const day = parseInt(dateStr.substring(6, 8), 10);

        const hour = parseInt(timeStr.substring(0, 2), 10);
        const minute = parseInt(timeStr.substring(2, 4), 10);
        const second = parseInt(timeStr.substring(4, 6), 10);

        const date = new Date(year, month, day, hour, minute, second);

        if (!isNaN(date.getTime())) {
            return date;
        }
    }

    return null;
}