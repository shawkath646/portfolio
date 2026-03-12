"use client";
import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
    FiSlash, FiPlus, FiTrash2, FiRefreshCw, FiCheck,
    FiAlertTriangle, FiGlobe, FiX,
} from "react-icons/fi";
import {
    addBlockedIP, removeBlockedIP, clearAllBlockedIPs,
} from "@/actions/authentication/adminSecurityManagement";

interface BlockedIPsProps {
    ipList: string[];
}

const IP_REGEX = /^[\da-fA-F.:]+$/;

export default function BlockedIPs({ ipList }: BlockedIPsProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [showAdd, setShowAdd] = useState(false);
    const [newIP, setNewIP] = useState("");
    const [status, setStatus] = useState<{ type: "success" | "error" | "idle"; message: string }>({ type: "idle", message: "" });
    const [showClearAll, setShowClearAll] = useState(false);

    const handleAdd = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        const ipToBlock = newIP.trim();
        if (!ipToBlock) return;

        if (ipList.includes(ipToBlock)) {
            setStatus({ type: "error", message: "This IP is already blocked." });
            return;
        }

        if (!IP_REGEX.test(ipToBlock)) {
            setStatus({ type: "error", message: "Invalid IP address format." });
            return;
        }

        setStatus({ type: "idle", message: "" });
        startTransition(async () => {
            const res = await addBlockedIP(ipToBlock);
            if (res.success) {
                setNewIP("");
                setShowAdd(false);
                setStatus({ type: "success", message: res.message });
            } else {
                setStatus({ type: "error", message: res.message });
            }
        });
    }, [newIP, ipList]);

    const handleRemove = useCallback((ip: string) => {
        setStatus({ type: "idle", message: "" });
        startTransition(async () => {
            const res = await removeBlockedIP(ip);
            if (res.success) {
                setStatus({ type: "success", message: res.message });
            } else {
                setStatus({ type: "error", message: res.message });
            }
        });
    }, []);

    const handleClearAll = useCallback(() => {
        setStatus({ type: "idle", message: "" });
        startTransition(async () => {
            const res = await clearAllBlockedIPs();
            if (res.success) {
                setShowClearAll(false);
                setStatus({ type: "success", message: res.message });
            } else {
                setStatus({ type: "error", message: res.message });
            }
        });
    }, []);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-purple-100/30 dark:border-purple-800/30 shadow-lg"
            aria-labelledby="blocked-ips-title"
        >
            {/* Header */}
            <header className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-red-500 to-rose-600 rounded-xl shadow-md" aria-hidden="true">
                        <FiSlash className="text-white text-lg" />
                    </div>
                    <div>
                        <h2 id="blocked-ips-title" className="text-lg font-bold text-gray-900 dark:text-white">
                            Blocked IPs
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {`${ipList.length} IP(s) blocked from admin login`}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={router.refresh}
                        disabled={isPending}
                        className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-50"
                        title="Refresh"
                    >
                        <FiRefreshCw className={isPending ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={() => { setShowAdd(!showAdd); setNewIP(""); }}
                        className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        title="Add IP"
                    >
                        <FiPlus />
                    </button>
                </div>
            </header>

            {/* Status */}
            <AnimatePresence>
                {status.type !== "idle" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`mb-3 p-2.5 rounded-lg border text-sm flex items-center gap-2 ${status.type === "success"
                            ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800/40 dark:text-green-300"
                            : "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800/40 dark:text-red-300"
                            }`}
                    >
                        {status.type === "success" ? <FiCheck className="shrink-0" /> : <FiAlertTriangle className="shrink-0" />}
                        {status.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add IP Form */}
            <AnimatePresence>
                {showAdd && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAdd}
                        className="mb-4 overflow-hidden"
                    >
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="text"
                                    value={newIP}
                                    onChange={(e) => setNewIP(e.target.value.replace(/\s+/g, ''))}
                                    placeholder="Enter IP address (e.g. 192.168.1.1)"
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isPending || !newIP.trim()}
                                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                                {isPending ? "Adding..." : "Block"}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowAdd(false); setNewIP(""); }}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors shrink-0"
                            >
                                <FiX />
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* IP List */}
            {ipList.length === 0 ? (
                <div className="text-center py-6">
                    <FiSlash className="mx-auto text-2xl text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No blocked IPs</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Add IPs to prevent them from accessing the admin login
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-2">
                        {ipList.map((ip) => (
                            <motion.div
                                key={ip}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/60 dark:bg-gray-700/20 border border-gray-100 dark:border-gray-700/30 overflow-hidden"
                            >
                                <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-lg shrink-0">
                                    <FiSlash />
                                </div>
                                <span className="flex-1 text-sm font-mono text-gray-900 dark:text-white truncate">
                                    {ip}
                                </span>
                                <button
                                    onClick={() => handleRemove(ip)}
                                    disabled={isPending}
                                    className="p-2 text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors disabled:opacity-50 shrink-0"
                                    title="Unblock IP"
                                >
                                    <FiTrash2 />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Clear All */}
                    {ipList.length > 1 && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/30 overflow-hidden">
                            <AnimatePresence mode="wait">
                                {showClearAll ? (
                                    <motion.div
                                        key="confirm"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-red-50 dark:bg-red-900/15 rounded-lg border border-red-200/50 dark:border-red-800/30"
                                    >
                                        <span className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5">
                                            <FiAlertTriangle className="shrink-0 text-sm" /> Remove all {ipList.length} blocked IPs?
                                        </span>
                                        <div className="flex gap-2 self-end sm:self-auto">
                                            <button
                                                onClick={handleClearAll}
                                                disabled={isPending}
                                                className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded transition-colors hover:bg-red-700 disabled:opacity-50 whitespace-nowrap"
                                            >
                                                {isPending ? "Clearing..." : "Yes, Clear All"}
                                            </button>
                                            <button
                                                onClick={() => setShowClearAll(false)}
                                                className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="trigger"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <button
                                            onClick={() => setShowClearAll(true)}
                                            className="text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                                        >
                                            Clear all blocked IPs
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </>
            )}
        </motion.section>
    );
}