"use client";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    FiAlertCircle, FiTrash2, FiCheck, FiAlertTriangle,
    FiClock, FiGlobe, FiXCircle,
} from "react-icons/fi";
import {
    clearLoginAttempt, clearAllLoginAttempts,
} from "@/actions/authentication/adminSecurityManagement";
import { useToast } from "@/components/Toast";
import { LoginAttemptRecord } from "@/types/auth.types";
import { formatRelativeTime } from "@/utils/dateTime";

interface LoginAttemptsProps {
    attempts: LoginAttemptRecord[];
}

type StatusType = "success" | "failed" | "expired" | "waiting" | "locked" | "all";

const STATUS_CONFIG: Record<Exclude<StatusType, "all">, { label: string; icon: typeof FiCheck; color: string; bgColor: string }> = {
    waiting: { label: "Waiting", icon: FiClock, color: "text-amber-500", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
    success: { label: "Verified", icon: FiCheck, color: "text-green-500", bgColor: "bg-green-100 dark:bg-green-900/30" },
    failed: { label: "Failed", icon: FiAlertTriangle, color: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
    expired: { label: "Expired", icon: FiXCircle, color: "text-red-500", bgColor: "bg-red-100 dark:bg-red-900/30" },
    locked: { label: "Locked", icon: FiXCircle, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
};

export default function LoginAttempts({ attempts }: LoginAttemptsProps) {
    const [isPending, startTransition] = useTransition();
    const [tab, setTab] = useState<StatusType>("all");
    const toast = useToast();

    const attemptsByStatus = (attempts: LoginAttemptRecord[]) => {
        return (Object.keys(STATUS_CONFIG) as Exclude<StatusType, "all">[]).reduce(
            (acc, status) => {
                acc[status] = attempts.filter((a) => a.status === status);
                return acc;
            },
            {} as Record<Exclude<StatusType, "all">, LoginAttemptRecord[]>
        );
    };

    const grouped = attemptsByStatus(attempts);
    const statusTabs = (Object.keys(STATUS_CONFIG) as Exclude<StatusType, "all">[]).filter(
        (status) => grouped[status].length > 0 || tab === status
    );

    const currentTabAttempts = tab === "all" ? attempts : grouped[tab as Exclude<StatusType, "all">];

    const handleClearAttempt = (id: string) => {
        startTransition(async () => {
            const res = await clearLoginAttempt(id);
            toast(res.message, res.success ? "success" : "error");
        });
    };

    const handleClearAllAttempts = () => {
        const statusToClear = tab === "all" ? undefined : (tab as Exclude<StatusType, "all">);

        startTransition(async () => {
            const res = await clearAllLoginAttempts(statusToClear);
            toast(res.message, res.success ? "success" : "error");
        });
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-purple-100/30 dark:border-purple-800/30 shadow-lg"
            aria-labelledby="attempts-title"
        >
            {/* Header */}
            <header className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-amber-500 to-orange-600 rounded-xl shadow-md" aria-hidden="true">
                        <FiAlertCircle className="text-white text-lg" />
                    </div>
                    <div>
                        <h2 id="attempts-title" className="text-lg font-bold text-gray-900 dark:text-white">
                            Login Activity
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {`${attempts.length} total record${attempts.length !== 1 ? "s" : ""}`}
                        </p>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            {attempts.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 min-w-0 flex gap-1 bg-gray-100 dark:bg-gray-700/30 rounded-lg p-1 overflow-x-auto custom-scrollbar">
                        <button
                            onClick={() => setTab("all")}
                            className={`px-3 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                                tab === "all"
                                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                        >
                            All ({attempts.length})
                        </button>
                        {statusTabs.map((status) => {
                            const count = grouped[status].length;
                            return (
                                <button
                                    key={status}
                                    onClick={() => setTab(status)}
                                    className={`px-3 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                                        tab === status
                                            ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    }`}
                                >
                                    {STATUS_CONFIG[status].label} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Clear All Button */}
                    {currentTabAttempts.length > 0 && (
                        <button
                            onClick={handleClearAllAttempts}
                            disabled={isPending}
                            className="px-3 py-1.5 w-28 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                            Clear {tab === "all" ? "All" : STATUS_CONFIG[tab as Exclude<StatusType, "all">].label}
                        </button>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="h-104 overflow-y-auto custom-scrollbar pr-1">
                <AnimatePresence mode="wait">
                    {currentTabAttempts.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full text-center flex items-center justify-center"
                        >
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No {tab === "all" ? "login records" : `${STATUS_CONFIG[tab as Exclude<StatusType, "all">].label.toLowerCase()} records`}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={`tab-${tab}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-2"
                        >
                            {currentTabAttempts.map((attempt) => {
                                const location = attempt.address
                                    ? [attempt.address.city, attempt.address.country]
                                        .filter(Boolean)
                                        .join(", ")
                                    : null;

                                const statusConfig = STATUS_CONFIG[attempt.status as Exclude<StatusType, "all">];
                                const Icon = statusConfig.icon;

                                return (
                                    <motion.div
                                        key={attempt.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                                            attempt.status === "expired"
                                                ? "bg-red-50/40 dark:bg-red-900/10 border-red-100 dark:border-red-900/20"
                                                : attempt.status === "success"
                                                ? "bg-green-50/40 dark:bg-green-900/10 border-green-100 dark:border-green-900/20"
                                                : attempt.status === "failed"
                                                ? "bg-orange-50/40 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/20"
                                                : "bg-gray-50/60 dark:bg-gray-700/20 border-gray-100 dark:border-gray-700/30"
                                        }`}
                                    >
                                        <div className={`p-2 rounded-lg shrink-0 ${statusConfig.bgColor} ${statusConfig.color}`}>
                                            <Icon className="text-base" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {attempt.platform || "Unknown"}
                                                </span>
                                                <span
                                                    className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                                                        attempt.status === "expired"
                                                            ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                                                            : attempt.status === "success"
                                                            ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                                                            : attempt.status === "failed"
                                                            ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400"
                                                            : "bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400"
                                                    }`}
                                                >
                                                    {statusConfig.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1 flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    <FiGlobe className="text-[10px] shrink-0" /> {attempt.ipAddress}
                                                </span>
                                                {location && <span>{location}</span>}
                                                <time
                                                    dateTime={new Date(attempt.timestamp).toISOString()}
                                                    className="flex items-center gap-1"
                                                >
                                                    <FiClock className="text-[10px] shrink-0" />{" "}
                                                    {formatRelativeTime(attempt.timestamp)}
                                                </time>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleClearAttempt(attempt.id)}
                                            disabled={isPending}
                                            className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                                            title="Delete record"
                                            aria-label="Delete record"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.section>
    );
}
