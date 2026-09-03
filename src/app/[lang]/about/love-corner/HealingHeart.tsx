"use client";

import { motion, useReducedMotion } from "motion/react";
import { FiHeart } from "react-icons/fi";

interface HealingHeartProps {
    title: string;
    text: string;
}

export default function HealingHeart({ title, text }: HealingHeartProps) {
    const shouldReduceMotion = useReducedMotion();

    const paragraphs = text.split("\n\n").filter(Boolean);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: shouldReduceMotion ? 0.2 : 0.6,
                ease: "easeOut",
                delay: 0.3,
            }}
            className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-rose-500/10 bg-slate-950/40 px-6 py-7 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-md"
            aria-labelledby="healing-heart-title"
        >
            {/* Background healing radial glows */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-rose-500/5 blur-2xl" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-full bg-rose-500/10 p-2 text-rose-400 ring-1 ring-rose-500/15">
                        <FiHeart className="h-4 w-4 animate-pulse" style={{ animationDuration: "3s" }} aria-hidden="true" />
                    </div>
                    <h3
                        id="healing-heart-title"
                        className="text-[10px] uppercase tracking-[0.24em] text-rose-200/50"
                    >
                        {title}
                    </h3>
                </div>
                
                <div className="space-y-3.5 text-sm sm:text-base leading-relaxed text-slate-200/90 italic font-medium">
                    {paragraphs.map((para, i) => (
                        <p key={i}>
                            {para}
                        </p>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
