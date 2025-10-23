"use client";
import { memo, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import GradientLink from "../GradientLink";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useInView } from "framer-motion";

const CompanyIntro = memo(function CompanyIntro() {
    // Animation controls
    const controls = useAnimation();
    const prefersReducedMotion = useReducedMotion(controls);
    const ref = useRef(null);
    const isInView = useInView(ref, { 
        once: true, 
        margin: "-100px" 
    });

    // Trigger animations when element comes into view using useEffect
    useEffect(() => {
        if (isInView && !prefersReducedMotion) {
            controls.start({ opacity: 1, y: 0 });
        }
    }, [isInView, prefersReducedMotion, controls]);
    
    return (
        <article 
            aria-labelledby="company-intro-heading"
            className="text-gray-800 dark:text-gray-200 py-10 lg:py-16"
            ref={ref}
        >
            <motion.div 
                className="relative p-[2px] rounded-2xl overflow-hidden max-w-4xl mx-auto shadow-xl"
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                animate={controls}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                {/* Animated Gradient Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-400 to-purple-500">
                    <motion.div
                        className="absolute inset-0 rounded-2xl bg-[conic-gradient(at_top_left,_#3b82f6,_#06b6d4,_#8b5cf6)] blur-md"
                        animate={{ 
                            rotate: [0, 360],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                            duration: 15, 
                            ease: "linear", 
                            repeat: Infinity,
                            repeatType: "loop"
                        }}
                        aria-hidden="true"
                    />
                </div>

                {/* Content Box */}
                <div className="relative z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-10 lg:p-12">
                    <div className="space-y-8">
                        {/* Header with Logo and Title */}
                        <header className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                            {/* Logo Section */}
                            <motion.figure 
                                className="flex-shrink-0"
                                initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                                animate={controls}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                aria-label="Cloudburst Lab logo"
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                                    <span className="text-white font-bold text-xl" aria-hidden="true">CL</span>
                                    {/* Replace with real logo when available */}
                                    {/* <Image 
                                        src="/path-to-logo.png"
                                        alt="Cloudburst Lab Logo"
                                        width={80}
                                        height={80}
                                        className="object-cover"
                                    /> */}
                                </div>
                            </motion.figure>
                            
                            {/* Heading */}
                            <motion.h2 
                                id="company-intro-heading"
                                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 sm:self-center"
                                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                animate={controls}
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                Meet my brand "Cloudburst Lab"
                            </motion.h2>
                        </header>
                        
                        {/* Content Container */}
                        <div className="text-left space-y-6">

                            <motion.p 
                                className="text-lg leading-relaxed max-w-3xl"
                                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                                animate={controls}
                                transition={{ delay: 0.5, duration: 0.7 }}
                            >
                                Cloudburst Lab is the identity of my dream to build a software startup.
                                I envision branding my developed software products under this name as a mark of innovation and trust.
                                In the near future, this dream will grow into a team-driven company focusing on developing cutting-edge,
                                AI-powered software solutions that shape tomorrow's digital experience.
                            </motion.p>

                            {/* Buttons */}
                            <motion.nav 
                                className="flex flex-col sm:flex-row gap-4 pt-2"
                                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                animate={controls}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                aria-label="Cloudburst Lab links"
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
                </div>
            </motion.div>
        </article>
    );
});

export default CompanyIntro;
