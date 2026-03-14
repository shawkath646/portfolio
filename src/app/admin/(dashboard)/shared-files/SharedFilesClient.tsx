"use client";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFile, FiDownload, FiTrash2, FiClock, FiFileText } from "react-icons/fi";
import { getSharedFileDownloadURL } from "@/actions/share/getSharedFiles";
import { deleteSharedFile } from "@/actions/share/sharedFileManagement";
import { SharedFileType } from "@/types/share.types";
import { formatRelativeTime } from "@/utils/dateTime";
import { formatFileSize } from "@/utils/string";
import { useToast } from "@/components/Toast";


export default function SharedFilesClient({ sharedFiles }: { sharedFiles: SharedFileType[] }) {
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const toast = useToast();

    const handleDelete = (fileId: string, fileName: string) => {
        if (!confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)) {
            return;
        }

        setDeletingId(fileId);
        startTransition(async () => {
            const result = await deleteSharedFile(fileId);

            toast(result.message, result.success ? 'success' : 'error');
            setDeletingId(null);
        });
    };

    const handleFileDownload = async (fileId: string) => {
        if (!!deletingId) return;

        const response = await getSharedFileDownloadURL(fileId);

        if (!response.success || !response.signedUrl) {
            toast(response.message, 'error');
        }

        window.open(response.signedUrl, '_blank', 'noopener,noreferrer');
    }

    return (
        <>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
            >
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    <span className="bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Shared Files
                    </span>
                </h1>
                <p className="text-base text-gray-600 dark:text-gray-300">
                    Manage files uploaded by users through the public file sharing system
                </p>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
            >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Files</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{sharedFiles.length}</p>
                        </div>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <FiFile className="text-xl text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Size</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatFileSize(sharedFiles.reduce((sum, f) => sum + f.size, 0))}
                            </p>
                        </div>
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <FiDownload className="text-xl text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Reviewed</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {sharedFiles.filter(f => f.reviewed).length}
                            </p>
                        </div>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <FiFileText className="text-xl text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Empty State */}
            {sharedFiles.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center"
                >
                    <FiFile className="text-5xl text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Files Yet
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Files uploaded through the public sharing page will appear here
                    </p>
                </motion.div>
            )}

            {/* Files List */}
            {sharedFiles.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        <AnimatePresence mode="popLayout">
                            {sharedFiles.map((file, index) => (
                                <motion.div
                                    key={file.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20, height: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                    className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                        {/* File Icon */}
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                                            <FiFile className="text-xl text-blue-600 dark:text-blue-400" />
                                        </div>

                                        {/* File Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                    {file.fileName}
                                                </h3>

                                                {!file.reviewed && (
                                                    <span className="shrink-0 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border border-green-200 dark:border-green-500/30">
                                                        New
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                                <span>{formatFileSize(file.size)}</span>
                                                <span className="flex items-center gap-1">
                                                    <FiClock className="text-xs" />
                                                    {formatRelativeTime(file.timestamp)}
                                                </span>
                                            </div>

                                            {file.note && (
                                                <div className="mt-2 flex items-start gap-2 text-xs">
                                                    <FiFileText className="text-gray-400 shrink-0 mt-0.5" />
                                                    <p className="text-gray-600 dark:text-gray-400 italic">
                                                        {file.note}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <button
                                                role="button"
                                                disabled={!!deletingId}
                                                onClick={() => handleFileDownload(file.id)}
                                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                                                aria-label={`Download ${file.fileName}`}
                                            >
                                                <FiDownload className="text-base" />
                                                <span className="font-medium">Download</span>
                                            </button>

                                            <button
                                                onClick={() => handleDelete(file.id, file.fileName)}
                                                disabled={isPending && deletingId === file.id}
                                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed text-sm"
                                                aria-label={`Delete ${file.fileName}`}
                                            >
                                                {isPending && deletingId === file.id ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        <span className="font-medium">Deleting...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiTrash2 className="text-base" />
                                                        <span className="font-medium">Delete</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </>
    );
}
