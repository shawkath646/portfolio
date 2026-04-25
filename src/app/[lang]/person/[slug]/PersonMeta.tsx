import type { PersonObj } from "@/types/common.types";
import { formatDateTime } from "@/utils/dateTime";

interface PersonMetaProps {
    person: PersonObj;
}

function calculateDuration(start: Date, end: Date) {
    const ms = end.getTime() - start.getTime();
    const dayMs = 1000 * 60 * 60 * 24;
    const totalDays = Math.max(0, Math.floor(ms / dayMs));

    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const days = totalDays - years * 365 - months * 30;

    const parts: string[] = [];
    if (years > 0) parts.push(`${years}y`);
    if (months > 0) parts.push(`${months}m`);
    if (days > 0 || parts.length === 0) parts.push(`${days}d`);

    return parts.join(" ");
}

export default function PersonMeta({ person }: PersonMetaProps) {
    const isActive = person.leftOn === null;
    const timelineEnd = person.leftOn ?? new Date();
    const duration = calculateDuration(person.meetOn, timelineEnd);

    return (
        <div className="grid gap-3 rounded-2xl border border-foreground/10 bg-foreground/4 p-4 text-sm sm:grid-cols-3 sm:p-5">
            <div>
                <p className="text-foreground/60">Met on</p>
                <p className="mt-1 font-medium text-foreground">{formatDateTime(person.meetOn)}</p>
            </div>

            <div>
                <p className="text-foreground/60">Left on</p>
                <p className="mt-1 font-medium text-foreground">
                    {person.leftOn ? formatDateTime(person.leftOn) : "Still ongoing"}
                </p>
            </div>

            <div>
                <p className="text-foreground/60">Timeline</p>
                <p className={`mt-1 font-medium ${isActive ? "text-emerald-600 dark:text-emerald-300" : "text-foreground"}`}>
                    {duration}
                </p>
            </div>

            <div className="sm:col-span-3">
                <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-foreground/10">
                    <div
                        className={`h-full rounded-full ${isActive
                            ? "bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-500"
                            : "bg-linear-to-r from-foreground/25 via-foreground/30 to-foreground/40"
                            }`}
                        style={{ width: isActive ? "100%" : "68%" }}
                    />
                </div>
                <p className="mt-2 text-xs text-foreground/60">from first meeting to {isActive ? "today" : "farewell"}</p>
            </div>
        </div>
    );
}
