"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { getSkillBySlug } from "@/data/skillsData";
import { FaLayerGroup } from "react-icons/fa";

export interface RelatedSkillItem {
    slug: string;
    name: string;
    color: string;
    learnedYear: string;
}

interface SkillRelatedProps {
    items: RelatedSkillItem[];
    title: string;
    resolvedLang: string;
}

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 16, scale: 0.96 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.35,
            ease: "easeOut",
        },
    },
};

export default function SkillRelated({
    items,
    title,
    resolvedLang,
}: SkillRelatedProps) {
    if (items.length === 0) return null;

    return (
        <motion.section
            aria-labelledby="related-skills-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="pt-8 border-t border-gray-200/60 dark:border-gray-800/60"
        >
            <motion.h3
                id="related-skills-title"
                variants={cardVariants}
                className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-4"
            >
                {title}
            </motion.h3>

            <motion.div
                variants={sectionVariants}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5"
            >
                {items.map((item) => {
                    const skill = getSkillBySlug(item.slug);
                    const ItemIcon = skill?.icon || FaLayerGroup;

                    return (
                        <motion.div
                            key={item.slug}
                            variants={cardVariants}
                            whileHover={{ y: -3, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        >
                            <Link
                                href={`/${resolvedLang}/about/skills/${item.slug}`}
                                className="group flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm border border-gray-200/40 dark:border-gray-700/40 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:border-blue-500/30 hover:shadow-lg transition-colors duration-300 text-center w-full"
                            >
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                    <ItemIcon className={item.color} aria-hidden="true" />
                                </span>
                                <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-500 transition-colors line-clamp-1">
                                    {item.name}
                                </span>
                                <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                                    {item.learnedYear}
                                </span>
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.div>
        </motion.section>
    );
}
