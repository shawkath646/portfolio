"use client";

import { motion, useReducedMotion } from "motion/react";
import { FaQuoteLeft } from "react-icons/fa";

interface ThoughtItem {
    id: number | string;
    text: string;
}

interface RandomThoughtsProps {
    title: string;
    thoughts: ThoughtItem[];
}

export default function RandomThoughts({ title, thoughts }: RandomThoughtsProps) {
    const shouldReduceMotion = useReducedMotion();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.1,
                delayChildren: 0.1,
            },
        },
    } as const;

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        },
    } as const;

    return (
        <section className="relative mx-auto w-full" aria-labelledby="random-thoughts-section-title">
            <div className="relative z-10 mb-4 px-2">
                <h3
                    id="random-thoughts-section-title"
                    className="text-[10px] uppercase tracking-[0.24em] text-rose-100/60"
                >
                    {title}
                </h3>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10"
            >
                {thoughts.map((thought) => (
                    <motion.div
                        key={thought.id}
                        variants={cardVariants}
                        whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.01, borderColor: "rgba(255,255,255,0.2)" }}
                        className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-950/35 p-5 shadow-[0_6px_20px_rgba(2,6,23,0.25)] backdrop-blur-xs transition-colors duration-300"
                    >
                        <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-linear-to-br from-rose-500/5 to-transparent blur-xl pointer-events-none" />
                        
                        <div>
                            <FaQuoteLeft className="h-4.5 w-4.5 text-rose-400/25 mb-3" aria-hidden="true" />
                            <p className="text-sm sm:text-base leading-relaxed text-slate-200/90 italic font-medium">
                                &ldquo;{thought.text}&rdquo;
                            </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
