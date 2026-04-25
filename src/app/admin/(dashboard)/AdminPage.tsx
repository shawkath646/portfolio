"use client";
import { motion, Variants } from "motion/react";
import adminOptions from "@/data/adminPageOptions";


export default function AdminPage() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
    };

    return (
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="mb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 mb-6"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-300 tracking-wide uppercase">
                        Portfolio Control Center
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4"
                >
                    Welcome back,{" "}
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
                        Admin
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
                >
                    Manage your content, analyze metrics, and configure system settings
                    from a single unified interface.
                </motion.p>
            </div>

            {/* Admin Options Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {adminOptions.map((option) => {
                    const IconComponent = option.icon;

                    return (
                        <motion.a
                            key={option.title}
                            href={option.href}
                            variants={itemVariants}
                            className="group relative h-full"
                        >
                            {/* Card Container */}
                            <div className="relative h-full p-6 bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-gray-200 dark:border-gray-700/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 dark:hover:shadow-black/50 hover:-translate-y-1">

                                {/* Hover Gradient Glow (Subtle) */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-linear-to-br ${option.bgGradient} transition-opacity duration-500`} />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        {/* Icon Box */}
                                        <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-gray-100 dark:border-gray-600`}>
                                            <IconComponent className={`w-6 h-6 ${option.color}`} />
                                        </div>

                                        {/* Arrow Icon */}
                                        <div className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {option.title}
                                    </h3>

                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 grow">
                                        {option.description}
                                    </p>

                                    {/* Optional: Add a subtle 'View' text or status at bottom */}
                                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center text-xs font-medium text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                                        <span>Access Module</span>
                                    </div>
                                </div>
                            </div>
                        </motion.a>
                    );
                })}
            </motion.div>
        </div>
    );
}