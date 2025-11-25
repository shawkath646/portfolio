"use client";

import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import siteLogout from "@/actions/secure/siteLogout";

export default function AdminNavbar() {

    const handleLogout = async () => {
        const confirmLogOut = confirm("Do you want to logout?");
        if (confirmLogOut) await siteLogout("admin-panel");
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Center Section - Title */}
                    <div className="flex-1">
                        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Admin Panel
                        </h1>
                    </div>

                    {/* Right Section */}
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label="Logout"
                    >
                        <FiLogOut className="text-lg" />
                        <span className="font-medium hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </motion.nav>
    );
}
