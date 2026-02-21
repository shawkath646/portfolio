"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
    FiMonitor, FiGlobe, FiTrash2,
    FiCheck, FiAlertTriangle, FiClock, FiMapPin, FiLogOut,
} from "react-icons/fi";
import {
    revokeSession, revokeAllOtherSessions,
    revokeAllSessions,
} from "@/actions/authentication/adminSecurityManagement";
import type { AuthSessionResType } from "@/actions/authentication/adminSecurityManagement";
import { formatRelativeTime, formatDateTime } from "@/utils/dateTime";
import { getPlatformIcon } from "@/utils/clientPlatform";
import { parseOS, parseBrowser } from "@/utils/userAgent";




interface ActiveSessionsProps {
    sessionList: AuthSessionResType[];
}

export default function ActiveSessions({ sessionList }: ActiveSessionsProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [revoking, setRevoking] = useState<string | null>(null);
    const [showTerminateAll, setShowTerminateAll] = useState(false);

    const showToast = (type: "success" | "error", message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const handleRevoke = (sessionId: string) => {
        setRevoking(sessionId);
        startTransition(async () => {
            const res = await revokeSession(sessionId);
            setRevoking(null);
            showToast(res.success ? "success" : "error", res.message);
        });
    };

    const handleRevokeAllOther = () => {
        startTransition(async () => {
            const res = await revokeAllOtherSessions();
            showToast(res.success ? "success" : "error", res.message);
        });
    };

    const handleTerminateAll = () => {
        startTransition(async () => {
            const res = await revokeAllSessions();
            if (res.success) {
                setShowTerminateAll(false);
                router.push("/admin/login");
            } else {
                showToast("error", res.message);
            }
        });
    };

    const otherSessions = sessionList.filter((s) => !s.isCurrent);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-purple-100/30 dark:border-purple-800/30 shadow-lg"
            aria-labelledby="sessionList-title"
        >
            {/* Header */}
            <header className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl shadow-md" aria-hidden="true">
                        <FiMonitor className="text-white text-lg" />
                    </div>
                    <div>
                        <h2 id="sessionList-title" className="text-lg font-bold text-gray-900 dark:text-white">
                            Active Sessions
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {sessionList.length} active session(s)
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleRevokeAllOther}
                        disabled={isPending || otherSessions.length === 0}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-100/70 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200/70 dark:hover:bg-amber-900/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Revoke all other sessions"
                    >
                        {isPending ? "..." : "Revoke Others"}
                    </button>
                    <button
                        onClick={() => setShowTerminateAll(true)}
                        disabled={isPending}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100/70 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200/70 dark:hover:bg-red-900/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Terminate all sessions"
                    >
                        {isPending ? "..." : "Terminate All"}
                    </button>
                </div>
            </header>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`mb-4 p-3 rounded-lg border text-sm flex items-center gap-2 ${toast.type === "success"
                            ? "bg-green-100/80 dark:bg-green-900/20 border-green-200/50 dark:border-green-700/30 text-green-700 dark:text-green-300"
                            : "bg-red-100/80 dark:bg-red-900/20 border-red-200/50 dark:border-red-700/30 text-red-700 dark:text-red-300"
                            }`}
                    >
                        {toast.type === "success" ? <FiCheck className="shrink-0" /> : <FiAlertTriangle className="shrink-0" />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Session List */}
            {sessionList.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">No active sessions</p>
            ) : (
                <div className="space-y-2">
                    {sessionList.map((session) => {
                        const PlatformIcon = getPlatformIcon(session.platform);
                        const location = session.address
                            ? [session.address.city, session.address.region, session.address.country].filter(Boolean).join(", ")
                            : null;
                        const os = parseOS(session.userAgent);
                        const browser = parseBrowser(session.userAgent);

                        return (
                            <motion.div
                                key={session.id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className={`p-3 rounded-lg border transition-colors ${session.isCurrent
                                    ? "bg-indigo-50/60 dark:bg-indigo-900/15 border-indigo-200/50 dark:border-indigo-800/30"
                                    : "bg-gray-50/60 dark:bg-gray-700/20 border-gray-100 dark:border-gray-700/30"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg shrink-0 ${session.isCurrent
                                        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                                        : "bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400"
                                        }`}>
                                        <PlatformIcon />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {browser} on {os}
                                            </span>
                                            {session.isCurrent && (
                                                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <FiGlobe className="text-[10px]" />
                                                {session.ipAddress}
                                            </span>
                                            {location && (
                                                <span className="flex items-center gap-1 truncate">
                                                    <FiMapPin className="text-[10px] shrink-0" />
                                                    {location}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <FiClock className="text-[10px]" />
                                                {formatRelativeTime(session.createdAt)}
                                            </span>
                                        </div>
                                        {/* Extra details row */}
                                        <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500 mt-1 flex-wrap">
                                            {session.address?.timezone && (
                                                <span>🕐 {session.address.timezone}</span>
                                            )}
                                            {session.address?.countryCode && (
                                                <span>🏳 {session.address.countryCode}</span>
                                            )}
                                            <span title="Session started">
                                                Started: {formatDateTime(session.createdAt)}
                                            </span>
                                            <span title="Token expiry">
                                                Expires: {formatDateTime(session.accessTokenExpiresAt)}
                                            </span>
                                        </div>
                                    </div>

                                    {!session.isCurrent && (
                                        <button
                                            onClick={() => handleRevoke(session.id)}
                                            disabled={isPending || revoking === session.id}
                                            className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50 shrink-0"
                                            title="Revoke session"
                                        >
                                            {revoking === session.id ? (
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <FiTrash2 />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Terminate All Modal */}
            <AnimatePresence>
                {showTerminateAll && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={() => setShowTerminateAll(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 border border-red-200 dark:border-red-800/30"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                    <FiAlertTriangle className="text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Terminate All Sessions?</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                                This will log you out from all devices. You&apos;ll need to login again.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowTerminateAll(false)}
                                    disabled={isPending}
                                    className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleTerminateAll}
                                    disabled={isPending}
                                    className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    {isPending ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Terminating...
                                        </>
                                    ) : (
                                        <>
                                            <FiLogOut className="text-sm" />
                                            Terminate All
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}
