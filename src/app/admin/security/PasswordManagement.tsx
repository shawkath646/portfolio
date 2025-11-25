"use client";
import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import PasswordCard from "./PasswordCard";
import { GeneratePasswordButton } from "@/modals/GeneratePasswordModal";
import { CleanupPasswordButton } from "@/modals/CleanupPasswordModal";
import { removePassword, PasswordObjectType } from "@/actions/secure/passwordFunc";
import {
    FiKey,
    FiFilter,
} from "react-icons/fi";

// Lazy load modal components
const GeneratePasswordModal = dynamic(
    () => import("@/modals/GeneratePasswordModal").then(mod => ({ default: mod.GeneratePasswordModal })),
    { ssr: false }
);

const CleanupPasswordModal = dynamic(
    () => import("@/modals/CleanupPasswordModal").then(mod => ({ default: mod.CleanupPasswordModal })),
    { ssr: false }
);

export default function PasswordManagement({ passwordList }: { passwordList: PasswordObjectType[] }) {
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showCleanupModal, setShowCleanupModal] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'unused' | 'expired'>('all');

    // Statistics calculation
    const stats = (() => {
        const now = Date.now();
        const total = passwordList.length;

        let active = 0;
        let unused = 0;
        let expired = 0;

        for (const p of passwordList) {
            const isExpired = new Date(p.expiresAt).getTime() < now;
            if (isExpired) expired++;
            if (p.usedTimes > 0) active++;
            if (p.usedTimes === 0 && !isExpired) unused++;
        }

        return { total, active, unused, expired };
    })();

    // Filtered passwords
    const filteredPasswords = (() => {
        const now = Date.now();
        return passwordList.filter(password => {
            const isExpired = new Date(password.expiresAt).getTime() < now;
            switch (filter) {
                case 'active': return password.usedTimes > 0;
                case 'unused': return password.usedTimes === 0 && !isExpired;
                case 'expired': return isExpired;
                default: return true;
            }
        });
    })();

    // Delete handler
    const handleDeletePassword = (passwordId: string) => {
        setDeletingId(passwordId);
        startTransition(async () => {
            try {
                await removePassword(passwordId);
                setDeletingId(null);
            } catch (error) {
                setDeletingId(null);
            }
        });
    };

    // Expired passwords count
    const expiredPasswordsCount = passwordList.filter(p => new Date(p.expiresAt) < new Date()).length;

    // Modal handlers
    const handleOpenGenerateModal = () => setShowGenerateModal(true);
    const handleCloseGenerateModal = () => setShowGenerateModal(false);

    const handleOpenCleanupModal = () => setShowCleanupModal(true);
    const handleCloseCleanupModal = () => setShowCleanupModal(false);

    // Filter change handler
    const handleFilterChange = (newFilter: typeof filter) => {
        setFilter(newFilter);
    };

    return (
        <>
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                aria-labelledby="password-management-title"
                role="region"
            >
                {/* Section Header */}
                <header className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div
                            className="p-2 bg-purple-100/50 dark:bg-white/20 rounded-xl backdrop-blur-sm"
                            aria-hidden="true"
                        >
                            <FiKey className="text-xl text-purple-600 dark:text-white" />
                        </div>
                        <div>
                            <h1
                                id="password-management-title"
                                className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-1"
                            >
                                Password Management
                                {expiredPasswordsCount > 0 && (
                                    <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                        {expiredPasswordsCount} expired
                                    </span>
                                )}
                            </h1>
                            <p className="text-gray-600 dark:text-purple-100 text-xs sm:text-sm">
                                Secure password management for personal access
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <CleanupPasswordButton
                            isOpen={showCleanupModal}
                            onOpen={handleOpenCleanupModal}
                            expiredCount={expiredPasswordsCount}
                        />
                        <GeneratePasswordButton
                            isOpen={showGenerateModal}
                            onOpen={handleOpenGenerateModal}
                        />
                    </div>
                </header>

                {/* Filter Controls */}
                {passwordList.length > 0 && (
                    <nav
                        aria-labelledby="password-filters-title"
                        className="mb-4"
                    >
                        <h2
                            id="password-filters-title"
                            className="sr-only"
                        >
                            Filter Options
                        </h2>
                        <div className="flex items-center justify-end">
                            <div className="flex items-center gap-2">
                                <FiFilter
                                    className="text-gray-500 dark:text-white/80 text-sm"
                                    aria-hidden="true"
                                />
                                <span className="text-gray-500 dark:text-white/80 text-xs font-medium">
                                    Filter:
                                </span>
                                <div
                                    role="tablist"
                                    className="flex rounded-lg overflow-hidden bg-gray-100 dark:bg-white/10 backdrop-blur-sm"
                                    aria-label="Password filter options"
                                >
                                    {[
                                        { key: 'all', label: 'All', count: stats.total },
                                        { key: 'active', label: 'Active', count: stats.active },
                                        { key: 'unused', label: 'Unused', count: stats.unused },
                                        { key: 'expired', label: 'Expired', count: stats.expired },
                                    ].map(({ key, label, count }) => (
                                        <button
                                            key={key}
                                            role="tab"
                                            aria-selected={filter === key}
                                            aria-controls="password-grid"
                                            onClick={() => handleFilterChange(key as typeof filter)}
                                            className={`px-3 py-1.5 text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 dark:focus-visible:ring-white/50 ${filter === key
                                                ? 'bg-purple-100 text-purple-700 dark:bg-white/20 dark:text-white'
                                                : 'text-gray-600 dark:text-white/70 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10'
                                                }`}
                                        >
                                            {label} ({count})
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </nav>
                )}

                {/* Passwords Grid */}
                <main
                    id="password-grid"
                    role="main"
                    aria-labelledby="password-list-title"
                    aria-live="polite"
                    aria-busy={isPending}
                >
                    <h2 id="password-list-title" className="sr-only">
                        Password List ({filteredPasswords.length} passwords)
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredPasswords.map((password, index) => (
                            <PasswordCard
                                key={password.id}
                                password={password}
                                index={index}
                                onDelete={handleDeletePassword}
                                deletingId={deletingId}
                            />
                        ))}

                        {/* No results for filter */}
                        {filteredPasswords.length === 0 && passwordList.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center py-8"
                                role="status"
                                aria-live="polite"
                            >
                                <div className="w-16 h-16 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FiKey className="text-2xl text-gray-400 dark:text-white/60" aria-hidden="true" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-white/80 mb-1">
                                    No passwords match your filter
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-white/60">
                                    Try selecting a different filter to see more passwords
                                </p>
                            </motion.div>
                        )}

                        {/* Empty state */}
                        {passwordList.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center py-8"
                                role="status"
                                aria-live="polite"
                            >
                                <div className="w-16 h-16 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FiKey className="text-2xl text-gray-400 dark:text-white/60" aria-hidden="true" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-white/80 mb-1">
                                    No passwords generated yet
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-white/60">
                                    Click "Generate New" to create your first secure password
                                </p>
                            </motion.div>
                        )}
                    </div>
                </main>
            </motion.section>

            <GeneratePasswordModal
                open={showGenerateModal}
                onClose={handleCloseGenerateModal}
                onSuccess={handleCloseGenerateModal}
            />

            <CleanupPasswordModal
                open={showCleanupModal}
                onClose={handleCloseCleanupModal}
                onSuccess={(count) => {
                    // Optional: Show a toast or notification about successful cleanup
                    handleCloseCleanupModal();
                }}
                expiredCount={expiredPasswordsCount}
            />
        </>
    );
}