"use client";
import { motion } from "motion/react";
import { FiShield } from "react-icons/fi";

export default function SecurityHeader() {

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
        >
            <motion.div
                className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl sm:rounded-2xl mb-2 shadow-lg sm:shadow-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                <FiShield className="text-lg sm:text-2xl text-white" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-2">
                Security Center
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
                Advanced security management with comprehensive access controls, password generation, and monitoring capabilities.
            </p>
        </motion.header>
    );
}