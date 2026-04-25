"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiFile, FiClock, FiFileText, FiInbox } from "react-icons/fi";
import { SharedFileType } from "@/types/share.types";
import { formatRelativeTime } from "@/utils/dateTime";
import { formatFileSize } from "@/utils/string";

type UserUploadsLanguagePack = {
    title: string;
    uploadedCountSingle: string;
    uploadedCountPlural: string;
    emptyTitle: string;
    emptyDescription: string;
};

export default function UserUploadsList({ sharedFiles, languagePack }: { sharedFiles: SharedFileType[]; languagePack: UserUploadsLanguagePack }) {
    const uploadedCountText = sharedFiles.length === 1
        ? languagePack.uploadedCountSingle
        : languagePack.uploadedCountPlural.replace("{count}", String(sharedFiles.length));

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-[0_18px_55px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/45 dark:shadow-[0_18px_55px_rgba(2,6,23,0.55)]"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
            />

            <div className="relative border-b border-slate-200/70 p-6 dark:border-white/10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {languagePack.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {uploadedCountText}
                </p>
            </div>

            <div className="relative divide-y divide-slate-200/70 dark:divide-white/10">
                {sharedFiles.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center gap-3 p-8 text-center"
                    >
                        <div className="rounded-full border border-slate-200/80 bg-white/70 p-3 dark:border-white/15 dark:bg-white/5">
                            <FiInbox className="text-2xl text-slate-500 dark:text-slate-400" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {languagePack.emptyTitle}
                        </p>
                        <p className="max-w-xs text-xs text-slate-500 dark:text-slate-400">
                            {languagePack.emptyDescription}
                        </p>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        {sharedFiles.map((file, index) => (
                            <motion.div
                                key={file.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 transition-colors hover:bg-white/55 dark:hover:bg-white/5"
                            >
                                <div className="flex items-start gap-4">
                                    {/* File Icon */}
                                    <div className="shrink-0 rounded-lg border border-sky-200/70 bg-sky-100/70 p-3 shadow-sm dark:border-sky-400/20 dark:bg-sky-500/15">
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
                )}
            </div>
        </motion.section>
    );
}
