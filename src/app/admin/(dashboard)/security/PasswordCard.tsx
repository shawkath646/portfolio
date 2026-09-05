"use client";
import { memo, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    FiKey,
    FiTrash2,
    FiClock,
    FiLoader,
    FiShield,
    FiInfo,
} from "react-icons/fi";
import { GenericAuthPasswordRecordType } from "@/types/genericAuth.types";
import { formatDateTime } from "@/utils/dateTime";

interface PasswordCardProps {
    password: GenericAuthPasswordRecordType;
    index: number;
    onRevokeClick: () => void;
    deletingId: string | null;
}

const PasswordCard = memo<PasswordCardProps>(({ password, index, onRevokeClick, deletingId }) => {
    const [showRoutesHover, setShowRoutesHover] = useState(false);

    const expiresAt = useMemo(() => new Date(password.expiresAt), [password.expiresAt]);
    const createdAt = useMemo(() => new Date(password.createdAt), [password.createdAt]);
    const [isExpired] = useState(() => expiresAt < new Date());
    const [expiresIn] = useState(() => {
        const now = Date.now();
        return Math.ceil((expiresAt.getTime() - now) / (1000 * 60 * 60 * 24));
    });
    const isExpiringSoon = expiresIn <= 2 && expiresIn > 0;

    const routesCount = (password.allowedRoutes || []).length;


    const cardId = `password-${password.id}`;

    const isUsable =
        password.usableTimes === "unlimited" ||
        (password.usedTimes || 0) < password.usableTimes;

    return (
        <motion.article
            id={cardId}
            key={password.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className={`group relative rounded-2xl border p-5 transition-all duration-300 ${isExpired
                ? "border-red-200 dark:border-red-900/60 bg-red-50/20 dark:bg-red-900/10"
                : isExpiringSoon
                    ? "border-yellow-200 dark:border-yellow-900/60 bg-yellow-50/20 dark:bg-yellow-900/10"
                    : "border-gray-200 dark:border-gray-700/80 bg-white/70 dark:bg-gray-800/40"
                }`}
            role="article"
            aria-labelledby={`${cardId}-title`}
        >
            <div className="relative">
                {/* Header */}
                <header className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 bg-linear-to-br from-purple-500 to-indigo-600 rounded-xl shadow-md text-white shrink-0" aria-hidden="true">
                            <FiKey className="text-lg" />
                        </div>
                        <div className="min-w-0">
                            <h3
                                id={`${cardId}-title`}
                                className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate"
                                title={password.name}
                            >
                                {password.name || "Access Key"}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span
                                    className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${password.usedTimes > 0
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                        }`}
                                >
                                    {password.usedTimes > 0 ? `✓ Used (${password.usedTimes}x)` : "⏳ Unused"}
                                </span>

                                {/* Allowed Routes with Hover Card */}
                                <div
                                    className="relative inline-block"
                                    onMouseEnter={() => setShowRoutesHover(true)}
                                    onMouseLeave={() => setShowRoutesHover(false)}
                                    onFocus={() => setShowRoutesHover(true)}
                                    onBlur={() => setShowRoutesHover(false)}
                                >
                                    <button
                                        type="button"
                                        aria-haspopup="dialog"
                                        aria-expanded={showRoutesHover}
                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer"
                                    >
                                        <FiShield size={11} />
                                        <span>{routesCount} Route{routesCount !== 1 ? "s" : ""}</span>
                                        <FiInfo size={10} className="opacity-70" />
                                    </button>

                                    {/* Hover Card Popover */}
                                    <AnimatePresence>
                                        {showRoutesHover && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute left-0 top-full mt-2 w-72 p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-xl ring-1 ring-black/10 dark:ring-white/10 z-30 text-left pointer-events-none"
                                            >
                                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-800">
                                                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                                                        Authorized Routes ({routesCount})
                                                    </span>
                                                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                                                        Active Scopes
                                                    </span>
                                                </div>
                                                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                                    {password.allowedRoutes.map((route) => (
                                                        <div
                                                            key={route}
                                                            className="flex items-center gap-2 p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/60"
                                                        >
                                                            <span className="text-[11px] font-mono text-gray-800 dark:text-gray-200 truncate">
                                                                {route}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expiration Status Badge */}
                    {isExpired ? (
                        <span className="px-2.5 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-[11px] font-semibold rounded-full shrink-0">
                            Expired
                        </span>
                    ) : isExpiringSoon ? (
                        <span className="px-2.5 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-[11px] font-semibold rounded-full shrink-0">
                            {expiresIn}d left
                        </span>
                    ) : null}
                </header>

                {/* Details Grid */}
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600 dark:text-gray-400 p-3 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 truncate">
                        <FiClock className="text-emerald-500 shrink-0" aria-hidden="true" />
                        <span className="truncate" title={formatDateTime(createdAt)}>
                            Created: {formatDateTime(createdAt)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 truncate">
                        <FiClock className="text-amber-500 shrink-0" aria-hidden="true" />
                        <span className="truncate" title={formatDateTime(expiresAt)}>
                            Expires: {formatDateTime(expiresAt)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-purple-500 text-sm shrink-0" aria-hidden="true">🔢</span>
                        <span>
                            Limit: {password.usableTimes === "unlimited" ? "Unlimited" : `${password.usableTimes} uses`}
                        </span>
                    </div>
                </dl>

                {/* Revoke Action */}
                {isUsable && !isExpired && (
                    <div className="mt-4 flex justify-end">
                        <motion.button
                            whileHover={{ scale: deletingId === password.id ? 1 : 1.03 }}
                            whileTap={{ scale: deletingId === password.id ? 1 : 0.97 }}
                            onClick={onRevokeClick}
                            disabled={deletingId === password.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-red-200 dark:border-red-800/70 bg-red-50/60 dark:bg-red-900/20 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all disabled:opacity-50 cursor-pointer"
                            aria-label={`Revoke password ${password.name}`}
                        >
                            {deletingId === password.id ? (
                                <>
                                    <FiLoader size={13} className="animate-spin" aria-hidden="true" />
                                    <span>Revoking...</span>
                                </>
                            ) : (
                                <>
                                    <FiTrash2 size={13} aria-hidden="true" />
                                    <span>Revoke Key</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.article>
    );
});

PasswordCard.displayName = "PasswordCard";

export default PasswordCard;