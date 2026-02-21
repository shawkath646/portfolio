"use client";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    FiAlertCircle, FiTrash2, FiCheck, FiAlertTriangle,
    FiClock, FiGlobe, FiShield, FiXCircle,
} from "react-icons/fi";
import {
    clearLoginAttempt, clearAllLoginAttempts,
    clearFailureRecord, clearAllFailureRecords,
    type LoginAttemptInfo, type FailureRecordInfo,
} from "@/actions/authentication/adminSecurityManagement";

function formatRelativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

interface LoginAttemptsProps {
    initialAttempts: LoginAttemptInfo[];
    initialFailures: FailureRecordInfo[];
}

export default function LoginAttempts({ initialAttempts, initialFailures }: LoginAttemptsProps) {
    const [isPending, startTransition] = useTransition();
    const [tab, setTab] = useState<"attempts" | "failures">("attempts");
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const showToast = (type: "success" | "error", message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const handleClearAttempt = (id: string) => {
        startTransition(async () => {
            const res = await clearLoginAttempt(id);
            showToast(res.success ? "success" : "error", res.message);
        });
    };

    const handleClearAllAttempts = () => {
        startTransition(async () => {
            const res = await clearAllLoginAttempts();
            showToast(res.success ? "success" : "error", res.message);
        });
    };

    const handleClearFailure = (ip: string) => {
        startTransition(async () => {
            const res = await clearFailureRecord(ip);
            showToast(res.success ? "success" : "error", res.message);
        });
    };

    const handleClearAllFailures = () => {
        startTransition(async () => {
            const res = await clearAllFailureRecords();
            showToast(res.success ? "success" : "error", res.message);
        });
    };

    const blockedCount = initialFailures.filter((f) => f.isBlocked).length;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-purple-100/30 dark:border-purple-800/30 shadow-lg"
            aria-labelledby="attempts-title"
        >
            {/* Header */}
            <header className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-amber-500 to-orange-600 rounded-xl shadow-md" aria-hidden="true">
                        <FiAlertCircle className="text-white text-lg" />
                    </div>
                    <div>
                        <h2 id="attempts-title" className="text-lg font-bold text-gray-900 dark:text-white">
                            Login Activity
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {`${initialAttempts.length} pending · ${initialFailures.length} failed (${blockedCount} blocked)`}
                        </p>
                    </div>
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

            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-700/30 rounded-lg p-1">
                <button
                    onClick={() => setTab("attempts")}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${tab === "attempts"
                        ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                >
                    Pending Attempts ({initialAttempts.length})
                </button>
                <button
                    onClick={() => setTab("failures")}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${tab === "failures"
                        ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                >
                    Failed / Blocked ({initialFailures.length})
                </button>
            </div>

            <AnimatePresence mode="wait">
                {/* Pending Attempts */}
                {tab === "attempts" && (
                    <motion.div
                        key="attempts"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {initialAttempts.length > 0 && (
                            <div className="flex justify-end mb-2">
                                <button
                                    onClick={handleClearAllAttempts}
                                    disabled={isPending}
                                    className="px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                        {initialAttempts.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">No pending login attempts</p>
                        ) : (
                            <div className="space-y-2">
                                {initialAttempts.map((attempt) => {
                                    const location = attempt.address
                                        ? [attempt.address.city, attempt.address.country].filter(Boolean).join(", ")
                                        : null;
                                    return (
                                        <div
                                            key={attempt.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg border ${attempt.isExpired
                                                ? "bg-red-50/40 dark:bg-red-900/10 border-red-100 dark:border-red-900/20"
                                                : "bg-gray-50/60 dark:bg-gray-700/20 border-gray-100 dark:border-gray-700/30"
                                                }`}
                                        >
                                            <div className={`p-2 rounded-lg shrink-0 ${attempt.isExpired
                                                ? "bg-red-100 dark:bg-red-900/30 text-red-500"
                                                : attempt.verified
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-500"
                                                    : "bg-amber-100 dark:bg-amber-900/30 text-amber-500"
                                                }`}>
                                                {attempt.isExpired ? <FiXCircle /> : attempt.verified ? <FiCheck /> : <FiClock />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {attempt.platform}
                                                    </span>
                                                    <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${attempt.isExpired
                                                        ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                                                        : attempt.verified
                                                            ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                                                            : "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"
                                                        }`}>
                                                        {attempt.isExpired ? "Expired" : attempt.verified ? "Verified" : "Pending"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    <span className="flex items-center gap-1">
                                                        <FiGlobe className="text-[10px]" /> {attempt.ipAddress}
                                                    </span>
                                                    {location && <span>{location}</span>}
                                                    <span className="flex items-center gap-1">
                                                        <FiClock className="text-[10px]" /> {formatRelativeTime(attempt.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleClearAttempt(attempt.id)}
                                                disabled={isPending}
                                                className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50 shrink-0"
                                                title="Clear attempt"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Failed / Blocked */}
                {tab === "failures" && (
                    <motion.div
                        key="failures"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {initialFailures.length > 0 && (
                            <div className="flex justify-end mb-2">
                                <button
                                    onClick={handleClearAllFailures}
                                    disabled={isPending}
                                    className="px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                        {initialFailures.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">No failed login records</p>
                        ) : (
                            <div className="space-y-2">
                                {initialFailures.map((record) => (
                                    <div
                                        key={record.id}
                                        className={`flex items-center gap-3 p-3 rounded-lg border ${record.isBlocked
                                            ? "bg-red-50/50 dark:bg-red-900/15 border-red-200/50 dark:border-red-800/30"
                                            : "bg-gray-50/60 dark:bg-gray-700/20 border-gray-100 dark:border-gray-700/30"
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg shrink-0 ${record.isBlocked
                                            ? "bg-red-100 dark:bg-red-900/30 text-red-500"
                                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-500"
                                            }`}>
                                            {record.isBlocked ? <FiShield /> : <FiAlertTriangle />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                                    <FiGlobe className="text-xs" /> {record.ipAddress}
                                                </span>
                                                <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${record.isBlocked
                                                    ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                                                    : "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"
                                                    }`}>
                                                    {record.isBlocked ? "Blocked" : `${record.failedAttemptCount} fail(s)`}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {record.failedAttemptCount} failed attempt(s) · Last: {formatRelativeTime(record.lastFailedAt)}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleClearFailure(record.ipAddress)}
                                            disabled={isPending}
                                            className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50 shrink-0"
                                            title="Clear record"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}
