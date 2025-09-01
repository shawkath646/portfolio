"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { 
                duration: 0.6, 
                type: "spring" as const,
                bounce: 0.3
            }
        }
    };

    return (
        <section 
            ref={ref}
            className="max-w-5xl mx-auto px-6 py-20 text-gray-900 dark:text-gray-100 relative z-10"
            aria-labelledby="education-heading"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="mb-14 flex justify-center"
            >
                <div className="relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg blur opacity-30 animate-pulse"></div>
                    <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-2 shadow-xl">
                        <motion.h2
                            id="education-heading"
                            variants={headerVariants}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            className="text-lg sm:text-xl font-bold tracking-wide bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"
                        >
                            MY Academic Journey
                        </motion.h2>
                    </div>
                </div>
            </motion.div>

            <div className="relative">
                {/* Decorative background elements */}
                <div className="absolute left-[calc(50%-1px)] top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300/0 via-indigo-500/50 to-indigo-300/0 dark:from-indigo-700/0 dark:via-indigo-400/30 dark:to-indigo-700/0 z-0 hidden md:block"></div>
                
                <motion.div 
                    className="relative space-y-16 md:space-y-0"
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                >
                    {timeline.map((edu, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className={`md:flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} relative`}
                            aria-labelledby={edu.id}
                        >
                            {/* Timeline center dot for desktop */}
                            <motion.div 
                                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                                transition={{ delay: index * 0.15 + 0.3 }}
                            >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 dark:from-indigo-500 dark:to-purple-600 flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
                                    <div className="w-2 h-2 rounded-full bg-white dark:bg-gray-900"></div>
                                </div>
                            </motion.div>

                            {/* Left side - empty for right cards or content for left cards */}
                            <div className={`md:w-1/2 md:pr-8 ${index % 2 !== 0 ? 'md:text-right' : ''} flex items-center ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                                {index % 2 === 0 && (
                                    <div className="md:max-w-sm w-full transform transition-all duration-300 hover:scale-105">
                                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-5 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                                            {/* Small educational level indicator */}
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
                                            
                                            <h3 
                                                id={edu.id}
                                                className="text-lg font-semibold text-indigo-600 dark:text-indigo-400"
                                            >
                                                {edu.name}
                                            </h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                {edu.address}
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-2">
                                                {edu.subject}, {edu.type}
                                            </p>

                                            <div className="flex justify-between items-center mt-3">
                                                <p className="text-xs text-gray-700 dark:text-gray-300">
                                                    <span className="font-semibold">🎓 Result:</span> {edu.result}
                                                </p>

                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    <time>{edu.period}</time>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right side - empty for left cards or content for right cards */}
                            <div className={`md:w-1/2 md:pl-8 ${index % 2 === 0 ? 'md:text-left' : ''} flex items-center ${index % 2 !== 0 ? 'justify-end' : 'justify-start'}`}>
                                {index % 2 !== 0 && (
                                    <div className="md:max-w-sm w-full transform transition-all duration-300 hover:scale-105">
                                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-5 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                                            {/* Small educational level indicator */}
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-400"></div>
                                            
                                            <h3 
                                                id={edu.id}
                                                className="text-lg font-semibold text-indigo-600 dark:text-indigo-400"
                                            >
                                                {edu.name}
                                            </h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                {edu.address}
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-2">
                                                {edu.subject}, {edu.type}
                                            </p>

                                            <div className="flex justify-between items-center mt-3">
                                                <p className="text-xs text-gray-700 dark:text-gray-300">
                                                    <span className="font-semibold">🎓 Result:</span> {edu.result}
                                                </p>

                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    <time>{edu.period}</time>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Mobile view timeline dot and card */}
                            <div className="absolute left-0 top-0 bottom-0 flex items-center md:hidden">
                                <div className="relative">
                                    <div className="h-full w-0.5 bg-indigo-500 dark:bg-indigo-400 absolute left-0 top-0"></div>
                                    <motion.div 
                                        className="w-4 h-4 rounded-full bg-indigo-500 dark:bg-indigo-400 border-2 border-white dark:border-gray-900 shadow-md relative z-10"
                                        initial={{ scale: 0 }}
                                        animate={inView ? { scale: 1 } : { scale: 0 }}
                                        transition={{ delay: index * 0.15 + 0.3 }}
                                    />
                                </div>
                                
                                <div className="ml-6 md:hidden w-full">
                                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                                        {/* Small educational level indicator */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
                                        
                                        <h3 className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
                                            {edu.name}
                                        </h3>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            {edu.address}
                                        </p>
                                        <p className="text-xs font-medium text-gray-800 dark:text-gray-200 mt-1.5">
                                            {edu.subject}, {edu.type}
                                        </p>

                                        <p className="text-xs text-gray-700 dark:text-gray-300 mt-1.5">
                                            <span className="font-semibold">🎓 Result:</span> {edu.result}
                                        </p>

                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            <time>{edu.period}</time>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
