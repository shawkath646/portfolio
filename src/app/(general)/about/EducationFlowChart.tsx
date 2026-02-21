"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const timeline = [
    {
        name: "Sejong University",
        address: "Gwanjin-gu, Seoul, South Korea",
        subject: "Computer Science and Engineering",
        period: "03 March 2025 – Present",
        result: "Ongoing",
        type: "University",
        id: "edu-sejong"
    },
    {
        name: "Narsingdi Model College",
        address: "West Brahmondi, Narsingdi Sadar, Narsingdi, Bangladesh",
        subject: "Science",
        period: "02 March 2022 – 16 November 2023",
        result: "GPA 4.25 out of 5.00",
        type: "High School",
        id: "edu-college"
    },
    {
        name: "Monohardi Govt. Pilot Model High School",
        address: "Monohardi, Narsingdi, Bangladesh",
        subject: "Science",
        period: "01 January 2016 – 30 December 2021",
        result: "GPA 5.00 out of 5.00",
        type: "Secondary School",
        id: "edu-highschool"
    },
    {
        name: "Narandi Jahanara Govt. Primary School",
        address: "Narandi, Monohardi, Narsingdi, Bangladesh",
        subject: "Science",
        period: "05 April 2014 – 30 December 2015",
        result: "GPA 5.00 out of 5.00",
        type: "Elementary School",
        id: "edu-primary"
    },
];

export default function EducationFlowChart() {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const headerVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: {
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.7, 
                type: "spring" as const 
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { 
                duration: 0.6, 
                type: "spring" as const,
                bounce: 0.3
            }
        }
    };

    const dotVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 200,
                damping: 10
            }
        }
    };

    const lineVariants = {
        hidden: { scaleY: 0 },
        visible: {
            scaleY: 1,
            transition: {
                duration: 1.2,
                ease: "easeOut" as const
            }
        }
    };

    const connectorVariants = {
        hidden: { width: 0, opacity: 0 },
        visible: {
            width: "100%",
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut" as const
            }
        }
    };

    return (
        <section 
            ref={ref}
            className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 text-gray-900 dark:text-gray-100 relative z-10"
            aria-labelledby="education-heading"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="mb-10 sm:mb-14 flex justify-center"
            >
                <div className="relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg blur opacity-30 animate-pulse"></div>
                    <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 sm:px-6 py-2 shadow-xl">
                        <motion.h2
                            id="education-heading"
                            variants={headerVariants}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            className="text-base sm:text-lg md:text-xl font-bold tracking-wide bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"
                        >
                            MY Academic Journey
                        </motion.h2>
                    </div>
                </div>
            </motion.div>

            <div className="relative">
                {/* Desktop center line - Animated */}
                <motion.div 
                    className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300/0 via-indigo-500/50 to-indigo-300/0 dark:from-indigo-700/0 dark:via-indigo-400/30 dark:to-indigo-700/0 z-0 hidden md:block transform -translate-x-1/2 origin-top"
                    variants={lineVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                />
                
                {/* Mobile left line - Animated */}
                <motion.div 
                    className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300/0 via-indigo-500/50 to-indigo-300/0 dark:from-indigo-700/0 dark:via-indigo-400/30 dark:to-indigo-700/0 z-0 md:hidden origin-top"
                    variants={lineVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                />
                
                <motion.div 
                    className="relative space-y-8 sm:space-y-12 md:space-y-16"
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                >
                    {[...timeline].reverse().map((edu, index) => (
                        <motion.div
                            key={edu.id}
                            variants={itemVariants}
                            className="relative"
                        >
                            {/* Desktop Layout */}
                            <div className={`hidden md:flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                {/* Timeline center dot for desktop */}
                                <motion.div 
                                    className="absolute left-1/2 top-8 transform -translate-x-1/2 z-10"
                                    variants={dotVariants}
                                >
                                    <div className="relative">
                                        {/* Pulse rings */}
                                        <div className="absolute inset-0 w-6 h-6 rounded-full bg-indigo-400/30 dark:bg-indigo-500/30 animate-ping"></div>
                                        <div className="absolute inset-0 w-6 h-6 rounded-full bg-purple-400/20 dark:bg-purple-500/20 animate-pulse"></div>
                                        
                                        {/* Main dot */}
                                        <div className="relative w-6 h-6 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 dark:from-indigo-500 dark:to-purple-600 flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900">
                                            <div className="w-2 h-2 rounded-full bg-white dark:bg-gray-900"></div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Animated connector line from dot to card */}
                                <motion.div
                                    className={`absolute top-8 h-0.5 bg-linear-to-r ${index % 2 === 0 ? 'right-1/2 mr-3 from-indigo-400/40 to-transparent' : 'left-1/2 ml-3 from-transparent to-indigo-400/40'} dark:from-indigo-500/40 dark:to-transparent`}
                                    style={{ width: `calc(50% - ${index % 2 === 0 ? '1rem' : '1rem'})` }}
                                    variants={connectorVariants}
                                    initial="hidden"
                                    animate={inView ? "visible" : "hidden"}
                                />

                                {/* Content Card */}
                                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 flex justify-end' : 'pl-8 flex justify-start'}`}>
                                    <motion.div 
                                        className="max-w-sm w-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                        whileHover={{ y: -5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden group">
                                            {/* Top gradient indicator */}
                                            <motion.div 
                                                className={`absolute top-0 left-0 w-full h-1 ${index % 2 === 0 ? 'bg-linear-to-r from-indigo-400 to-purple-500' : 'bg-linear-to-r from-purple-500 to-indigo-400'}`}
                                                initial={{ scaleX: 0 }}
                                                animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                                                transition={{ delay: index * 0.2 + 0.5, duration: 0.6 }}
                                            />
                                            
                                            {/* Hover glow effect */}
                                            <div className="absolute inset-0 bg-linear-to-br from-indigo-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-indigo-500/5 transition-all duration-500 rounded-xl"></div>
                                            
                                            {/* Type Badge */}
                                            <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                                                {edu.type}
                                            </div>
                                            
                                            <h3 
                                                id={edu.id}
                                                className="text-lg font-bold text-indigo-600 dark:text-indigo-400 leading-tight"
                                            >
                                                {edu.name}
                                            </h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 flex items-start gap-1">
                                                <span className="text-indigo-500 dark:text-indigo-400 mt-0.5">📍</span>
                                                <span>{edu.address}</span>
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-3">
                                                {edu.subject}
                                            </p>

                                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                                    <span className="font-semibold">🎓 Result:</span> {edu.result}
                                                </p>

                                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <span>📅</span>
                                                    <time>{edu.period}</time>
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Empty space on the other side */}
                                <div className="w-1/2"></div>
                            </div>

                            {/* Mobile Layout */}
                            <div className="md:hidden flex items-start gap-4">
                                {/* Timeline dot */}
                                <motion.div 
                                    className="relative shrink-0 mt-2"
                                    variants={dotVariants}
                                >
                                    <div className="relative">
                                        {/* Pulse rings */}
                                        <div className="absolute inset-0 w-6 h-6 rounded-full bg-indigo-400/30 dark:bg-indigo-500/30 animate-ping"></div>
                                        <div className="absolute inset-0 w-6 h-6 rounded-full bg-purple-400/20 dark:bg-purple-500/20 animate-pulse"></div>
                                        
                                        {/* Main dot */}
                                        <div className="relative w-6 h-6 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 dark:from-indigo-500 dark:to-purple-600 flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900">
                                            <div className="w-2 h-2 rounded-full bg-white dark:bg-gray-900"></div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Content Card */}
                                <motion.div 
                                    className="flex-1 transform transition-all duration-300 active:scale-95"
                                    whileHover={{ y: -3 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden group">
                                        {/* Top gradient indicator */}
                                        <motion.div 
                                            className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-400 to-purple-500"
                                            initial={{ scaleX: 0 }}
                                            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                                            transition={{ delay: index * 0.2 + 0.5, duration: 0.6 }}
                                        />
                                        
                                        {/* Hover glow effect */}
                                        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-indigo-500/5 transition-all duration-500 rounded-xl"></div>
                                        
                                        {/* Type Badge */}
                                        <div className="inline-block px-2.5 py-0.5 mb-2 text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                                            {edu.type}
                                        </div>
                                        
                                        <h3 className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400 leading-tight">
                                            {edu.name}
                                        </h3>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 flex items-start gap-1">
                                            <span className="text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5">📍</span>
                                            <span className="leading-relaxed">{edu.address}</span>
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-2.5">
                                            {edu.subject}
                                        </p>

                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1.5">
                                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                                <span className="font-semibold">🎓 Result:</span> {edu.result}
                                            </p>

                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <span>📅</span>
                                                <time>{edu.period}</time>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
