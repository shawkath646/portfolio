"use client";

import { motion, type Variants } from "motion/react";

interface SkillStoryProps {
    localizedStory: string;
    journeyTitle: string;
}

const storyContainerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            delay: 0.15,
            ease: "easeOut",
            staggerChildren: 0.1,
        },
    },
};

const storyItemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: "easeOut" },
    },
};

export default function SkillStory({
    localizedStory,
    journeyTitle,
}: SkillStoryProps) {
    return (
        <motion.article
            aria-labelledby="journey-title"
            initial="hidden"
            animate="visible"
            variants={storyContainerVariants}
            className="mb-10 relative"
        >
            {/* Subtle aesthetic accent line */}
            <motion.div
                initial={{ scaleY: 0, originY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
                className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-linear-to-b from-blue-500/40 via-indigo-500/20 to-transparent hidden sm:block"
                aria-hidden="true"
            />

            <div className="sm:pl-6">
                <motion.h2
                    id="journey-title"
                    variants={storyItemVariants}
                    className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-4"
                >
                    {journeyTitle}
                </motion.h2>

                <motion.div
                    variants={storyItemVariants}
                    className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300 font-normal"
                >
                    <p className="whitespace-pre-line">
                        {localizedStory}
                    </p>
                </motion.div>
            </div>
        </motion.article>
    );
}
