"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiFile, FiClock, FiFileText } from "react-icons/fi";
import { SharedFileType } from "@/types/share.types";
import { formatRelativeTime } from "@/utils/dateTime";
import { formatFileSize } from "@/utils/string";


export default function UserUploadsList({ sharedFiles }: { sharedFiles: SharedFileType[] }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mt-10"
        >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Your Uploads
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {sharedFiles.length} {sharedFiles.length === 1 ? 'file' : 'files'} uploaded
                </p>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                    {sharedFiles.map((file, index) => (
                        <motion.div
                            key={file.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                {/* File Icon */}
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                                    <FiFile className="text-xl text-blue-600 dark:text-blue-400" />
                                </div>

                                {/* File Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                        {file.fileName}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        <span>{formatFileSize(file.size)}</span>
                                        <time dateTime={file.timestamp.toISOString()} className="flex items-center gap-1" suppressHydrationWarning>
                                            <FiClock className="text-xs" />
                                            {formatRelativeTime(file.timestamp)}
                                        </time>
                                    </div>

                                    {file.note && (
                                        <div className="mt-2 flex items-start gap-2 text-sm">
                                            <FiFileText className="text-gray-400 shrink-0 mt-0.5" />
                                            <p className="text-gray-600 dark:text-gray-400 italic">
                                                {file.note}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.section>
    );
}
