"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFile, FiDownload, FiClock, FiFileText } from "react-icons/fi";
import { getSharedFileUploads } from "@/actions/storage/getSharedFileUploads";

interface SharedFileUpload {
    id: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    downloadURL: string;
    uploadedAt: string;
    userNote?: string;
}

export default function UserUploadsList() {
    const [uploads, setUploads] = useState<SharedFileUpload[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("[UserUploadsList] Component mounted, loading uploads...");
        loadUploads();
    }, []);

    const loadUploads = async () => {
        console.log("[UserUploadsList] loadUploads called");
        setLoading(true);
        setError(null);
        
        const result = await getSharedFileUploads();
        console.log("[UserUploadsList] getSharedFileUploads result:", result);
        
        if (result.success && result.uploads) {
            console.log("[UserUploadsList] Setting", result.uploads.length, "uploads");
            setUploads(result.uploads);
        } else {
            console.log("[UserUploadsList] Error:", result.error);
            setError(result.error || "Failed to load uploads");
        }
        
        setLoading(false);
    };

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

    if (loading) {
        return (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent" />
                    <span>Loading your uploads...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <p className="text-red-800 dark:text-red-200 text-center">{error}</p>
            </div>
        );
    }

    if (uploads.length === 0) {
        return null; // Don't show anything if no uploads
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Your Uploads
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {uploads.length} {uploads.length === 1 ? 'file' : 'files'} uploaded
                </p>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                    {uploads.map((upload, index) => (
                        <motion.div
                            key={upload.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                {/* File Icon */}
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                                    <FiFile className="text-xl text-blue-600 dark:text-blue-400" />
                                </div>

                                {/* File Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                        {upload.fileName}
                                    </h3>
                                    
                                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        <span>{formatFileSize(upload.fileSize)}</span>
                                        <span className="flex items-center gap-1">
                                            <FiClock className="text-xs" />
                                            {formatDate(upload.uploadedAt)}
                                        </span>
                                    </div>

                                    {upload.userNote && (
                                        <div className="mt-2 flex items-start gap-2 text-sm">
                                            <FiFileText className="text-gray-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-gray-600 dark:text-gray-400 italic">
                                                {upload.userNote}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Download Button */}
                                <a
                                    href={upload.downloadURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-shrink-0 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    aria-label={`Download ${upload.fileName}`}
                                >
                                    <FiDownload className="text-lg" />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
