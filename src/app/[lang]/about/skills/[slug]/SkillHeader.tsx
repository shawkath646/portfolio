"use client";

import { motion, type Variants } from "motion/react";
import { FaCalendarAlt, FaLayerGroup } from "react-icons/fa";
import { getSkillBySlug, SKILL_BRANCHES } from "@/data/skillsData";

interface SkillHeaderProps {
    slug: string;
    localizedName: string;
    localizedBranch: string;
    learnedYear: string;
    color: string;
    bgGlow: string;
    learnedInLabel: string;
    backToSkillsLabel: string;
    resolvedLang: string;
}

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

const iconVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
        },
    },
};

export default function SkillHeader({
    slug,
    localizedName,
    localizedBranch,
    learnedYear,
    color,
    bgGlow,
    learnedInLabel,
}: SkillHeaderProps) {
    const skill = getSkillBySlug(slug);
    const branchDef = skill ? SKILL_BRANCHES.find((b) => b.slug === skill.branchSlug) : undefined;
    const BranchIcon = branchDef?.icon || FaLayerGroup;
    const SkillIcon = skill?.icon || FaLayerGroup;

    return (
        <motion.header
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mb-10 sm:mb-18"
        >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                {/* Glowing Icon Wrapper */}
                <motion.div
                    variants={iconVariants}
                    whileHover={{ scale: 1.06, rotate: [0, -2, 2, 0] }}
                    transition={{ duration: 0.3 }}
                    className="relative flex shrink-0 items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-linear-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 shadow-lg cursor-default"
                    style={{ boxShadow: `0 16px 32px -12px ${bgGlow}` }}
                >
                    <SkillIcon className={`text-2xl sm:text-3xl ${color} transition-transform duration-300`} aria-hidden="true" />
                </motion.div>

                {/* Title and Badges */}
                <div className="flex-1 text-center sm:text-left space-y-2.5 pt-0.5">
                    <motion.h1
                        variants={itemVariants}
                        className="text-2xl sm:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-white dark:via-gray-100 dark:to-gray-400"
                    >
                        {localizedName}
                    </motion.h1>

                    <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-2.5">
                        <motion.span
                            whileHover={{ y: -2, scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-blue-700 dark:text-blue-300 border border-gray-200/60 dark:border-gray-700/50 shadow-xs"
                        >
                            <BranchIcon className="text-[11px]" aria-hidden="true" />
                            <span>{localizedBranch}</span>
                        </motion.span>

                        <motion.span
                            whileHover={{ y: -2, scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-emerald-700 dark:text-emerald-300 border border-gray-200/60 dark:border-gray-700/50 shadow-xs"
                        >
                            <FaCalendarAlt className="text-[11px]" aria-hidden="true" />
                            <span>{learnedInLabel}: {learnedYear}</span>
                        </motion.span>
                    </motion.div>
                </div>
            </div>
        </motion.header>
    );
}
