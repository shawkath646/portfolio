"use client";
import { motion } from "motion/react";
import Link from "next/link";

export default function ShareFilesSection() {
    return (
        <section
            aria-labelledby="share-files-title"
            className="mb-16"
            role="region"
        >
            <div className="container mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto"
                >
                    <Link
                        href="/share"
                        className="block group relative overflow-hidden rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        {/* Animated Gradient Border */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 opacity-75 blur-sm animate-[spin_15s_linear_infinite]"></div>
                        <div className="absolute inset-[2px] rounded-xl bg-white dark:bg-gray-800"></div>
                        
                        <div className="relative flex items-center gap-4">
                            {/* Icon */}
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors duration-300">
                                <svg
                                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h2
                                    id="share-files-title"
                                    className="text-lg font-semibold text-gray-900 dark:text-white mb-1"
                                >
                                    Share Files with Me
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Send files securely to Shawkat Hossain Maruf
                                </p>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
