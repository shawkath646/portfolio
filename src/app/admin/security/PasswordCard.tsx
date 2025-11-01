"use client";
import { memo } from "react";
import { motion } from "motion/react";
import { PasswordObjectType } from "@/actions/secure/passwordFunc";
import {
    FiKey,
    FiTrash2,
    FiMonitor,
    FiClock,
    FiLoader,
} from "react-icons/fi";

const PasswordCard = memo<{
    password: PasswordObjectType;
    index: number;
    onDelete: (id: string) => void;
    deletingId: string | null;
}>(({ password, index, onDelete, deletingId }) => {
    const isExpired = new Date(password.expiresAt) < new Date();
    const expiresIn = Math.ceil((new Date(password.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const isExpiringSoon = expiresIn <= 2 && expiresIn > 0;

    const cardId = `password-${password.id}`;

    // ✅ Centralized usability check
    const isUsable =
        password.usableTimes === "unlimited" ||
        password.usedTimes < password.usableTimes;

    return (
        <motion.article
            id={cardId}
            key={password.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`group relative rounded-2xl border p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ${isExpired
                ? "border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-900/10"
                : isExpiringSoon
                    ? "border-yellow-300 dark:border-yellow-700 bg-yellow-50/30 dark:bg-yellow-900/10"
                    : "border-gray-200 dark:border-gray-600"
                }`}
            role="article"
            aria-labelledby={`${cardId}-title`}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative">
                {/* Header */}
                <header className="flex items-center gap-4 mb-4 pr-16">
                    <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl" aria-hidden="true">
                        <FiKey className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h3
                            id={`${cardId}-title`}
                            className="text-xl font-semibold text-gray-900 dark:text-white mb-1"
                        >
                            {password.siteCode.charAt(0).toUpperCase() + password.siteCode.slice(1).replace(/-/g, ' ')}
                        </h3>
                        <div className="flex items-center gap-3">
                            <span
                                className={`px-3 py-1 text-sm font-medium rounded-full ${password.usedTimes > 0
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                    }`}
                                aria-label={password.usedTimes > 0 ? "Password is active" : "Password is unused"}
                            >
                                {password.usedTimes > 0 ? '✓ Active' : '⏳ Unused'}
                            </span>
                            <span
                                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full font-mono"
                                aria-label={`Password length: ${password.length} characters`}
                            >
                                {password.length} chars
                            </span>
                        </div>
                    </div>
                </header>

                {/* Password Display */}
                <section className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[80px]">
                            Password:
                        </span>
                        <div className="relative flex-1 min-w-0">
                            <code
                                className="block w-full font-mono bg-white dark:bg-gray-800 px-3 py-2 pr-10 rounded-lg text-sm border border-gray-200 dark:border-gray-600 select-all truncate"
                                aria-label="Password hint"
                                title={password.passwordHint}
                            >
                                {password.passwordHint}
                            </code>
                            <button
                                onClick={() => {
                                    const displayText = password.passwordHint || password.password.substring(0, 12) + '...';
                                    navigator.clipboard.writeText(displayText);
                                    alert("Password hint copied to clipboard.");
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Copy password hint to clipboard"
                                title="Copy hint to clipboard"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Details - 2 Column Layout */}
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {password.usedTimes > 0 && password.deviceAddress && (
                        <div className="flex items-center gap-2 col-span-2">
                            <FiMonitor className="text-blue-500 flex-shrink-0" aria-hidden="true" />
                            <dt className="sr-only">Device:</dt>
                            <dd className="truncate">Device: {typeof password.deviceAddress === 'string' ? password.deviceAddress : password.deviceAddress.city}</dd>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <FiClock className="text-green-500 flex-shrink-0" aria-hidden="true" />
                        <dt className="sr-only">Created:</dt>
                        <dd className="truncate">
                            <time dateTime={password.createdAt.toISOString()}>
                                Created: {new Date(password.createdAt).toLocaleDateString()}
                            </time>
                        </dd>
                    </div>

                    <div className="flex items-center gap-2">
                        <FiClock className="text-orange-500 flex-shrink-0" aria-hidden="true" />
                        <dt className="sr-only">Expires:</dt>
                        <dd className="truncate">
                            <time dateTime={password.expiresAt.toISOString()}>
                                Expires: {new Date(password.expiresAt).toLocaleDateString()}
                            </time>
                        </dd>
                    </div>

                    <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                        <span className="text-purple-500" aria-hidden="true">🔢</span>
                        <dt className="sr-only">Usage limit:</dt>
                        <dd>Usage: {password.usableTimes === 'unlimited' ? 'Unlimited' : `${password.usableTimes} times`}</dd>
                    </div>
                </dl>
            </div>

            {/* Status Badge - Repositioned */}
            {isExpired && (
                <div
                    className="absolute top-3 right-3 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium rounded-full"
                    aria-label="Password has expired"
                >
                    Expired
                </div>
            )}
            {isExpiringSoon && !isExpired && (
                <div
                    className="absolute top-3 right-3 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full"
                    aria-label={`Password expires in ${expiresIn} day${expiresIn !== 1 ? 's' : ''}`}
                >
                    Expires in {expiresIn} day{expiresIn !== 1 ? 's' : ''}
                </div>
            )}

            {/* Delete Button - Moved to bottom of card */}
            {isUsable && !isExpired && (
                <div className="mt-4 flex justify-end">
                    <motion.button
                        whileHover={{ scale: deletingId === password.id ? 1 : 1.05 }}
                        whileTap={{ scale: deletingId === password.id ? 1 : 0.97 }}
                        onClick={() => onDelete(password.id)}
                        disabled={deletingId === password.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-red-200 dark:border-red-800 bg-red-50/70 dark:bg-red-900/20 text-red-600 dark:text-red-300 shadow-sm hover:bg-red-100 dark:hover:bg-red-900/30 hover:border-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Revoke password for ${password.siteCode}`}
                    >
                        {deletingId === password.id ? (
                            <>
                                <FiLoader size={16} className="animate-spin" aria-hidden="true" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <>
                                <FiTrash2 size={16} aria-hidden="true" />
                                <span>Revoke</span>
                            </>
                        )}
                    </motion.button>
                </div>
            )}
        </motion.article>
    );
});

PasswordCard.displayName = 'PasswordCard';

export default PasswordCard;