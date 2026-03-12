"use client";
import { memo, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
    FiKey,
    FiTrash2,
    FiClock,
    FiLoader,
} from "react-icons/fi";
import { GenericAuthPasswordRecordType } from "@/types/genericAuth.types";
import { formatDateTime } from "@/utils/dateTime";

const PasswordCard = memo<{
    password: GenericAuthPasswordRecordType;
    index: number;
    onRevokeClick: () => void;
    deletingId: string | null;
}>(({ password, index, onRevokeClick, deletingId }) => {
    const expiresAt = useMemo(() => new Date(password.expiresAt), [password.expiresAt]);
    const createdAt = useMemo(() => new Date(password.createdAt), [password.createdAt]);
    const [isExpired] = useState(() => expiresAt < new Date());
    const [expiresIn] = useState(() => {
        const now = Date.now();
        return Math.ceil((expiresAt.getTime() - now) / (1000 * 60 * 60 * 24));
    });
    const isExpiringSoon = expiresIn <= 2 && expiresIn > 0;

    const scopeLabel = useMemo(
        () =>
            password.accessScope
                .map((scope) => scope.replace(/_/g, " "))
                .map((scope) => scope.charAt(0).toUpperCase() + scope.slice(1))
                .join(", "),
        [password.accessScope]
    );

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
            className={`group relative rounded-2xl border p-4 transition-all duration-300 ${isExpired
                ? "border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-900/10"
                : isExpiringSoon
                    ? "border-yellow-300 dark:border-yellow-700 bg-yellow-50/30 dark:bg-yellow-900/10"
                    : "border-gray-200 dark:border-gray-600"
                }`}
            role="article"
            aria-labelledby={`${cardId}-title`}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-linear-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative">
                {/* Header */}
                <header className="flex items-center gap-3 mb-3 pr-14">
                    <div className="p-1.5 bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-lg" aria-hidden="true">
                        <FiKey className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h3
                            id={`${cardId}-title`}
                            className="text-lg font-semibold text-gray-900 dark:text-white mb-1"
                        >
                            {scopeLabel}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span
                                className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${password.usedTimes > 0
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                    }`}
                                aria-label={password.usedTimes > 0 ? "Password is active" : "Password is unused"}
                            >
                                {password.usedTimes > 0 ? '✓ Active' : '⏳ Unused'}
                            </span>
                            <span
                                className="px-2.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full font-mono"
                                aria-label={`Password length: ${password.length} characters`}
                            >
                                {password.length} chars
                            </span>
                        </div>
                    </div>
                </header>

                {/* Password Display */}
                <section className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-18">
                            Password Hint:
                        </span>
                        <div className="relative flex-1 min-w-0">
                            <code
                                className="block w-full font-mono bg-white dark:bg-gray-800 px-2.5 py-1.5 pr-8 rounded-lg text-xs border border-gray-200 dark:border-gray-600 select-all truncate"
                                aria-label="Password hint"
                                title={password.passwordHint}
                            >
                                {password.passwordHint}{"*".repeat(password.length - password.passwordHint.length)}
                            </code>
                        </div>
                    </div>
                </section>

                {/* Details - 2 Column Layout */}
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <FiClock className="text-green-500 shrink-0" aria-hidden="true" />
                        <dt className="sr-only">Created:</dt>
                        <dd className="truncate">
                            <time dateTime={createdAt.toISOString()}>
                                Created: {formatDateTime(createdAt)}
                            </time>
                        </dd>
                    </div>

                    <div className="flex items-center gap-2">
                        <FiClock className="text-orange-500 shrink-0" aria-hidden="true" />
                        <dt className="sr-only">Expires:</dt>
                        <dd className="truncate">
                            <time dateTime={expiresAt.toISOString()}>
                                Expires: {formatDateTime(expiresAt)}
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
                    className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[11px] font-medium rounded-full"
                    aria-label="Password has expired"
                >
                    Expired
                </div>
            )}
            {isExpiringSoon && !isExpired && (
                <div
                    className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[11px] font-medium rounded-full"
                    aria-label={`Password expires in ${expiresIn} day${expiresIn !== 1 ? 's' : ''}`}
                >
                    Expires in {expiresIn} day{expiresIn !== 1 ? 's' : ''}
                </div>
            )}

            {isUsable && !isExpired && (
                <div className="mt-3 flex justify-end">
                    <motion.button
                        whileHover={{ scale: deletingId === password.id ? 1 : 1.05 }}
                        whileTap={{ scale: deletingId === password.id ? 1 : 0.97 }}
                        onClick={onRevokeClick}
                        disabled={deletingId === password.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-red-200 dark:border-red-800 bg-red-50/70 dark:bg-red-900/20 text-red-600 dark:text-red-300 shadow-sm hover:bg-red-100 dark:hover:bg-red-900/30 hover:border-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Revoke password for ${password.accessScope}`}
                    >
                        {deletingId === password.id ? (
                            <>
                                <FiLoader size={14} className="animate-spin" aria-hidden="true" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <>
                                <FiTrash2 size={14} aria-hidden="true" />
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