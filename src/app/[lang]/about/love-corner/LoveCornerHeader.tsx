"use client";
import { motion } from "motion/react";
import { FiHeart } from "react-icons/fi";

export default function LoveCornerHeader() {

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 mb-10 text-center"
        >
            <div className="inline-flex items-center justify-center gap-3 mb-1">
                <motion.div
                    className="inline-flex items-center justify-center w-10 h-10 bg-linear-to-r from-red-500 to-pink-500 rounded-xl shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <FiHeart className="text-xl text-white" />
                </motion.div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                    Love Corner
                </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed text-sm">
                Love? Maybe it&apos;s blank or glitched on my destiny.
            </p>
        </motion.header>
    );
}