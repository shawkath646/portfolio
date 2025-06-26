"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaTelegramPlane, FaLinkedin } from "react-icons/fa";
import { FaUpwork } from "react-icons/fa6";
import { SiFiverr } from "react-icons/si";

export default function OrderNowComponent() {
    return (
        <motion.section
            className="w-full bg-gradient-to-tr from-blue-400 dark:from-blue-900 to-emerald-400 dark:to-emerald-900"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
        >
            <div className="container mx-auto pt-20">
                <motion.h3
                    className="text-2xl sm:text-3xl font-bold text-center mb-12 text-white dark:text-gray-300"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Order Now / Hire Me
                </motion.h3>

                {/* PLATFORM GROUP */}
                <motion.div
                    className="w-full flex flex-col md:flex-row gap-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {/* Quick Direct Connect */}
                    <div className="flex-1 bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50 dark:from-blue-900/40 dark:via-blue-900/30 dark:to-blue-900/40 border border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg p-6 flex flex-col items-center">
                        <span className="inline-flex items-center gap-2 mb-2">
                            <span className="text-blue-700 dark:text-blue-300 text-xl font-semibold">
                                Quick Direct Connect
                            </span>
                            <span className="bg-blue-200/80 dark:bg-blue-700/50 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded text-xs font-bold">
                                Fastest
                            </span>
                        </span>
                        <p className="text-blue-900 dark:text-blue-100 mb-4 text-center text-sm">
                            Connect directly for instant response and a more personal collaboration experience.
                        </p>
                        <div className="flex gap-6 mt-2">
                            <a
                                href="https://t.me/yourusername" // Replace with your Telegram
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center group"
                            >
                                <FaTelegramPlane className="text-blue-500 group-hover:scale-110 transition-transform text-3xl" />
                                <span className="text-xs text-blue-700 dark:text-blue-200 mt-1 font-medium">Telegram</span>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/yourusername" // Replace with your LinkedIn
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center group"
                            >
                                <FaLinkedin className="text-blue-700 group-hover:scale-110 transition-transform text-3xl" />
                                <span className="text-xs text-blue-700 dark:text-blue-200 mt-1 font-medium">LinkedIn</span>
                            </a>
                        </div>
                    </div>

                    {/* Trustable Platforms */}
                    <div className="flex-1 bg-gradient-to-b from-green-50 via-green-100 to-green-50 dark:from-green-900/40 dark:via-green-900/30 dark:to-green-900/40 border border-green-200 dark:border-green-700 rounded-2xl shadow-lg p-6 flex flex-col items-center">
                        <span className="inline-flex items-center gap-2 mb-2">
                            <span className="text-green-700 dark:text-green-300 text-xl font-semibold">
                                Order via Platforms
                            </span>
                            <span className="bg-green-200/80 dark:bg-green-700/50 text-green-700 dark:text-green-200 px-2 py-0.5 rounded text-xs font-bold">
                                Trusted
                            </span>
                        </span>
                        <p className="text-green-900 dark:text-green-100 mb-4 text-center text-sm">
                            Hire me securely through top freelancing platforms for extra peace of mind and buyer protection.
                        </p>
                        <div className="flex gap-6 mt-2">
                            <Link
                                href="https://www.fiverr.com/yourusername" // Replace with your Fiverr profile
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center group"
                            >
                                <SiFiverr className="text-green-500 group-hover:scale-110 transition-transform text-3xl" />
                                <span className="text-xs text-green-700 dark:text-green-200 mt-1 font-medium">Fiverr</span>
                            </Link>
                            <Link
                                href="https://www.upwork.com/freelancers/~yourprofile" // Replace with your Upwork profile
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center group"
                            >
                                <FaUpwork className="text-green-600 group-hover:scale-110 transition-transform text-3xl" />
                                <span className="text-xs text-green-700 dark:text-green-200 mt-1 font-medium">Upwork</span>
                            </Link>
                        </div>
                    </div>
                </motion.div>
                <div className="w-full flex justify-end mt-30 pb-5">
                    <Link
                        href="/about"
                        className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-6 py-2 rounded-full shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Know More About Me &rarr;
                    </Link>
                </div>
            </div>
        </motion.section>
    );
}