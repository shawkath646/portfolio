"use client";
import { motion, Variants } from "framer-motion";
import GradientLink from "../GradientLink";


const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1], // custom cubic-bezier easing
            staggerChildren: 0.15,
        },
    },
};

const childVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};


export default function CompanyIntro() {
    return (
        <section className="text-gray-800 dark:text-gray-200 space-y-6 w-full lg:w-1/2">
            <motion.div
                className="relative p-[2px] rounded-xl overflow-hidden max-w-3xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={containerVariants}
            >
                {/* Animated Border */}
                <motion.div
                    className="absolute inset-0 rounded-xl bg-[conic-gradient(at_top_left,_#3b82f6,_#06b6d4,_#3b82f6)] blur-sm animate-spin-slow mask-border-fade"
                    aria-hidden
                />

                {/* Content Box */}
                <motion.div
                    className="relative z-10 bg-gradient-to-tr from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 rounded-xl p-8 space-y-6"
                    variants={childVariants}
                >
                    {/* Icon Placeholder */}
                    <motion.div
                        className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center"
                        variants={childVariants}
                    >
                        <span className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                            Icon
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        className="text-2xl font-semibold tracking-tight"
                        variants={childVariants}
                    >
                        Meet with my brand <span className="text-blue-600 dark:text-blue-400">Cloudburst Lab</span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p className="text-sm leading-relaxed tracking-wide" variants={childVariants}>
                        Cloudburst Lab is the identity of my dream to build a software startup.
                        I envision branding my developed software products under this name as a mark of innovation and trust.
                        In the near future, this dream will grow into a team-driven company focusing on developing cutting-edge,
                        AI-powered software solutions that shape tomorrow’s digital experience.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        className="flex justify-center md:justify-start gap-4"
                        variants={childVariants}
                    >
                        <GradientLink href="https://cloudburstlab.vercel.app" target="_blank">
                            Visit Cloudburst Lab
                        </GradientLink>
                        <GradientLink
                            href="https://cloudburstlab.vercel.app"
                            target="_blank"
                            variant="purple"
                        >
                            Know all my goals
                        </GradientLink>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
