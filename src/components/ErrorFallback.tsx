"use client";

import { motion } from "motion/react";
import { FiAlertCircle } from "react-icons/fi";

interface ErrorFallbackProps {
    message: string;
}

export default function ErrorFallback({ message }: ErrorFallbackProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-start sm:items-center gap-3 p-3 sm:px-4 sm:py-3 rounded-lg border bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400 shadow-sm"
            role="alert"
            aria-live="assertive"
        >
            <div className="p-0.5 sm:p-0 shrink-0">
                <FiAlertCircle className="text-lg sm:text-xl" aria-hidden="true" />
            </div>
            <p className="flex-1 text-sm font-medium leading-relaxed">
                Component Error: {message}
            </p>
        </motion.section>
    );
}