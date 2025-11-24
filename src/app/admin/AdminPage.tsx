"use client";
import { motion } from "motion/react";
import adminOptions from "@/data/adminPageOptions";


export default function AdminPage({ isAdministrator }: { isAdministrator: boolean }) {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative text-center mb-12"
                >
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Admin Dashboard
                        </span>
                    </h1>

                    {/* The Badge: Conditional, Stylized, and Attention-Grabbing */}
                    {isAdministrator ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
                            className="inline-flex items-center justify-center mb-4 py-1.5 px-4 rounded-full bg-red-600/10 border border-red-500/50 text-red-500 font-semibold text-xs uppercase tracking-widest shadow-lg"
                            style={{
                                boxShadow: '0 0 10px rgba(239, 68, 68, 0.5), inset 0 0 4px rgba(239, 68, 68, 0.3)'
                            }}
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                            Administrator Mode
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
                            className="inline-flex items-center justify-center mb-4 py-1.5 px-4 rounded-full bg-emerald-600/10 border border-emerald-500/50 text-emerald-500 font-semibold text-xs uppercase tracking-widest shadow-lg"
                            style={{
                                boxShadow: '0 0 10px rgba(16, 185, 129, 0.5), inset 0 0 4px rgba(16, 185, 129, 0.3)'
                            }}
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.636 5.636a9 9 0 01-12.728 0m12.728 0a9 9 0 01-12.728 0M18.364 5.636a9 9 0 01-12.728 0M5.636 5.636a9 9 0 0112.728 0"></path>
                            </svg>
                            Limited Mode
                        </motion.div>
                    )}

                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Manage your portfolio content, settings, and everything in between.
                        Choose a section below to get started.
                    </p>
                </motion.div>

                {/* Admin Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {adminOptions.map((option, index) => {
                        const IconComponent = option.icon;
                        return (
                            <motion.a
                                key={option.title}
                                href={option.href}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.5
                                }}
                                whileHover={{
                                    scale: 1.05,
                                    y: -5,
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
                            >
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${option.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                {/* Content */}
                                <div className="relative p-6">
                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${option.bgGradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent className={`text-2xl ${option.color}`} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-800 dark:group-hover:text-gray-100">
                                        {option.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                        {option.description}
                                    </p>

                                    {/* Arrow Indicator */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Hover Border Effect */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-600 rounded-xl transition-colors duration-300" />
                            </motion.a>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}