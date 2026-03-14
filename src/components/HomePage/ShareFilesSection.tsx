"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { FiShare2 } from "react-icons/fi";

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
                        href="/contact/share-files"
                        className="block group relative overflow-hidden rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        {/* Animated Gradient Border */}
                        <div className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-500 via-cyan-500 to-blue-500 opacity-75 blur-sm animate-[spin_15s_linear_infinite]"></div>
                        <div className="absolute inset-0.5 rounded-xl bg-white dark:bg-gray-800"></div>
                        
                        <div className="relative flex items-center gap-4">
                            {/* Icon */}
                            <div className="shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors duration-300">
                                <FiShare2 size={22} className="text-blue-500" />
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
