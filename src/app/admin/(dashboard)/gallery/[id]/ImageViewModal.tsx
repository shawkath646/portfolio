"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { FaTimes, FaMapMarkerAlt, FaCalendar, FaSpinner, FaTrash, FaFolder } from "react-icons/fa";
import { getAdminAlbumsList } from "@/actions/gallery/getGalleryData";
import { deleteImage, updateImageAlbum } from "@/actions/gallery/imageManagement";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import { GalleryAlbumType, GalleryImageType } from "@/types/gallery.types";
import { formatDateTime } from "@/utils/dateTime";

export default function ImageViewModal({ image }: { image: GalleryImageType }) {
    const [isDeleting, setDeleting] = useState(false);

    const [albumList, setAlbumList] = useState<GalleryAlbumType[]>([]);
    const [isFetchingAlbums, setIsFetchingAlbums] = useState(true);
    const [selectedAlbumId, setSelectedAlbumId] = useState<string>(image.albumId || "unknown-album");
    const [isPending, startTransition] = useTransition();

    const router = useRouter();
    useLockBodyScroll();

    useEffect(() => {
        let isMounted = true;

        const fetchAlbums = async () => {
            try {
                setIsFetchingAlbums(true);
                const response = await getAdminAlbumsList();

                setAlbumList(response.filter(i => i.id !== "unknown-album"));
            } catch (error) {
                console.error("Failed to fetch albums:", error);
            } finally {
                if (isMounted) setIsFetchingAlbums(false);
            }
        };

        fetchAlbums();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleAlbumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newAlbumId = e.target.value;
        if (image.albumId === newAlbumId) return;
        setSelectedAlbumId(newAlbumId);

        startTransition(async () => {
            const result = await updateImageAlbum(image.id, newAlbumId);
            alert(result.message);
        });
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            >
                <button
                    onClick={() => router.replace(`/admin/gallery/${image.albumId ?? "unknown-album"}`)}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                >
                    <FaTimes className="text-xl" />
                </button>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="max-w-7xl w-full flex flex-col lg:flex-row gap-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Image */}
                    <div className="flex-1 relative aspect-video lg:aspect-auto lg:h-[80vh] bg-gray-900 rounded-lg overflow-hidden">
                        <Image
                            src={image.src}
                            alt={image.alt || image.title}
                            fill
                            sizes="100vw"
                            className="object-contain"
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                            priority
                        />
                    </div>

                    {/* Details */}
                    <div className="lg:w-85 bg-zinc-900 rounded-xl flex flex-col h-[80vh] border border-zinc-800 shadow-xl">

                        {/* Header */}
                        <div className="px-5 py-4 border-b border-zinc-800">
                            <h2 className="text-lg font-semibold text-white leading-snug wrap-break-word">
                                {image.title}
                            </h2>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-5">

                            {image.description && (
                                <div>
                                    <p className="text-sm text-zinc-300 leading-relaxed wrap-break-word">
                                        {image.description}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4 text-sm">

                                {/* Dropdown with Loading State */}
                                <div className="flex items-start gap-3">
                                    <FaFolder className="text-amber-500 mt-0.75 shrink-0" />
                                    <div className="w-full">
                                        <p className="text-xs text-zinc-500 mb-1">Album</p>
                                        <div className="relative">
                                            <select
                                                value={selectedAlbumId}
                                                onChange={handleAlbumChange}
                                                disabled={isPending || isFetchingAlbums}
                                                className="w-full bg-zinc-800/50 border border-zinc-700 text-zinc-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-colors appearance-none disabled:opacity-50 cursor-pointer"
                                            >
                                                {isFetchingAlbums ? (
                                                    <option value={selectedAlbumId}>Loading albums...</option>
                                                ) : (
                                                    <>
                                                        <option disabled value="unknown-album">Unknown Album</option>
                                                        {albumList.map((album) => (
                                                            <option key={album.id} value={album.id}>
                                                                {album.name}
                                                            </option>
                                                        ))}
                                                    </>
                                                )}
                                            </select>

                                            {/* Dropdown Loading Indicator & Arrow */}
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none gap-2">
                                                {(isPending || isFetchingAlbums) && <FaSpinner className="animate-spin text-zinc-400" />}
                                                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {image.location && (
                                    <div className="flex items-start gap-3">
                                        <FaMapMarkerAlt className="text-red-500 mt-0.75 shrink-0" />
                                        <div>
                                            <p className="text-xs text-zinc-500">Location</p>
                                            <p className="text-zinc-300 wrap-break-word">{image.location}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <FaCalendar className="text-blue-500 mt-0.75 shrink-0" />
                                    <div>
                                        <p className="text-xs text-zinc-500">Date</p>
                                        <time
                                            className="text-zinc-300"
                                            dateTime={image.timestamp.toISOString()}
                                        >
                                            {formatDateTime(image.timestamp)}
                                        </time>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-4 h-4 rounded-sm bg-purple-500 mt-0.75 shrink-0" />
                                    <div>
                                        <p className="text-xs text-zinc-500">Dimensions</p>
                                        <p className="text-zinc-300">
                                            {image.width} × {image.height} px
                                        </p>
                                    </div>
                                </div>

                                {image.alt && (
                                    <div className="pt-2 border-t border-zinc-800">
                                        <p className="text-xs text-zinc-500 mb-1">Alt Text</p>
                                        <p className="text-sm text-zinc-400 italic wrap-break-word">
                                            {image.alt}
                                        </p>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur">
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    setDeleting(true);
                                    const response = await deleteImage(image.id);
                                    alert(response.message);
                                    router.back();
                                    setDeleting(false);
                                }}
                                disabled={isDeleting}
                                className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm px-4 py-2.5 rounded-lg transition disabled:opacity-50 border border-red-500/20 hover:border-red-500/40"
                            >
                                {isDeleting ? (
                                    <>
                                        <FaSpinner className="animate-spin text-sm" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FaTrash className="text-sm" />
                                        Delete Image
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}