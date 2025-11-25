"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiFile, FiX, FiCheck, FiAlertCircle, FiLoader, FiClock, FiSend } from "react-icons/fi";
import { generateSharedFileUploadURL } from "@/actions/storage/generateSharedFileUploadURL";
import { saveSharedFileMetadata } from "@/actions/storage/saveSharedFileMetadata";

interface FileWithMetadata {
    file: File;
    id: string;
    note: string;
}

interface UploadProgress {
    fileId: string;
    fileName: string;
    status: 'pending' | 'generating-url' | 'uploading' | 'finalizing' | 'completed' | 'error';
    progress: number;
    speed: number;
    timeRemaining: number;
    error?: string;
    uploadURL?: string;
    storagePath?: string;
    controller?: AbortController;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

interface FileSubmissionProps {
    onUploadComplete?: () => void;
}

export default function FileSubmission({ onUploadComplete }: FileSubmissionProps) {
    const [files, setFiles] = useState<FileWithMetadata[]>([]);
    const [uploadProgress, setUploadProgress] = useState<Map<string, UploadProgress>>(new Map());
    const [isDragging, setIsDragging] = useState(false);
    const [allCompleted, setAllCompleted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const formatSpeed = (bytesPerSecond: number): string => {
        return formatFileSize(bytesPerSecond) + '/s';
    };

    const formatTime = (seconds: number): string => {
        if (seconds < 60) return `${Math.round(seconds)}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}m ${remainingSeconds}s`;
    };

    const generateFileId = () => {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    const handleFileSelect = useCallback((selectedFiles: FileList | File[]) => {
        const fileArray = Array.from(selectedFiles);
        const validFiles: FileWithMetadata[] = [];

        for (const file of fileArray) {
            if (file.size > MAX_FILE_SIZE) {
                alert(`${file.name} exceeds 100MB limit`);
                continue;
            }
            validFiles.push({
                file,
                id: generateFileId(),
                note: ''
            });
        }

        setFiles(prev => [...prev, ...validFiles]);
        setAllCompleted(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files);
        }
    }, [handleFileSelect]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files);
        }
    }, [handleFileSelect]);

    const removeFile = useCallback((fileId: string) => {
        // Cancel upload if in progress
        const progress = uploadProgress.get(fileId);
        if (progress?.controller) {
            progress.controller.abort();
        }

        setFiles(prev => prev.filter(f => f.id !== fileId));
        setUploadProgress(prev => {
            const newMap = new Map(prev);
            newMap.delete(fileId);
            return newMap;
        });
    }, [uploadProgress]);

    const updateNote = useCallback((fileId: string, note: string) => {
        setFiles(prev => prev.map(f => f.id === fileId ? { ...f, note } : f));
    }, []);

    const uploadFile = async (fileWithMetadata: FileWithMetadata): Promise<boolean> => {
        const { file, id: fileId, note } = fileWithMetadata;
        const controller = new AbortController();

        // Initialize progress
        setUploadProgress(prev => new Map(prev).set(fileId, {
            fileId,
            fileName: file.name,
            status: 'generating-url',
            progress: 0,
            speed: 0,
            timeRemaining: 0,
            controller
        }));

        try {
            // Step 1: Generate signed upload URL
            const urlResult = await generateSharedFileUploadURL({
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size
            });

            if (!urlResult.success || !urlResult.uploadURL || !urlResult.storagePath) {
                throw new Error(urlResult.error || 'Failed to generate upload URL');
            }

            // Update status to uploading
            setUploadProgress(prev => new Map(prev).set(fileId, {
                ...prev.get(fileId)!,
                status: 'uploading',
                uploadURL: urlResult.uploadURL,
                storagePath: urlResult.storagePath
            }));

            // Step 2: Upload file directly to GCS using signed URL
            const startTime = Date.now();
            let lastLoaded = 0;
            let lastTime = startTime;

            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const currentTime = Date.now();
                    const timeDiff = (currentTime - lastTime) / 1000;
                    const bytesDiff = e.loaded - lastLoaded;
                    const speed = timeDiff > 0 ? bytesDiff / timeDiff : 0;
                    const bytesRemaining = e.total - e.loaded;
                    const timeRemaining = speed > 0 ? bytesRemaining / speed : 0;
                    const progress = (e.loaded / e.total) * 100;

                    setUploadProgress(prev => new Map(prev).set(fileId, {
                        ...prev.get(fileId)!,
                        progress,
                        speed,
                        timeRemaining
                    }));

                    lastLoaded = e.loaded;
                    lastTime = currentTime;
                }
            });

            // Handle upload completion
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
                xhr.send(file);

                // Store XHR in controller for cancellation
                controller.signal.addEventListener('abort', () => {
                    xhr.abort();
                });
            });

            // Step 3: Finalize - save metadata to Firestore
            setUploadProgress(prev => new Map(prev).set(fileId, {
                ...prev.get(fileId)!,
                status: 'finalizing',
                progress: 100
            }));

            const metadataResult = await saveSharedFileMetadata({
                storagePath: urlResult.storagePath,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                lastModified: file.lastModified,
                userNote: note.trim() || undefined
            });

            if (!metadataResult.success) {
                throw new Error(metadataResult.error || 'Failed to save metadata');
            }

            // Step 4: Completed
            setUploadProgress(prev => new Map(prev).set(fileId, {
                ...prev.get(fileId)!,
                status: 'completed',
                progress: 100,
                speed: 0,
                timeRemaining: 0
            }));

            return true;

        } catch (error: any) {
            setUploadProgress(prev => new Map(prev).set(fileId, {
                ...prev.get(fileId)!,
                status: 'error',
                error: error.message || 'Upload failed'
            }));
            return false;
        }
    };

    const handleUploadAll = async () => {
        if (files.length === 0) return;

        // Upload all files in parallel and track results
        const results = await Promise.all(files.map(file => uploadFile(file)));

        // Check if all completed successfully by checking the results
        const allSuccessful = results.every(result => result === true);
        setAllCompleted(allSuccessful);

        // Notify parent component to refresh uploads list
        if (allSuccessful && onUploadComplete) {
            onUploadComplete();
        }
    };

    const handleReset = () => {
        // Cancel all ongoing uploads
        uploadProgress.forEach(progress => {
            if (progress.controller) {
                progress.controller.abort();
            }
        });

        setFiles([]);
        setUploadProgress(new Map());
        setAllCompleted(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const getStatusText = (status: UploadProgress['status']): string => {
        switch (status) {
            case 'pending':
                return 'Pending...';
            case 'generating-url':
                return 'Generating upload URL...';
            case 'uploading':
                return 'Uploading...';
            case 'finalizing':
                return 'Finalizing...';
            case 'completed':
                return 'Upload completed';
            case 'error':
                return 'Upload failed';
            default:
                return '';
        }
    };

    const getStatusColor = (status: UploadProgress['status']): string => {
        switch (status) {
            case 'completed':
                return 'text-green-600 dark:text-green-400';
            case 'error':
                return 'text-red-600 dark:text-red-400';
            default:
                return 'text-blue-600 dark:text-blue-400';
        }
    };

    const isUploading = Array.from(uploadProgress.values()).some(
        p => ['generating-url', 'uploading', 'finalizing'].includes(p.status)
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
            <div className="p-6 sm:p-8">
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
                                All Files Uploaded!
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                                {files.length} {files.length === 1 ? 'file' : 'files'} successfully uploaded
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Files are now accessible from the admin panel
                            </p>
                            
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleReset}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                            >
                                Upload More Files
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* File Drop Zone */}
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => !isUploading && fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all mb-6 ${
                                    isDragging
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                                } ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    onChange={handleFileInputChange}
                                    disabled={isUploading}
                                    className="hidden"
                                    aria-label="File upload input"
                                />

                                <FiUpload className="text-5xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Drop files here or click to browse
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Upload multiple files • Maximum 100MB per file
                                </p>
                            </div>

                            {/* Files List */}
                            {files.length > 0 && (
                                <div className="space-y-4 mb-6">
                                    {files.map((fileWithMetadata) => {
                                        const progress = uploadProgress.get(fileWithMetadata.id);
                                        const isProcessing = progress && ['generating-url', 'uploading', 'finalizing'].includes(progress.status);

                                        return (
                                            <motion.div
                                                key={fileWithMetadata.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                                                            <FiFile className="text-xl text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                                                                {fileWithMetadata.file.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {formatFileSize(fileWithMetadata.file.size)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {!isProcessing && progress?.status !== 'completed' && (
                                                        <button
                                                            onClick={() => removeFile(fileWithMetadata.id)}
                                                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                                                            aria-label="Remove file"
                                                        >
                                                            <FiX className="text-xl text-gray-600 dark:text-gray-400" />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Note Input */}
                                                {!progress && (
                                                    <input
                                                        type="text"
                                                        value={fileWithMetadata.note}
                                                        onChange={(e) => updateNote(fileWithMetadata.id, e.target.value)}
                                                        placeholder="Add a note (optional)"
                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    />
                                                )}

                                                {/* Upload Progress */}
                                                {progress && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className={`font-medium ${getStatusColor(progress.status)}`}>
                                                                {getStatusText(progress.status)}
                                                            </span>
                                                            {progress.status === 'uploading' && (
                                                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                                                    <span>{formatSpeed(progress.speed)}</span>
                                                                    <span className="flex items-center gap-1">
                                                                        <FiClock className="text-xs" />
                                                                        {formatTime(progress.timeRemaining)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {progress.status !== 'error' && (
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${progress.progress}%` }}
                                                                        transition={{ duration: 0.3 }}
                                                                        className={`h-full rounded-full ${
                                                                            progress.status === 'completed'
                                                                                ? 'bg-green-500'
                                                                                : 'bg-blue-500'
                                                                        }`}
                                                                    />
                                                                </div>
                                                                <span className="text-xs text-gray-600 dark:text-gray-400 w-12 text-right">
                                                                    {Math.round(progress.progress)}%
                                                                </span>
                                                            </div>
                                                        )}

                                                        {progress.error && (
                                                            <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                                                                <FiAlertCircle className="flex-shrink-0 mt-0.5" />
                                                                <span>{progress.error}</span>
                                                            </div>
                                                        )}

                                                        {progress.status === 'completed' && (
                                                            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                                                <FiCheck className="flex-shrink-0" />
                                                                <span>File uploaded successfully</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Upload Button */}
                            {files.length > 0 && (
                                <div className="flex gap-3">
                                    <motion.button
                                        whileHover={!isUploading ? { scale: 1.02 } : {}}
                                        whileTap={!isUploading ? { scale: 0.98 } : {}}
                                        onClick={handleUploadAll}
                                        disabled={isUploading}
                                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                    >
                                        {isUploading ? (
                                            <>
                                                <FiLoader className="animate-spin text-base" />
                                                <span>Uploading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiSend className="text-base" />
                                                <span>Upload {files.length} {files.length === 1 ? 'File' : 'Files'}</span>
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
                                            Clear All
                                        </motion.button>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
