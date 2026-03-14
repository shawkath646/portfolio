"use client";
import { useState, useRef, useCallback, useId, type ReactNode } from "react";
import { FiUpload } from "react-icons/fi";

interface FileDragDropProps {
    onFilesSelected?: (files: File[]) => void;
    onFileSelected?: (file: File) => void;
    multiple?: boolean;
    accept?: string;
    disabled?: boolean;
    className?: string;
    idleClassName?: string;
    draggingClassName?: string;
    title?: string;
    description?: string;
    inputAriaLabel?: string;
    children?: ReactNode | ((state: { isDragging: boolean }) => ReactNode);
}

export default function FileDragDrop({
    onFilesSelected,
    onFileSelected,
    multiple = false,
    accept,
    disabled = false,
    className,
    idleClassName = 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-900/50',
    draggingClassName = 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
    title,
    description,
    inputAriaLabel = 'File upload input',
    children,
}: FileDragDropProps) {

    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputId = useId();

    const emitSelection = useCallback((fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) {
            return;
        }

        const selectedFiles = Array.from(fileList);
        if (multiple) {
            onFilesSelected?.(selectedFiles);
            return;
        }

        const firstFile = selectedFiles[0];
        onFileSelected?.(firstFile);
        onFilesSelected?.([firstFile]);
    }, [multiple, onFileSelected, onFilesSelected]);

    const handleOpenFileDialog = useCallback(() => {
        if (!disabled) {
            fileInputRef.current?.click();
        }
    }, [disabled]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) {
            return;
        }

        if (e.dataTransfer.files.length > 0) {
            emitSelection(e.dataTransfer.files);
        }
    }, [disabled, emitSelection]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        emitSelection(e.target.files);
        // Allow selecting the exact same file(s) again after processing.
        e.currentTarget.value = "";
    }, [emitSelection]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) {
            return;
        }

        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpenFileDialog();
        }
    }, [disabled, handleOpenFileDialog]);

    const content = typeof children === "function" ? children({ isDragging }) : children;

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleOpenFileDialog}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
            className={`relative group border-2 border-dashed rounded-xl p-8 text-center transition-all mb-6 ${isDragging
                ? draggingClassName
                : idleClassName
                } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className ?? ''}`}
        >
            <input
                id={inputId}
                ref={fileInputRef}
                type="file"
                multiple={multiple}
                accept={accept}
                onChange={handleFileInputChange}
                disabled={disabled}
                className="hidden"
                aria-label={inputAriaLabel}
            />

            {content ? (
                <div className="pointer-events-none">
                    {content}
                </div>
            ) : (
                <>
                    <FiUpload className="text-5xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {title ?? (multiple ? 'Drop files here or click to browse' : 'Drop a file here or click to browse')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {description ?? (multiple ? 'Upload multiple files' : 'Upload a single file')}
                    </p>
                </>
            )}
        </div>
    );
}