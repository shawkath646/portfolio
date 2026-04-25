import type { ReactNode } from "react";

interface PersonPageShellProps {
    isLoveTimeline: boolean;
    isActive: boolean;
    children: ReactNode;
}

export default function PersonPageShell({
    isLoveTimeline,
    isActive,
    children,
}: PersonPageShellProps) {
    const baseBackground = isLoveTimeline
        ? "bg-linear-to-br from-rose-50/90 via-background to-pink-100/50 dark:from-rose-950/35 dark:via-background dark:to-pink-900/15"
        : "bg-linear-to-br from-sky-50/70 via-background to-teal-50/40 dark:from-sky-950/20 dark:via-background dark:to-teal-950/10";

    const moodRing = isLoveTimeline
        ? "before:bg-linear-to-r before:from-rose-500/20 before:via-pink-400/20 before:to-red-400/20"
        : "before:bg-linear-to-r before:from-sky-500/15 before:via-cyan-400/10 before:to-emerald-400/15";

    const relationshipTone = isActive
        ? "shadow-xl shadow-emerald-500/10"
        : "opacity-95 saturate-75";

    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            className="relative isolate min-h-[calc(100dvh-11rem)] py-12 sm:py-16"
        >
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className={`absolute inset-0 ${baseBackground}`} />
                <div
                    aria-hidden="true"
                    className={`absolute top-8 left-1/2 h-48 w-[min(46rem,88vw)] -translate-x-1/2 rounded-full blur-3xl ${isLoveTimeline ? "bg-rose-400/18 dark:bg-rose-500/15" : "bg-sky-400/14 dark:bg-sky-500/10"}`}
                />
            </div>

            <div
                className={`relative mx-auto max-w-4xl rounded-3xl border border-foreground/10 bg-background/75 px-4 py-7 shadow-lg backdrop-blur-sm sm:px-6 sm:py-9 ${moodRing} ${relationshipTone} before:absolute before:inset-x-6 before:top-0 before:h-px before:rounded-full`}
            >
                {children}
            </div>
        </main>
    );
}
