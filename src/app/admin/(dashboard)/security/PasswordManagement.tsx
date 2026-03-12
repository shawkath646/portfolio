"use client";
import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { FiAlertTriangle, FiCheck, FiKey, FiPlus, FiTrash2 } from "react-icons/fi";
import { deletePassword } from "@/actions/genericAuth/passwordManagement";
import CleanupPasswordModal from "@/modals/CleanupPasswordModal";
import GeneratePasswordModal from "@/modals/GeneratePasswordModal";
import RevokePasswordModal from "@/modals/RevokePasswordModal";
import { GenericAuthPasswordRecordType } from "@/types/genericAuth.types";
import PasswordCard from "./PasswordCard";

interface PasswordManagementProps {
    passwordList: GenericAuthPasswordRecordType[];
    expiredCount: number;
}

type StatusType = { type: "idle" | "success" | "error"; message: string };

const formatScopeLabel = (accessScope: GenericAuthPasswordRecordType["accessScope"]) =>
    accessScope
        .map((scope) => scope.replace(/_/g, " "))
        .map((scope) => scope.charAt(0).toUpperCase() + scope.slice(1))
        .join(", ");

export default function PasswordManagement({
    passwordList,
    expiredCount
}: PasswordManagementProps) {

    const router = useRouter();
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);
    const [isCleanupOpen, setIsCleanupOpen] = useState(false);
    const [revokeTarget, setRevokeTarget] = useState<{ id: string; label: string } | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [status, setStatus] = useState<StatusType>({ type: "idle", message: "" });
    const [isPending, startTransition] = useTransition();


    const handleDelete = useCallback((id: string) => {
        if (deletingId) return;

        setStatus({ type: "idle", message: "" });
        setDeletingId(id);

        startTransition(async () => {
            const result = await deletePassword(id);

            if (result.success) {
                setStatus({ type: "success", message: "Password revoked successfully." });
            } else {
                setStatus({ type: "error", message: result.message || "Failed to revoke password." });
            }

            setDeletingId(null);
        });
    }, [deletingId]);

    const handleRevokeRequest = useCallback((password: GenericAuthPasswordRecordType) => {
        setRevokeTarget({ id: password.id, label: formatScopeLabel(password.accessScope) });
    }, []);

    const handleConfirmRevoke = useCallback(() => {
        if (!revokeTarget) return;
        handleDelete(revokeTarget.id);
        setRevokeTarget(null);
    }, [revokeTarget, handleDelete]);

    const handleCloseRevoke = useCallback(() => {
        if (deletingId) return;
        setRevokeTarget(null);
    }, [deletingId]);

    const handleGenerateSuccess = useCallback(() => {
        setStatus({ type: "success", message: "Password generated successfully." });
        router.refresh();
    }, [router]);

    const handleCleanupSuccess = useCallback((message: string) => {
        setStatus({ type: "success", message });
        router.refresh();
    }, [router]);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-purple-100/30 dark:border-purple-800/30 shadow-lg"
            aria-labelledby="password-management-title"
        >
            {/* Header omitted for brevity, remains exactly the same as previous step */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl shadow-md" aria-hidden="true">
                        <FiKey className="text-lg text-white" />
                    </div>
                    <div>
                        <h2
                            id="password-management-title"
                            className="text-lg sm:text-xl font-bold bg-linear-to-r from-gray-800 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent"
                        >
                            Restricted Passwords
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                            Generate and manage access passwords for restricted areas.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <motion.button
                        onClick={() => setIsGenerateOpen(true)}
                        disabled={isGenerateOpen}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="relative overflow-hidden bg-purple-100/50 dark:bg-white/20 backdrop-blur-sm border border-purple-200 dark:border-white/30 text-purple-700 dark:text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-purple-200/60 dark:hover:bg-white/30 disabled:opacity-50 transition-all duration-300 flex items-center gap-2 shadow-md text-sm"
                    >
                        <div className="relative z-10 flex items-center gap-2">
                            <FiPlus className="text-sm" />
                            <span>Generate New</span>
                        </div>

                        {/* Animated background */}
                        <div className="absolute inset-0 bg-linear-to-r from-purple-400/10 to-pink-400/10 dark:from-purple-400/20 dark:to-pink-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </motion.button>
                    <motion.button
                        onClick={() => setIsCleanupOpen(true)}
                        disabled={isCleanupOpen}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="relative overflow-hidden bg-white/20 dark:bg-white/20 backdrop-blur-sm border border-gray-300 dark:border-white/30 text-gray-800 dark:text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-white/30 dark:hover:bg-white/30 disabled:opacity-50 transition-all duration-300 flex items-center gap-2 shadow-md text-sm"
                        aria-label="Clean up expired passwords"
                    >
                        <div className="relative z-10 flex items-center gap-2">
                            <FiTrash2 className="text-sm" />
                            <span>Cleanup</span>
                            {expiredCount > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {expiredCount}
                                </span>
                            )}
                        </div>

                        {/* Animated background */}
                        <div className="absolute inset-0 bg-linear-to-r from-orange-400/10 to-red-400/10 dark:from-orange-400/20 dark:to-red-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </motion.button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {status.type !== "idle" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`mb-5 p-3 rounded-lg backdrop-blur-sm ${status.type === "success"
                            ? "bg-green-100/80 dark:bg-green-900/20 border border-green-200/50 dark:border-green-700/30"
                            : "bg-red-100/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-700/30"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {status.type === "success" ? (
                                <FiCheck className="text-green-600 dark:text-green-400 text-sm" />
                            ) : (
                                <FiAlertTriangle className="text-red-600 dark:text-red-400 text-sm" />
                            )}
                            <p
                                className={`text-xs font-medium ${status.type === "success"
                                    ? "text-green-700 dark:text-green-300"
                                    : "text-red-700 dark:text-red-300"
                                    }`}
                            >
                                {status.message}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {passwordList.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center text-gray-600 dark:text-gray-300">
                    <p className="text-sm">No restricted passwords created yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {passwordList.map((password, index) => (
                        <PasswordCard
                            key={password.id}
                            password={password}
                            index={index}
                            onRevokeClick={() => handleRevokeRequest(password)}
                            deletingId={deletingId}
                        />
                    ))}
                </div>
            )}

            <AnimatePresence mode="wait">
                {revokeTarget && (
                    <RevokePasswordModal
                        open={!!revokeTarget}
                        onClose={handleCloseRevoke}
                        onConfirm={handleConfirmRevoke}
                        label={revokeTarget?.label}
                        isProcessing={deletingId === revokeTarget?.id}
                    />
                )}

                {isGenerateOpen && (
                    <GeneratePasswordModal
                        open={isGenerateOpen}
                        onClose={() => setIsGenerateOpen(false)}
                        onSuccess={handleGenerateSuccess}
                    />
                )}

                {isCleanupOpen && (
                    <CleanupPasswordModal
                        open={isCleanupOpen}
                        onClose={() => setIsCleanupOpen(false)}
                        onSuccess={handleCleanupSuccess}
                        expiredCount={expiredCount}
                    />
                )}
            </AnimatePresence>

            {isPending && deletingId && (
                <div className="sr-only" aria-live="polite">
                    Deleting password...
                </div>
            )}
        </motion.section>
    );
}