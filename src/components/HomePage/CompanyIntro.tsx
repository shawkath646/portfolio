"use client";
import { memo, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import GradientLink from "../GradientLink";


const CompanyIntro = memo(function CompanyIntro() {
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
            className="py-12 lg:py-20 px-4 sm:px-6"
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

                <div className="relative z-10 p-8 md:p-12">

                    {/* Content Section */}
                    <div className="flex-1 space-y-6">

                        <div className="space-y-3">
                            <motion.span
                                variants={itemVariants}
                                className="text-sm font-semibold tracking-wider uppercase text-blue-600 dark:text-cyan-400 block"
                            >
                                The Vision
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
                                    alt="Cloudburst Lab Logo"
                                    className="object-contain"
                                    priority
                                />
                                Meet

                                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400">
                                    Cloudburst Lab
                                </span>
                            </motion.h2>
                        </div>

                        <motion.p
                            className="text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl"
                            variants={itemVariants}
                        >
                            This is the identity of my dream to build a software startup.
                            I envision branding my developed software products under this name as a mark of innovation and trust.
                            In the near future, this will grow into a team-driven company focused on developing cutting-edge,
                            AI-powered solutions that shape tomorrow&apos;s digital experience.
                        </motion.p>

                        {/* Interactive Navigation */}
                        <motion.nav
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                            variants={itemVariants}
                            aria-label="Cloudburst Lab external links"
                        >
                            <GradientLink
                                href="https://cloudburstlab.vercel.app"
                                target="_blank"
                            >
                                Visit Cloudburst Lab
                            </GradientLink>

                            <GradientLink
                                href="https://cloudburstlab.vercel.app/goals"
                                target="_blank"
                                variant="purple"
                            >
                                Explore My Vision
                            </GradientLink>
                        </motion.nav>
                    </div>
                </div>
            </motion.div>
        </article>
    );
});

export default CompanyIntro;