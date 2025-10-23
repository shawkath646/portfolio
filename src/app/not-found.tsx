"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
    FiHome,
    FiAlertCircle
} from "react-icons/fi";
import { Variants } from "framer-motion";
import "../styles/not-found.css";

// Animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 },
    },
};

// 404 text animation variants
const textVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.8,
        },
    },
};

export default function NotFound() {
    // Get the current path
    const pathname = usePathname();

    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 dark:from-[#0a192f] dark:via-[#1e293b] dark:to-[#172554]"
            aria-label="Notfound page content"
        >
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                {/* Digital noise pattern */}
                <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAABXRb3MAAAAA1BMVEX///+nxBvIAAAAC0lEQVR4AWP4DwAAgACA7C7POgAAAABJRU5ErkJggg==')] opacity-[0.02]"></div>

                {/* Floating geometric shapes */}
                <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-blue-500/20 dark:border-blue-400/10 rounded-full animate-float opacity-50" />
                <div className="absolute bottom-1/4 right-1/3 w-20 h-20 border-2 border-blue-600/20 dark:border-blue-500/10 rotate-45 animate-float-reverse opacity-40" style={{ animationDelay: '1.5s' }} />
                <div className="absolute top-1/3 right-1/4 w-12 h-12 border-2 border-indigo-500/20 dark:border-indigo-400/10 rounded-md rotate-12 animate-float opacity-40" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-1/3 left-1/3 w-24 h-24 border border-blue-400/20 dark:border-blue-300/10 rounded-full animate-float-reverse opacity-30" style={{ animationDelay: '3s' }} />
            </div>

            <motion.section
                className="relative z-10 max-w-3xl w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                aria-labelledby="error-title"
            >
                {/* Top "Error" bar */}
                <div 
                    className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500 h-2 w-full"
                    aria-hidden="true" 
                />

                {/* Error content container */}
                <div className="py-8 px-6 text-center relative">
                    {/* 404 with glitch effect */}
                    <motion.div
                        className="relative text-center mb-8"
                        variants={textVariants}
                    >
                        <h1
                            id="error-title"
                            className="font-mono text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 inline-block"
                            aria-label="404 error"
                        >
                            404
                        </h1>
                    </motion.div>

                    <motion.h2
                        className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6"
                        variants={itemVariants}
                    >
                        Page Not Found
                    </motion.h2>

                    <motion.p
                        className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto"
                        variants={itemVariants}
                    >
                        The page you are looking for doesn't exist or has been moved.
                    </motion.p>

                    {/* Requested Path */}
                    <motion.div
                        className="mb-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-2 text-gray-700 dark:text-gray-300"
                        variants={itemVariants}
                        role="alert"
                        aria-live="polite"
                    >
                        <FiAlertCircle className="text-blue-500 flex-shrink-0" aria-hidden="true" />
                        <span className="font-mono text-sm truncate max-w-[230px] sm:max-w-sm md:max-w-md">
                            Requested path: <code>{pathname}</code>
                        </span>
                    </motion.div>

                    {/* Back to home button */}
                    <motion.nav
                        variants={itemVariants}
                        aria-label="Page navigation"
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-3 px-6 rounded-full hover:shadow-lg transition transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                            aria-label="Go back to home page"
                        >
                            <FiHome className="text-lg" aria-hidden="true" />
                            <span>Back to Home</span>
                        </Link>
                    </motion.nav>
                </div>
            </motion.section>
        </main>
    );
}
