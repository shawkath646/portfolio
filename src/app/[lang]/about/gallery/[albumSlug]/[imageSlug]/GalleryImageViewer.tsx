"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import blurImagePlaceholder from "@/data/blurImagePlaceholder";
import { GalleryImageItemType } from "@/types/gallery.types";
import { formatDateTime } from "@/utils/dateTime";
import { formatFileSize } from "@/utils/string";

interface GalleryImageViewerProps {
    images: GalleryImageItemType[];
    altText: string;
}

export default function GalleryImageViewer({
    images,
    altText,
}: GalleryImageViewerProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (images.length <= 1) return;
            
            if (e.key === "ArrowRight") {
                setActiveIndex((prev) => (prev + 1) % images.length);
            } else if (e.key === "ArrowLeft") {
                setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
            }
        },
        [images.length]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    const activeImage = images[activeIndex] ?? images[0];
    const activeSource = activeImage?.src ?? blurImagePlaceholder;
    const activeWidth = activeImage?.width ?? 1;
    const activeHeight = activeImage?.height ?? 1;

    return (
        <div className="space-y-5 p-3 sm:p-4">
            <div className="relative flex justify-center rounded-xl overflow-hidden">
                <Image
                    src={activeSource}
                    alt={altText}
                    width={activeWidth}
                    height={activeHeight}
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="w-full h-auto object-contain max-h-[85vh] p-2 sm:p-4 transition-opacity duration-300"
                    placeholder="blur"
                    blurDataURL={blurImagePlaceholder}
                    priority
                />
            </div>

            {/* NEW: Comprehensive Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/80 px-4 py-3 text-xs shadow-sm">
                <div className="flex flex-col space-y-1">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Dimensions</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                        {activeWidth.toLocaleString()} x {activeHeight.toLocaleString()} px
                    </span>
                </div>
                
                <div className="flex flex-col space-y-1">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">File Size</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                        {formatFileSize(activeImage?.size)}
                    </span>
                </div>

                <div className="flex flex-col space-y-1 col-span-2 sm:col-span-2">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Date</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                        {formatDateTime(activeImage.timestamp)}
                    </span>
                </div>
            </div>

            {images.length > 1 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Image Set ({images.length})
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {images.map((imageItem, index) => (
                            <button
                                key={imageItem.id}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                className={`relative aspect-square rounded-md overflow-hidden border transition-all duration-200 ${
                                    activeIndex === index
                                        ? "border-blue-500 ring-1 ring-blue-500 opacity-100"
                                        : "border-gray-300 dark:border-gray-700 opacity-60 hover:opacity-100"
                                }`}
                                aria-label={`Show image ${index + 1}`}
                            >
                                <Image
                                    src={imageItem.src}
                                    alt={`${altText} thumbnail ${index + 1}`}
                                    height={imageItem.height}
                                    width={imageItem.width}
                                    sizes="96px"
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}