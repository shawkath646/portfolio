"use client";
import { Fragment, useState, useTransition } from 'react';
import { Dialog, DialogTitle, Description, Transition } from '@headlessui/react';
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { FiTrash2, FiX, FiCheck, FiAlertTriangle, FiLoader } from 'react-icons/fi';
import { cleanupExpirePassword } from '@/actions/genericAuth/passwordManagement';
import { APIResponseType } from '@/types/common.types';

interface CleanupPasswordModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: (message: string) => void;
    expiredCount?: number;
}

// Optimized animation variants
const createBackdropVariants = (shouldReduceMotion: boolean) => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: shouldReduceMotion ? 0.1 : 0.3 }
    },
    exit: {
        opacity: 0,
        transition: { duration: shouldReduceMotion ? 0.1 : 0.2 }
    },
});

const createPanelVariants = (shouldReduceMotion: boolean) => ({
    hidden: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : 40,
        scale: shouldReduceMotion ? 1 : 0.97
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: shouldReduceMotion
            ? { duration: 0.1 }
            : {
                type: 'spring' as const,
                stiffness: 260,
                damping: 22
            }
    },
    exit: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : 20,
        scale: shouldReduceMotion ? 1 : 0.97,
        transition: { duration: shouldReduceMotion ? 0.1 : 0.15 }
    },
});

// Modal Trigger Component
export const CleanupPasswordButton = ({ isOpen, onOpen, expiredCount = 0 }: { isOpen: boolean; onOpen: () => void; expiredCount?: number }) => {
    return (
        <motion.button
            onClick={onOpen}
            disabled={isOpen}
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
    );
};

// Main Modal Component
export const CleanupPasswordModal = ({ open, onClose, onSuccess, expiredCount = 0 }: CleanupPasswordModalProps) => {
    const shouldReduceMotion = useReducedMotion();
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<APIResponseType | null>(null);

    // Animation variants
    const backdropVariants = createBackdropVariants(shouldReduceMotion ?? false);
    const panelVariants = createPanelVariants(shouldReduceMotion ?? false);

    const handleCleanup = () => {
        startTransition(async () => {
            const response = await cleanupExpirePassword();
            setResult(response);
            if (response.success && onSuccess) {
                onSuccess(response.message);
            }
        });
    };

    const handleClose = () => {
        setResult(null);
        onClose();
    };

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
                                    {/* Modal Header */}
                                    <div className="border-b border-indigo-100/50 dark:border-indigo-900/40 bg-white/80 dark:bg-gray-900/80 backdrop-blur p-5">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-linear-to-br from-blue-600 via-indigo-600 to-fuchsia-600 rounded-xl shadow-md" aria-hidden="true">
                                                    <FiTrash2 className="text-white text-xl" />
                                                </div>
                                                <div>
                                                    <DialogTitle className="text-xl font-bold bg-linear-to-r from-blue-900 via-indigo-800 to-fuchsia-700 dark:from-white dark:via-indigo-200 dark:to-pink-200 bg-clip-text text-transparent">
                                                        {result ? 'Cleanup Complete' : 'Clean Up Expired Passwords'}
                                                    </DialogTitle>
                                                    <Description className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                                        {result
                                                            ? `${result.success ? 'Successfully removed' : 'Failed to remove'} expired passwords`
                                                            : 'Remove all expired passwords from the system'
                                                        }
                                                    </Description>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleClose}
                                                disabled={isPending}
                                                className="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-white/10 rounded-xl transition disabled:opacity-50"
                                                aria-label="Close"
                                            >
                                                <FiX className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Modal Content */}
                                    <div className="p-6">
                                        {!result ? (
                                            /* Confirmation Step */
                                            <div className="space-y-6">
                                                <div className="bg-indigo-50/60 dark:bg-indigo-900/20 border border-indigo-100/70 dark:border-indigo-800/60 rounded-xl p-4 flex items-start gap-3">
                                                    <FiAlertTriangle className="text-indigo-600 dark:text-indigo-200 text-xl shrink-0 mt-0.5" />
                                                    <div>
                                                        <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
                                                            Cleanup Confirmation
                                                        </h3>
                                                        <p className="text-sm text-indigo-700 dark:text-indigo-200">
                                                            This action will permanently remove all expired passwords from the system.
                                                            {expiredCount > 0 ? ` ${expiredCount} expired password${expiredCount === 1 ? '' : 's'} will be deleted.` : ' No expired passwords were found.'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end gap-4">
                                                    <motion.button
                                                        whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                                                        whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                                                        onClick={onClose}
                                                        disabled={isPending}
                                                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                                                    >
                                                        Cancel
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                                                        whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                                                        onClick={handleCleanup}
                                                        disabled={isPending || expiredCount === 0}
                                                        className="px-4 py-2 rounded-lg bg-linear-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-fuchsia-700 transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
                                                    >
                                                        {isPending ? (
                                                            <>
                                                                <FiLoader className="animate-spin" />
                                                                <span>Cleaning up...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FiTrash2 />
                                                                <span>Clean Up {expiredCount > 0 ? `(${expiredCount})` : ''}</span>
                                                            </>
                                                        )}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Result Step */
                                            <div className="text-center space-y-6 py-4">
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={shouldReduceMotion
                                                        ? { duration: 0.1 }
                                                        : { type: "spring", stiffness: 200, damping: 10 }
                                                    }
                                                    className="mx-auto w-16 h-16 rounded-full border border-indigo-200/70 dark:border-indigo-800/60 bg-indigo-50/70 dark:bg-indigo-900/30 flex items-center justify-center"
                                                >
                                                    {result.success ? (
                                                        <FiCheck className="text-indigo-600 dark:text-indigo-300 text-2xl" />
                                                    ) : (
                                                        <FiX className="text-red-600 dark:text-red-400 text-2xl" />
                                                    )}
                                                </motion.div>

                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                                        {result.success ? 'Cleanup Successful' : 'Cleanup Failed'}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        {result.message}
                                                    </p>
                                                </div>

                                                <motion.button
                                                    whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                                                    whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                                                    onClick={handleClose}
                                                    className="px-4 py-2 rounded-lg bg-linear-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-fuchsia-700 transition-all text-sm"
                                                >
                                                    Close
                                                </motion.button>
                                            </div>
                                        )}
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
