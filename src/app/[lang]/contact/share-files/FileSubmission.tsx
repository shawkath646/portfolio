"use client";

import { useState } from "react";
import { FileObject, useEasyDragDrop } from "easy-file-dragdrop";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiAlertCircle, FiLoader, FiClock, FiSend } from "react-icons/fi";
import { requestSharedFileUploadURL, saveSharedFile } from "@/actions/share/sharedFileManagement";
import { useToast } from "@/components/Toast";
import getErrorMessage from "@/utils/getErrorMessage";
import runWithConcurrency from "@/utils/runWithConcurrency";
import { formatFileSize } from "@/utils/string";

interface UploadProgress {
    fileId: string;
    fileName: string;
    status: 'pending' | 'generating-url' | 'uploading' | 'finalizing' | 'completed' | 'error';
    progress: number;
    speed: number;
    timeRemaining: number;
    error?: string;
    uploadURL?: string;
    controller?: AbortController;
}

const MAX_FILE_SIZE_MB = 500;
const CONCURRENCY_LIMIT = 3;

type FileSubmissionLanguagePack = {
    senderNameRequiredWarning: string;
    senderNamePlaceholder: string;
    globalNotePlaceholder: string;
    statusHeader: string;
    statusText: {
        pending: string;
        generatingUrl: string;
        uploading: string;
        finalizing: string;
        completed: string;
        error: string;
    };
    allUploadedTitle: string;
    uploadedCountSingle: string;
    uploadedCountPlural: string;
    adminPanelHint: string;
    uploadMoreButton: string;
    uploadingButton: string;
    uploadButtonSingle: string;
    uploadButtonPlural: string;
    clearAllButton: string;
};

export default function FileSubmission({ languagePack }: { languagePack: FileSubmissionLanguagePack }) {
    const { InputCanvas, PreviewPane } = useEasyDragDrop();
    const [files, setFiles] = useState<FileObject[]>([]);
    const [globalNote, setGlobalNote] = useState("");
    const [uploadProgress, setUploadProgress] = useState<Map<string, UploadProgress>>(new Map());
    const [allCompleted, setAllCompleted] = useState(false);
    const [senderName, setSenderName] = useState("");
    const toast = useToast();

    const formatTime = (seconds: number): string => {
        if (seconds < 60) return `${Math.round(seconds)}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}m ${remainingSeconds}s`;
    };

    const uploadFile = async (fileItem: FileObject): Promise<boolean> => {
        const file = fileItem.file;
        const fileId = fileItem.id;
        const controller = new AbortController();
        const fileName = fileItem.metadata.name;

        setUploadProgress(prev => new Map(prev).set(fileId, {
            fileId,
            fileName,
            status: 'generating-url',
            progress: 0,
            speed: 0,
            timeRemaining: 0,
            controller
        }));

        try {
            const urlResult = await requestSharedFileUploadURL({
                fileType: file.type,
                fileSize: file.size
            });

            if (!urlResult.fileId || !urlResult.uploadURL) {
                throw new Error(urlResult.message || 'Failed to generate upload URL');
            }

            setUploadProgress(prev => new Map(prev).set(fileId, {
                ...prev.get(fileId)!,
                status: 'uploading',
                uploadURL: urlResult.uploadURL,
            }));

            const startTime = Date.now();
            let lastLoaded = 0;
            let lastTime = startTime;

            let lastRenderTime = 0;
            const THROTTLE_MS = 150;

            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const currentTime = Date.now();
                    const timeDiff = (currentTime - lastTime) / 1000;
                    const bytesDiff = e.loaded - lastLoaded;
                    const speed = timeDiff > 0 ? bytesDiff / timeDiff : 0;
                    const bytesRemaining = e.total - e.loaded;
                    const timeRemaining = speed > 0 ? bytesRemaining / speed : 0;
                    const progress = (e.loaded / e.total) * 100;

                    lastLoaded = e.loaded;
                    lastTime = currentTime;

                    if (currentTime - lastRenderTime > THROTTLE_MS || progress === 100) {
                        setUploadProgress(prev => new Map(prev).set(fileId, {
                            ...prev.get(fileId)!,
                            progress,
                            speed,
                            timeRemaining
                        }));
                        lastRenderTime = currentTime;
                    }
                }
            });

            await new Promise<void>((resolve, reject) => {
                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve();
                    } else {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                });

                xhr.addEventListener('error', () => {
                    reject(new Error('Network error during upload'));
                });

                xhr.addEventListener('abort', () => {
                    reject(new Error('Upload cancelled'));
                });

                xhr.open('PUT', urlResult.uploadURL!);
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.setRequestHeader('x-goog-content-length-range', `0,${file.size}`);

                controller.signal.addEventListener('abort', () => {
                    xhr.abort();
                });

                xhr.send(file);
            });

            setUploadProgress(prev => new Map(prev).set(fileId, {
                ...prev.get(fileId)!,
                status: 'finalizing',
                progress: 100
            }));

            const metadataResult = await saveSharedFile({
                id: urlResult.fileId,
                fileName: file.name,
                fileType: file.type,
                size: file.size,
                note: globalNote.trim(),
                sender: senderName.trim(),
            });

            if (!metadataResult.success) {
                throw new Error(metadataResult.message || 'Failed to save metadata');
            }

            setUploadProgress(prev => new Map(prev).set(fileId, {
                ...prev.get(fileId)!,
                status: 'completed',
                progress: 100,
                speed: 0,
                timeRemaining: 0
            }));

            return true;

        } catch (error) {
            setUploadProgress(prev => new Map(prev).set(fileId, {
                ...prev.get(fileId)!,
                status: 'error',
                error: getErrorMessage(error) || 'Upload failed'
            }));
            return false;
        }
    };

    const handleUploadAll = async () => {
        if (files.length === 0) return;
        if (!senderName.trim()) {
            toast(languagePack.senderNameRequiredWarning, 'warning');
            return;
        }

        const tasks = files.map(file => () => uploadFile(file));
        const results = await runWithConcurrency(tasks, CONCURRENCY_LIMIT);

        const allSuccessful = results.every(result => result === true);
        setAllCompleted(allSuccessful);
    };

    const handleReset = () => {
        uploadProgress.forEach(progress => {
            if (progress.controller) {
                progress.controller.abort();
            }
        });

        setFiles([]);
        setGlobalNote("");
        setUploadProgress(new Map());
        setAllCompleted(false);
        setSenderName("");
    };

    const getStatusText = (status: UploadProgress['status']): string => {
        switch (status) {
            case 'pending': return languagePack.statusText.pending;
            case 'generating-url': return languagePack.statusText.generatingUrl;
            case 'uploading': return languagePack.statusText.uploading;
            case 'finalizing': return languagePack.statusText.finalizing;
            case 'completed': return languagePack.statusText.completed;
            case 'error': return languagePack.statusText.error;
            default: return '';
        }
    };

    const getStatusColor = (status: UploadProgress['status']): string => {
        switch (status) {
            case 'completed': return 'text-green-600 dark:text-green-400';
            case 'error': return 'text-red-600 dark:text-red-400';
            default: return 'text-blue-600 dark:text-blue-400';
        }
    };

    const isUploading = Array.from(uploadProgress.values()).some(
        p => ['generating-url', 'uploading', 'finalizing'].includes(p.status)
    );

    const hasStartedUpload = uploadProgress.size > 0;
    const uploadedCountText = files.length === 1
        ? languagePack.uploadedCountSingle
        : languagePack.uploadedCountPlural.replace("{count}", String(files.length));

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, layout: { duration: 0.4 } }}
            className="w-full"
        >
            <AnimatePresence mode="wait">
                {allCompleted ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center py-12"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <FiCheck className="text-4xl text-green-600 dark:text-green-400" />
                        </motion.div>

                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            {languagePack.allUploadedTitle}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                            {uploadedCountText}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            {languagePack.adminPanelHint}
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleReset}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            {languagePack.uploadMoreButton}
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <InputCanvas
                            name="file-upload"
                            multiple
                            value={files}
                            onChange={setFiles}
                            maxFileSize={MAX_FILE_SIZE_MB}
                            maxFiles={10}
                        />

                        <div className="mt-4">
                            <PreviewPane showPreview />
                        </div>

                        {/* Settings and Metadata */}
                        {files.length > 0 && !hasStartedUpload && (
                            <div className="mt-6 space-y-5 mb-6">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="text"
                                        value={senderName}
                                        onChange={(e) => setSenderName(e.target.value)}
                                        placeholder={languagePack.senderNamePlaceholder}
                                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    <motion.div
                                        initial={false}
                                        animate={{ width: "100%" }}
                                        className="sm:flex-1"
                                    >
                                        <AnimatePresence initial={false}>
                                            <motion.div
                                                key="global-note-dropdown"
                                                initial={{ height: 0, opacity: 0, y: -8 }}
                                                animate={{ height: "auto", opacity: 1, y: 0 }}
                                                exit={{ height: 0, opacity: 0, y: -8 }}
                                                transition={{ duration: 0.24, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <input
                                                    type="text"
                                                    value={globalNote}
                                                    onChange={(e) => setGlobalNote(e.target.value)}
                                                    placeholder={languagePack.globalNotePlaceholder}
                                                    className="w-full px-3 py-2 pr-9 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                            </motion.div>
                                        </AnimatePresence>
                                    </motion.div>
                                </div>
                            </div>
                        )}

                        {/* Upload Progress Display */}
                        {hasStartedUpload && (
                            <div className="mt-6 mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{languagePack.statusHeader}</h4>
                                {Array.from(uploadProgress.values()).map(progress => (
                                    <div key={progress.fileId} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-xs">
                                            <div className="flex items-center gap-2 truncate">
                                                {progress.status === 'error' && <FiAlertCircle className="text-red-500 shrink-0" />}
                                                {progress.status === 'completed' && <FiCheck className="text-green-500 shrink-0" />}
                                                <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
                                                    {progress.fileName}
                                                </span>
                                            </div>
                                            <span className={`shrink-0 flex items-center gap-2 ${getStatusColor(progress.status)}`}>
                                                {progress.status === 'uploading' && (
                                                    <span className="text-gray-500 flex items-center gap-1">
                                                        {formatFileSize(progress.speed)}/s <FiClock className="ml-1" /> {formatTime(progress.timeRemaining)}
                                                    </span>
                                                )}
                                                {getStatusText(progress.status)}
                                            </span>
                                        </div>

                                        {progress.status !== 'error' && (
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progress.progress}%` }}
                                                        transition={{ duration: 0.3 }}
                                                        className={`h-full rounded-full ${progress.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-medium text-gray-500 w-8 text-right">
                                                    {Math.round(progress.progress)}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        {files.length > 0 && (
                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={!isUploading ? { scale: 1.02 } : {}}
                                    whileTap={!isUploading ? { scale: 0.98 } : {}}
                                    onClick={handleUploadAll}
                                    disabled={isUploading || !senderName.trim()}
                                    className="flex-1 px-4 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <FiLoader className="animate-spin text-base" />
                                            <span>{languagePack.uploadingButton}</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiSend className="text-base" />
                                            <span>
                                                {files.length === 1
                                                    ? languagePack.uploadButtonSingle
                                                    : languagePack.uploadButtonPlural.replace("{count}", String(files.length))}
                                            </span>
                                        </>
                                    )}
                                </motion.button>

                                {!isUploading && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleReset}
                                        className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium text-sm transition-colors"
                                    >
                                        {languagePack.clearAllButton}
                                    </motion.button>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}