"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCalendar, FaSpinner, FaTrash } from "react-icons/fa";
import { deleteImage } from "@/actions/gallery/imageManagement";
import { GalleryImageType } from "@/types/gallery.types";


interface GalleryGridProps {
    images: GalleryImageType[]
}

export default function GalleryGrid({ images }: GalleryGridProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const router = useRouter();

    const handleDelete = async (imageId: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        setDeletingId(imageId);
        const result = await deleteImage(imageId);
        alert(result.message);
        alert("Failed to delete image");
        setDeletingId(null);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4
            }
        }
    };

    return (
        <>
            {/* Image Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
            >
                {images.map((image) => (
                    <motion.div
                        key={image.id}
                        variants={itemVariants}
                        className="group relative"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
                            {/* Image */}
                            <div
                                className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900 cursor-pointer"
                                onClick={() => router.replace(`/admin/gallery/${image.albumId ?? "unknown-album"}?selected=${image.id}`)}
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt || image.title}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    placeholder="blur"
                                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Info */}
                            <div className="p-2.5">
                                <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 line-clamp-1">
                                    {image.title}
                                </h3>
                                {image.description && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
                                        {image.description}
                                    </p>
                                )}
                                <div className="flex flex-col gap-0.5 text-[10px] text-gray-500 dark:text-gray-500">
                                    {image.location && (
                                        <div className="flex items-center gap-1">
                                            <FaMapMarkerAlt className="text-red-500 text-[9px]" />
                                            <span className="line-clamp-1">{image.location}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <FaCalendar className="text-blue-500 text-[9px]" />
                                        <span>
                                            {image.timestamp.toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(image.id);
                            }}
                            disabled={deletingId === image.id}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed z-10"
                            title="Delete image"
                        >
                            {deletingId === image.id ? (
                                <FaSpinner className="animate-spin text-xs" />
                            ) : (
                                <FaTrash className="text-xs" />
                            )}
                        </button>
                    </motion.div>
                ))}
            </motion.div>

            {/* Empty State */}
            {images.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">📷</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No photos yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Upload some photos to get started!
                    </p>
                </div>
            )}
        </>
    );
}
