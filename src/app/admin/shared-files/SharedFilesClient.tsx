"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFile, FiDownload, FiTrash2, FiClock, FiFileText, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { SharedFileUpload } from "@/actions/storage/getAllSharedFiles";
import { deleteSharedFile } from "@/actions/storage/deleteSharedFile";
import Link from "next/link";

interface SharedFilesClientProps {
    initialFiles: SharedFileUpload[];
    error?: string;
}

export default function SharedFilesClient({ initialFiles, error }: SharedFilesClientProps) {
    const [files, setFiles] = useState(initialFiles);
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            const minutes = Math.floor(diffInHours * 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            const hours = Math.floor(diffInHours);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
            });
        }
    };

    const handleDelete = (fileId: string, storagePath: string, fileName: string) => {
        if (!confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)) {
            return;
        }

        setDeletingId(fileId);
        startTransition(async () => {
            const result = await deleteSharedFile(fileId, storagePath);
            
            if (result.success) {
                setFiles(prev => prev.filter(f => f.id !== fileId));
            } else {
                alert(`Failed to delete file: ${result.error}`);
            }
            setDeletingId(null);
        });
    };

    return (
        <>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-colors"
                >
                    <FiArrowLeft className="text-lg" />
                    <span className="font-medium">Back to Dashboard</span>
                </Link>

                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Shared Files
                    </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    Manage files uploaded by users through the public file sharing system
                </p>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Files</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{files.length}</p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <FiFile className="text-2xl text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Size</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {formatFileSize(files.reduce((sum, f) => sum + f.fileSize, 0))}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <FiDownload className="text-2xl text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reviewed</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {files.filter(f => f.reviewed).length}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <FiFileText className="text-2xl text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Error State */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8"
                >
                    <div className="flex items-start gap-3">
                        <FiAlertCircle className="text-2xl text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-1">
                                Error Loading Files
                            </h3>
                            <p className="text-red-700 dark:text-red-300">{error}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Empty State */}
            {!error && files.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center"
                >
                    <FiFile className="text-6xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No Files Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Files uploaded through the public sharing page will appear here
                    </p>
                </motion.div>
            )}

            {/* Files List */}
            {!error && files.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        <AnimatePresence mode="popLayout">
                            {files.map((file, index) => (
                                <motion.div
                                    key={file.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20, height: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                    className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        {/* File Icon */}
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                                            <FiFile className="text-2xl text-blue-600 dark:text-blue-400" />
                                        </div>

                                        {/* File Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                                                {file.fileName}
                                            </h3>
                                            
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                <span>{formatFileSize(file.fileSize)}</span>
                                                <span className="flex items-center gap-1">
                                                    <FiClock className="text-xs" />
                                                    {formatDate(file.uploadedAt)}
                                                </span>
                                            </div>

                                            {file.userNote && (
                                                <div className="mt-2 flex items-start gap-2 text-sm">
                                                    <FiFileText className="text-gray-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-gray-600 dark:text-gray-400 italic">
                                                        {file.userNote}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <a
                                                href={file.downloadURL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                                aria-label={`Download ${file.fileName}`}
                                            >
                                                <FiDownload className="text-lg" />
                                                <span className="font-medium">Download</span>
                                            </a>

                                            <button
                                                onClick={() => handleDelete(file.id, file.storagePath, file.fileName)}
                                                disabled={isPending && deletingId === file.id}
                                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                                                aria-label={`Delete ${file.fileName}`}
                                            >
                                                {isPending && deletingId === file.id ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        <span className="font-medium">Deleting...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiTrash2 className="text-lg" />
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
