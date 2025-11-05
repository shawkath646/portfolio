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
            className="text-gray-800 dark:text-gray-200 py-6 lg:py-10"
            ref={ref}
        >
            <motion.div 
                className="relative p-[2px] rounded-2xl overflow-hidden max-w-3xl mx-auto shadow-xl"
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                animate={controls}
                transition={{ duration: 0.7, ease: "easeOut" }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -5 }}
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
                <div className="relative z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 md:p-8">
                    <div className="space-y-6">
                        {/* Header with Logo and Title */}
                        <header className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
                            {/* Logo Section */}
                            <motion.figure 
                                className="flex-shrink-0"
                                initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0, rotate: -180 }}
                                animate={controls}
                                transition={{ delay: 0.3, duration: 0.8, type: "spring", bounce: 0.5 }}
                                whileHover={prefersReducedMotion ? {} : { rotate: 360, scale: 1.1 }}
                                aria-label="Cloudburst Lab logo"
                            >
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden relative">
                                    <motion.span 
                                        className="text-white font-bold text-lg sm:text-xl relative z-10" 
                                        aria-hidden="true"
                                        animate={{ 
                                            textShadow: [
                                                "0 0 8px rgba(255,255,255,0.5)",
                                                "0 0 12px rgba(255,255,255,0.8)",
                                                "0 0 8px rgba(255,255,255,0.5)"
                                            ]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        CL
                                    </motion.span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"
                                        animate={{ 
                                            x: [-100, 100],
                                        }}
                                        transition={{ 
                                            duration: 3,
                                            repeat: Infinity,
                                            repeatDelay: 1
                                        }}
                                    />
                                </div>
                            </motion.figure>
                            
                            {/* Heading */}
                            <motion.h2 
                                id="company-intro-heading"
                                className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 sm:self-center"
                                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                animate={controls}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                            >
                                Meet my brand "Cloudburst Lab"
                            </motion.h2>
                        </header>
                        
                        {/* Content Container */}
                        <div className="text-left space-y-4">

                            <motion.p 
                                className="text-base leading-relaxed"
                                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
                                animate={controls}
                                transition={{ delay: 0.5, duration: 0.7 }}
                                whileHover={prefersReducedMotion ? {} : { x: 5 }}
                            >
                                Cloudburst Lab is the identity of my dream to build a software startup.
                                I envision branding my developed software products under this name as a mark of innovation and trust.
                                In the near future, this dream will grow into a team-driven company focusing on developing cutting-edge,
                                AI-powered software solutions that shape tomorrow's digital experience.
                            </motion.p>

                            {/* Buttons */}
                            <motion.nav 
                                className="flex flex-col sm:flex-row gap-3 pt-2"
                                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                animate={controls}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                aria-label="Cloudburst Lab links"
                            >
                                <motion.div whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }} whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}>
                                    <GradientLink 
                                        href="https://cloudburstlab.vercel.app" 
                                        target="_blank"
                                    >
                                        Visit Cloudburst Lab
                                    </GradientLink>
                                </motion.div>
                                <motion.div whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }} whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}>
                                    <GradientLink
                                        href="https://cloudburstlab.vercel.app/goals"
                                        target="_blank"
                                        variant="purple"
                                    >
                                        Explore My Vision
                                    </GradientLink>
                                </motion.div>
                            </motion.nav>
                        </div>
                    </div>
                </div>
            </motion.div>
        </article>
    );
});

export default CompanyIntro;
