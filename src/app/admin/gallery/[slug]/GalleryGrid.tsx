"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { GalleryImageType } from "@/actions/gallery/saveGalleryImage";
import { getAlbumImages } from "@/actions/gallery/getAlbumImages";
import { deleteImage } from "@/actions/gallery/deleteImage";
import { FaMapMarkerAlt, FaCalendar, FaTimes, FaSpinner, FaTrash } from "react-icons/fa";

interface GalleryGridProps {
    albumId: string;
    initialImages: GalleryImageType[];
    hasMore: boolean;
}

export default function GalleryGrid({ albumId, initialImages, hasMore: initialHasMore }: GalleryGridProps) {
    const [images, setImages] = useState<GalleryImageType[]>(initialImages);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<GalleryImageType | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const loadMore = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const lastImage = images[images.length - 1];
            const response = await getAlbumImages(albumId, 20, lastImage.timestamp);
            
            setImages(prev => [...prev, ...response.images]);
            setHasMore(response.hasMore);
        } catch (error) {
            console.error("Error loading more images:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (imageId: string, imageSrc: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        setDeletingId(imageId);
        try {
            const result = await deleteImage(albumId, imageId, imageSrc);
            if (result.success) {
                setImages(prev => prev.filter(img => img.id !== imageId));
                if (selectedImage?.id === imageId) {
                    setSelectedImage(null);
                }
            } else {
                alert(result.error || "Failed to delete image");
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Failed to delete image");
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        if (!loadMoreRef.current) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        observerRef.current.observe(loadMoreRef.current);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMore, loading, loadMore]);

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
                {images.map((image, index) => (
                    <motion.div
                        key={image.id}
                        variants={itemVariants}
                        className="group relative"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
                            {/* Image */}
                            <div 
                                className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900 cursor-pointer"
                                onClick={() => setSelectedImage(image)}
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                                handleDelete(image.id, image.src);
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

            {/* Load More Trigger */}
            {hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-8">
                    {loading && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <FaSpinner className="animate-spin" />
                            <span>Loading more photos...</span>
                        </div>
                    )}
                </div>
            )}

            {/* No More Images */}
            {!hasMore && images.length > 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>You&apos;ve reached the end! 🎉</p>
                </div>
            )}

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

            {/* Image Modal/Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                        >
                            <FaTimes className="text-xl" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="max-w-6xl w-full flex flex-col lg:flex-row gap-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Image */}
                            <div className="flex-1 relative aspect-video lg:aspect-auto lg:h-[75vh] bg-gray-900 rounded-lg overflow-hidden">
                                <Image
                                    src={selectedImage.src}
                                    alt={selectedImage.alt || selectedImage.title}
                                    fill
                                    sizes="100vw"
                                    className="object-contain"
                                    placeholder="blur"
                                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                                    priority
                                />
                            </div>

                            {/* Details */}
                            <div className="lg:w-72 bg-gray-900 rounded-lg p-5 overflow-y-auto max-h-[75vh]">
                                <h2 className="text-xl font-bold text-white mb-3">
                                    {selectedImage.title}
                                </h2>
                                
                                {selectedImage.description && (
                                    <div className="mb-3">
                                        <h3 className="text-xs font-semibold text-gray-400 mb-1.5">Description</h3>
                                        <p className="text-sm text-gray-300">{selectedImage.description}</p>
                                    </div>
                                )}

                                {selectedImage.location && (
                                    <div className="mb-3">
                                        <h3 className="text-xs font-semibold text-gray-400 mb-1.5">Location</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <FaMapMarkerAlt className="text-red-500 text-xs" />
                                            <span>{selectedImage.location}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <h3 className="text-xs font-semibold text-gray-400 mb-1.5">Date</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <FaCalendar className="text-blue-500 text-xs" />
                                        <span>
                                            {selectedImage.timestamp.toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <h3 className="text-xs font-semibold text-gray-400 mb-1.5">Dimensions</h3>
                                    <p className="text-sm text-gray-300">
                                        {selectedImage.width} × {selectedImage.height} px
                                    </p>
                                </div>

                                {selectedImage.alt && (
                                    <div className="mb-3">
                                        <h3 className="text-xs font-semibold text-gray-400 mb-1.5">Alt Text</h3>
                                        <p className="text-sm text-gray-300 italic">{selectedImage.alt}</p>
                                    </div>
                                )}

                                {/* Delete Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(selectedImage.id, selectedImage.src);
                                    }}
                                    disabled={deletingId === selectedImage.id}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                                >
                                    {deletingId === selectedImage.id ? (
                                        <>
                                            <FaSpinner className="animate-spin text-sm" />
                                            <span className="text-sm">Deleting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaTrash className="text-sm" />
                                            <span className="text-sm">Delete Image</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
