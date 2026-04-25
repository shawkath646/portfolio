"use client";
import { memo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type CompanyIntroLanguagePack = {
    visionBadge: string;
    headingLead: string;
    brandName: string;
    description: string;
    externalLinksAriaLabel: string;
    learnMoreText: string;
    logoAlt: string;
};

const CompanyIntro = memo(function CompanyIntro({ languagePack }: { languagePack: CompanyIntroLanguagePack }) {
    const controls = useAnimation();
    const prefersReducedMotion = useReducedMotion(controls);
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: true,
        margin: "-100px"
    });

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            }
        }
    };

    const itemVariants: Variants = {
        hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
        }
    };

    return (
        <article
            aria-labelledby="company-intro-heading"
            ref={ref}
        >
            <motion.div
                className="relative max-w-4xl mx-auto rounded-4xl border border-gray-200/50 dark:border-white/10 overflow-hidden"
                initial="hidden"
                animate={controls}
                variants={containerVariants}
            >
                {/* Subtle Ambient Background Glows */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

                <div className="relative z-10 p-6 md:p-8">

                    {/* Content Section */}
                    <div className="flex-1 space-y-6">

                        <div className="space-y-3">
                            <motion.span
                                variants={itemVariants}
                                className="text-sm font-semibold tracking-wider uppercase text-blue-600 dark:text-cyan-400 block"
                            >
                                {languagePack.visionBadge}
                            </motion.span>

                            {/* Heading with Inline Logo */}
                            <motion.h2
                                id="company-intro-heading"
                                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white flex flex-wrap items-center gap-x-3 gap-y-2"
                                variants={itemVariants}
                            >
                                <Image
                                    src="https://cloudburstlab.vercel.app/api/branding/logo?variant=transparent"
                                    height={32}
                                    width={80}
                                    alt={languagePack.logoAlt}
                                    className="object-contain h-8 w-20"
                                    priority
                                />
                                {languagePack.headingLead}

                                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400">
                                    {languagePack.brandName}
                                </span>
                            </motion.h2>
                        </div>

                        <motion.p
                            className="text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl"
                            variants={itemVariants}
                        >
                            {languagePack.description}
                        </motion.p>

                        {/* Interactive Navigation */}
                        <motion.div
                            className="mt-2 text-end"
                            variants={itemVariants}
                            aria-label={languagePack.externalLinksAriaLabel}
                        >
                            <Link
                                href="https://cloudburstlab.vercel.app"
                                className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                            >
                                {languagePack.learnMoreText}
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </article>
    );
});

export default CompanyIntro;