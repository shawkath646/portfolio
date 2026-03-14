"use client";
import Image from "next/image";
import { FaFolder } from "react-icons/fa";
import blurImagePlaceholder from "@/data/blurImagePlaceholder";
import { GalleryImageType } from "@/types/gallery.types";

interface AlbumPreviewProps {
    previewImages: GalleryImageType[];
}

export default function AlbumPreview({ previewImages }: AlbumPreviewProps) {

    if (previewImages.length === 0) {
        return (
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <FaFolder className="text-3xl text-gray-400 dark:text-gray-600" />
            </div>
        );
    }
    
    const thumbSize = 400;

    return (
        <div className="aspect-square relative overflow-hidden">
            {/* --- 1 IMAGE --- */}
            {previewImages.length === 1 && (
                <div className="absolute inset-0">
                    <Image
                        src={previewImages[0].src}
                        alt={previewImages[0].alt || previewImages[0].title}
                        width={thumbSize}
                        height={thumbSize}
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                        className="w-full h-full object-cover"
                        placeholder="blur"
                        blurDataURL={blurImagePlaceholder}
                    />
                </div>
            )}

            {/* --- 2 IMAGES --- */}
            {previewImages.length === 2 && (
                <>
                    <div className="absolute inset-0 w-1/2">
                        <Image
                            src={previewImages[0].src}
                            alt={previewImages[0].alt || previewImages[0].title}
                            width={thumbSize}
                            height={thumbSize}
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="w-full h-full object-cover"
                            placeholder="blur"
                            blurDataURL={blurImagePlaceholder}
                        />
                    </div>
                    <div className="absolute inset-0 left-1/2">
                        <Image
                            src={previewImages[1].src}
                            alt={previewImages[1].alt || previewImages[1].title}
                            width={thumbSize}
                            height={thumbSize}
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="w-full h-full object-cover"
                            placeholder="blur"
                            blurDataURL={blurImagePlaceholder}
                        />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent w-px left-1/2"></div>
                </>
            )}

            {/* --- 3 IMAGES --- */}
            {previewImages.length === 3 && (
                <>
                    <div className="absolute inset-0 w-1/2">
                        <Image
                            src={previewImages[0].src}
                            alt={previewImages[0].alt || previewImages[0].title}
                            width={thumbSize}
                            height={thumbSize}
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="w-full h-full object-cover"
                            placeholder="blur"
                            blurDataURL={blurImagePlaceholder}
                        />
                    </div>
                    <div className="absolute top-0 right-0 w-1/2 h-1/2">
                        <Image
                            src={previewImages[1].src}
                            alt={previewImages[1].alt || previewImages[1].title}
                            width={thumbSize}
                            height={thumbSize}
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="w-full h-full object-cover"
                            placeholder="blur"
                            blurDataURL={blurImagePlaceholder}
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2">
                        <Image
                            src={previewImages[2].src}
                            alt={previewImages[2].alt || previewImages[2].title}
                            width={thumbSize}
                            height={thumbSize}
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="w-full h-full object-cover"
                            placeholder="blur"
                            blurDataURL={blurImagePlaceholder}
                        />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent w-px left-1/2"></div>
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/20 to-transparent h-px top-1/2 left-1/2"></div>
                </>
            )}

            {/* --- 4+ IMAGES --- */}
            {previewImages.length >= 4 && (
                <>
                    <div className="absolute top-0 left-0 w-1/2 h-1/2">
                        <Image
                            src={previewImages[0].src}
                            alt={previewImages[0].alt || previewImages[0].title}
                            width={thumbSize}
                            height={thumbSize}
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="w-full h-full object-cover"
                            placeholder="blur"
                            blurDataURL={blurImagePlaceholder}
                        />
                    </div>
                    <div className="absolute top-0 right-0 w-1/2 h-1/2">
                        <Image
                            src={previewImages[1].src}
                            alt={previewImages[1].alt || previewImages[1].title}
                            width={thumbSize}
                            height={thumbSize}
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="w-full h-full object-cover"
                            placeholder="blur"
                            blurDataURL={blurImagePlaceholder}
                        />
                    </div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2">
                        <Image
                            src={previewImages[2].src}
                            alt={previewImages[2].alt || previewImages[2].title}
                            width={thumbSize}
                            height={thumbSize}
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="w-full h-full object-cover"
                            placeholder="blur"
                            blurDataURL={blurImagePlaceholder}
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2">
                        <Image
                            src={previewImages[3].src}
                            alt={previewImages[3].alt || previewImages[3].title}
                            width={thumbSize}
                            height={thumbSize}
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="w-full h-full object-cover"
                            placeholder="blur"
                            blurDataURL={blurImagePlaceholder}
                        />
                    </div>
                    {/* Grid separator lines */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent w-px left-1/2"></div>
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/20 to-transparent h-px top-1/2"></div>
                </>
            )}
        </div>
    );
}