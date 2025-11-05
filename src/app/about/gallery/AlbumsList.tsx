"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryAlbumType } from "@/actions/gallery/albumManagement";
import { FaFolder, FaImage } from "react-icons/fa";
import AlbumPreview from "./AlbumPreview";

interface AlbumsListProps {
    albumList: GalleryAlbumType[];
}

export default function AlbumsList({ albumList }: AlbumsListProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
            },
        },
    };

    if (albumList.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
                role="status"
                aria-live="polite"
            >
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
                    <FaFolder className="text-4xl text-gray-400 dark:text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    No Albums Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Check back later for new photo albums!
                </p>
            </motion.div>
        );
    }

    return (
        <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
            role="list"
        >
            <AnimatePresence>
                {albumList.map((album) => (
                    <motion.li
                        key={album.id}
                        variants={itemVariants}
                        whileHover={{ y: -4, scale: 1.02 }}
                        layout
                    >
                        <article className="h-full">
                            <Link
                                href={`/about/gallery/${album.id}`}
                                className="group block bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg shadow-md hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300 h-full"
                                aria-label={`View ${album.name} album with ${album.imageCount ?? 0} photos`}
                            >
                                {/* Album Preview - Square Aspect */}
                                <figure className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                                    <AlbumPreview albumId={album.id} />
                                </figure>

                                {/* Album Info */}
                                <div className="p-3">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate mb-1">
                                        {album.name}
                                    </h3>
                                    <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-500">
                                        <div className="flex items-center gap-1" aria-label={`${album.imageCount ?? 0} photos`}>
                                            <FaImage className="text-[9px]" aria-hidden="true" />
                                            <span>{album.imageCount ?? 0}</span>
                                        </div>
                                        <span className="font-medium text-blue-600 dark:text-blue-400" aria-hidden="true">
                                            View →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    </motion.li>
                ))}
            </AnimatePresence>
        </motion.ul>
    );
}
