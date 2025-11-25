"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiCamera, FiArrowRight } from "react-icons/fi";

export default function GalleryNavigation() {
    return (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    {/* Decorative background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
                    
                    {/* Content Card */}
                    <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                            {/* Left Section - Text Content */}
                            <div className="flex-1">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-lg"
                                >
                                    <FiCamera className="text-lg" />
                                    <span>Photo Gallery</span>
                                </motion.div>

                                <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                                >
                                    Explore My{" "}
                                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        Photo Collection
                                    </span>
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl"
                                >
                                    Journey through my captured moments, memorable experiences, and creative photography. 
                                    Browse through curated albums showcasing travels, events, and special occasions.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 }}
                                    className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span>Organized Albums</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <span>High-Quality Photos</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                                        <span>Regular Updates</span>
                                    </div>
                                </motion.div>
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
                                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                                >
                                    <span>View Gallery</span>
                                    <FiArrowRight className="text-xl transition-transform group-hover:translate-x-1" />
                                    
                                    {/* Animated shine effect */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine"></div>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Bottom decorative line */}
                        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
