"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiHome, FiLogOut } from "react-icons/fi";
import { performLogout } from "@/actions/authentication/authActions";
import { LogoutModal } from "@/modals/LogoutModal";

export default function AdminNavbar() {
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await performLogout();
        });
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Center Section - Title */}
                    <Link href="/admin" className="inline-flex">
                        <h1 className="text-lg font-bold bg-linear-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                            Admin Panel
                        </h1>
                    </Link>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            aria-label="Back to Homepage"
                        >
                            <FiHome className="text-lg" />
                            <span className="font-medium hidden sm:inline">Homepage</span>
                        </Link>
                        <button
                            onClick={() => setIsLogoutOpen(true)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            aria-label="Logout"
                        >
                            <FiLogOut className="text-lg" />
                            <span className="font-medium hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
            <LogoutModal
                open={isLogoutOpen}
                onClose={() => setIsLogoutOpen(false)}
                onConfirm={handleLogout}
                isProcessing={isPending}
            />
        </motion.nav>
    );
}
