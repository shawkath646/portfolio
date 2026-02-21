"use client";
import { Fragment } from "react";
import { Dialog, DialogTitle, Description, Transition } from "@headlessui/react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { FiTrash2, FiX, FiAlertTriangle } from "react-icons/fi";

interface RevokePasswordModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    label?: string;
    isProcessing?: boolean;
}

const createBackdropVariants = (shouldReduceMotion: boolean) => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: shouldReduceMotion ? 0.1 : 0.3 },
    },
    exit: {
        opacity: 0,
        transition: { duration: shouldReduceMotion ? 0.1 : 0.2 },
    },
});

const createPanelVariants = (shouldReduceMotion: boolean) => ({
    hidden: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : 40,
        scale: shouldReduceMotion ? 1 : 0.97,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: shouldReduceMotion
            ? { duration: 0.1 }
            : {
                  type: "spring" as const,
                  stiffness: 260,
                  damping: 22,
              },
    },
    exit: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : 20,
        scale: shouldReduceMotion ? 1 : 0.97,
        transition: { duration: shouldReduceMotion ? 0.1 : 0.15 },
    },
});

export const RevokePasswordModal = ({
    open,
    onClose,
    onConfirm,
    label,
    isProcessing = false,
}: RevokePasswordModalProps) => {
    const shouldReduceMotion = useReducedMotion();
    const backdropVariants = createBackdropVariants(shouldReduceMotion ?? false);
    const panelVariants = createPanelVariants(shouldReduceMotion ?? false);
    const targetLabel = label ? `for ${label}` : "for this scope";

    return (
        <AnimatePresence>
            {open && (
                <Transition appear show={open} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={onClose}>
                        <motion.div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                            variants={backdropVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        />
                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 lg:p-8">
                                <motion.div
                                    variants={panelVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="w-full max-w-md rounded-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl ring-1 ring-gray-200/70 dark:ring-gray-700/50 overflow-hidden"
                                >
                                    <div className="border-b border-indigo-100/50 dark:border-indigo-900/40 bg-white/80 dark:bg-gray-900/80 backdrop-blur p-5">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="p-2 bg-linear-to-br from-blue-600 via-indigo-600 to-fuchsia-600 rounded-xl shadow-md"
                                                    aria-hidden="true"
                                                >
                                                    <FiTrash2 className="text-white text-xl" />
                                                </div>
                                                <div>
                                                    <DialogTitle className="text-xl font-bold bg-linear-to-r from-blue-900 via-indigo-800 to-fuchsia-700 dark:from-white dark:via-indigo-200 dark:to-pink-200 bg-clip-text text-transparent">
                                                        Confirm Revocation
                                                    </DialogTitle>
                                                    <Description className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                                        This action cannot be undone.
                                                    </Description>
                                                </div>
                                            </div>
                                            <button
                                                onClick={onClose}
                                                disabled={isProcessing}
                                                className="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-white/10 rounded-xl transition disabled:opacity-50"
                                                aria-label="Close"
                                            >
                                                <FiX className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        <div className="bg-indigo-50/60 dark:bg-indigo-900/20 border border-indigo-100/70 dark:border-indigo-800/60 rounded-xl p-4 flex items-start gap-3">
                                            <FiAlertTriangle className="text-indigo-600 dark:text-indigo-200 text-xl shrink-0 mt-0.5" />
                                            <div>
                                                <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
                                                    Revoke password {targetLabel}
                                                </h3>
                                                <p className="text-sm text-indigo-700 dark:text-indigo-200">
                                                    Users will immediately lose access that relies on this password.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3">
                                            <motion.button
                                                whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                                                whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                                                onClick={onClose}
                                                disabled={isProcessing}
                                                className="px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-50/60 dark:hover:bg-indigo-900/30 transition-all disabled:opacity-50"
                                            >
                                                Cancel
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                                                whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                                                onClick={onConfirm}
                                                disabled={isProcessing}
                                                className="px-4 py-2 rounded-lg bg-linear-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-fuchsia-700 transition-all disabled:opacity-50"
                                            >
                                                {isProcessing ? "Revoking..." : "Revoke"}
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            )}
        </AnimatePresence>
    );
};
