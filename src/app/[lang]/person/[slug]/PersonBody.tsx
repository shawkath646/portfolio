"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

interface PersonBodyProps {
    isLoveTimeline: boolean;
    children: ReactNode;
}

export default function PersonBody({ isLoveTimeline, children }: PersonBodyProps) {
    return (
        <div className="space-y-8">
            {isLoveTimeline && (
                <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.12 }}
                    className="inline-flex items-center gap-2 rounded-full border border-rose-400/25 bg-rose-500/10 px-4 py-2 text-xs font-semibold tracking-wide text-rose-700 dark:text-rose-200"
                >
                    <span aria-hidden="true">❤️</span>
                    A chapter from the love timeline
                </motion.p>
            )}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.16 }}
                className="h-px w-full bg-linear-to-r from-transparent via-foreground/20 to-transparent"
            />

            <motion.section
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="prose prose-neutral max-w-none dark:prose-invert"
            >
                {children}
            </motion.section>
        </div>
    );
}
