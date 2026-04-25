"use client";

import Image from "next/image";
import { motion, Variants } from "motion/react";
import { PiGenderIntersexBold, PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi";
import type { PersonObj } from "@/types/common.types";
import PersonMeta from "./PersonMeta";

interface ProfileHeaderProps {
    person: PersonObj;
}

const headerVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.52,
            ease: "easeOut",
            staggerChildren: 0.12,
        },
    },
};

const childVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.44, ease: "easeOut" } },
};

function getGenderDetails(gender: PersonObj["gender"]) {
    if (gender === "male") {
        return {
            label: "Male",
            icon: PiGenderMaleBold,
        };
    }

    if (gender === "female") {
        return {
            label: "Female",
            icon: PiGenderFemaleBold,
        };
    }

    return {
        label: "Others",
        icon: PiGenderIntersexBold,
    };
}

export default function ProfileHeader({ person }: ProfileHeaderProps) {
    const isActive = person.leftOn === null;
    const gender = getGenderDetails(person.gender);
    const GenderIcon = gender.icon;

    return (
        <motion.section
            aria-labelledby="person-name"
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            className="space-y-6"
        >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-7">
                <motion.div
                    variants={childVariants}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="relative h-32 w-32 shrink-0 overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5 shadow-xl sm:h-36 sm:w-36"
                >
                    <Image
                        src={person.profile}
                        alt={person.name}
                        fill
                        sizes="(max-width: 640px) 128px, 144px"
                        className="object-cover"
                        priority
                    />
                </motion.div>

                <motion.div variants={childVariants} className="min-w-0 flex-1 space-y-4">
                    <div className="space-y-2">
                        <h1 id="person-name" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {person.name}
                        </h1>

                        <p className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-sm text-foreground/80">
                            <GenderIcon className="h-4 w-4" aria-hidden="true" />
                            <span>{gender.label}</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {person.relation.map((tag) => (
                            <motion.span
                                key={tag}
                                whileHover={{ y: -2, scale: 1.03 }}
                                className={`rounded-full border px-3 py-1 text-sm transition-colors ${isActive
                                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                    : "border-foreground/15 bg-foreground/6 text-foreground/75"
                                    }`}
                            >
                                {tag}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            </div>

            <motion.div variants={childVariants}>
                <PersonMeta person={person} />
            </motion.div>
        </motion.section>
    );
}
