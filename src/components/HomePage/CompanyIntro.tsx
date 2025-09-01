"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import GradientLink from "../GradientLink";

const CompanyIntro = memo(function CompanyIntro() {
    return (
        <section 
            aria-labelledby="company-intro-heading"
            className="container mx-auto text-gray-800 dark:text-gray-200 py-20 lg:py-28"
        >
            <motion.div 
                className="relative p-[2px] rounded-2xl overflow-hidden max-w-4xl mx-auto shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
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
                        {/* Header with Logo and Title in same line */}
                        <header className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                            {/* Logo Section */}
                            <motion.div 
                                className="flex-shrink-0"
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                                    <span className="text-white font-bold text-xl">CL</span>
                                    {/* Replace with real logo when available */}
                                    {/* <Image 
                                        src="/path-to-logo.png"
                                        alt="Cloudburst Lab Logo"
                                        width={80}
                                        height={80}
                                        className="object-cover"
                                    /> */}
                                </div>
                            </motion.div>
                            
                            {/* Heading */}
                            <motion.h2 
                                id="company-intro-heading"
                                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 sm:self-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                Meet my brand "Cloudburst Lab"
                            </motion.h2>
                        </header>
                        
                        {/* Content Container */}
                        <div className="text-left space-y-6">

                            <motion.p 
                                className="text-lg leading-relaxed max-w-3xl"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.7 }}
                            >
                                Cloudburst Lab is the identity of my dream to build a software startup.
                                I envision branding my developed software products under this name as a mark of innovation and trust.
                                In the near future, this dream will grow into a team-driven company focusing on developing cutting-edge,
                                AI-powered software solutions that shape tomorrow's digital experience.
                            </motion.p>

                            {/* Buttons */}
                            <motion.div 
                                className="flex flex-col sm:flex-row gap-4 pt-2"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6, duration: 0.5 }}
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
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
});

export default CompanyIntro;
