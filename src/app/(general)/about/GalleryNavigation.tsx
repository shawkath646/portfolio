"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiCamera, FiArrowRight } from "react-icons/fi";

export default function GalleryNavigation() {
    return (
        <section className="relative py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    {/* Decorative background */}
                    <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-lg"></div>
                    
                    {/* Content Card */}
                    <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            {/* Left Section - Text Content */}
                            <div className="flex-1">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="inline-flex items-center gap-1.5 bg-linear-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-medium mb-8 shadow-md"
                                >
                                    <FiCamera className="text-base" />
                                    <span>Photo Gallery</span>
                                </motion.div>

                                <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3"
                                >
                                    Explore My{" "}
                                    <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        Photo Collection
                                    </span>
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    className="text-base text-gray-600 dark:text-gray-300 mb-4 max-w-2xl"
                                >
                                    Journey through my captured moments, memorable experiences, and creative photography. 
                                    Browse through curated albums showcasing travels, events, and special occasions.
                                </motion.p>
                            </div>

                            {/* Right Section - CTA Button */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                            >
                                <Link
                                    href="/about/gallery"
                                    className="group relative inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-medium rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                    <span>View Gallery</span>
                                    <FiArrowRight className="text-lg transition-transform group-hover:translate-x-1" />
                                    
                                    {/* Animated shine effect */}
                                    <div className="absolute inset-0 rounded-full bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine"></div>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Bottom decorative line */}
                        <div className="h-0.5 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}