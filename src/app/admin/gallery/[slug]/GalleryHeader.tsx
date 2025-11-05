"use client";

import { motion } from "framer-motion";
import { FaFolder, FaImage, FaCalendar, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

interface GalleryHeaderProps {
    name: string;
    timestamp: Date;
    imageCount: number;
}

export default function GalleryHeader({ name, timestamp, imageCount }: GalleryHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
        >
            {/* Back Button */}
            <Link 
                href="/admin/gallery"
                className="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-3"
            >
                <FaArrowLeft className="text-[10px]" />
                <span>Back to Albums</span>
            </Link>

            {/* Header Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    {/* Album Info */}
                    <div className="flex items-center gap-3">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md"
                        >
                            <FaFolder className="text-white text-lg" />
                        </motion.div>
                        
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-0.5"
                            >
                                {name}
                            </motion.h1>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400"
                            >
                                <span className="flex items-center gap-1">
                                    <FaCalendar className="text-[10px]" />
                                    {timestamp.toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </span>
                            </motion.div>
                        </div>
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                        <FaImage className="text-blue-600 dark:text-blue-400" />
                        <div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">
                                {imageCount}
                            </div>
                            <div className="text-[10px] text-gray-600 dark:text-gray-400">
                                {imageCount === 1 ? 'Photo' : 'Photos'}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
