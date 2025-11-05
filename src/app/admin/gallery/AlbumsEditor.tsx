"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createAlbum, GalleryAlbumType } from "@/actions/gallery/albumManagement";
import { FaFolder, FaPlus, FaTimes, FaCheck } from "react-icons/fa";

export default function AlbumsEditor({ albumList }: { albumList: GalleryAlbumType[] }) {
    const [isAdding, setIsAdding] = useState(false);
    const [newAlbum, setNewAlbum] = useState("");
    const [isPending, startTransition] = useTransition();

    const startAdding = () => {
        setIsAdding(true);
        setNewAlbum("");
    };

    // Save new album
    const saveNewAlbum = async () => {
        if (newAlbum.trim()) {
            startTransition(async () => {
                await createAlbum(newAlbum);
                setNewAlbum("");
                setIsAdding(false);
            });
        }
    };

    // Cancel adding
    const cancelAdding = () => {
        setIsAdding(false);
        setNewAlbum("");
    };

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col h-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <FaFolder className="text-blue-600 dark:text-blue-400 text-lg" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Albums</h2>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {albumList.length}
                </span>
            </div>

            {/* Albums List - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <AnimatePresence>
                    {albumList.map((album, index) => (
                        <motion.div
                            key={album.id || index}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, x: -20 }}
                            layout
                        >
                            <Link
                                href={`/admin/gallery/${album.id}`}
                                className="flex items-center justify-between gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 border border-transparent transition-all group"
                            >
                                <div className="flex items-center gap-2">
                                    <FaFolder className="text-blue-500 dark:text-blue-400 text-sm group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                        {album.name}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full min-w-[2rem] text-center">
                                    {album.imageCount ?? 0}
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Add New Album Form */}
                <AnimatePresence>
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-500 dark:border-green-400"
                        >
                            <input
                                type="text"
                                value={newAlbum}
                                onChange={(e) => setNewAlbum(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isPending) saveNewAlbum();
                                    if (e.key === 'Escape' && !isPending) cancelAdding();
                                }}
                                placeholder="Album name..."
                                disabled={isPending}
                                className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                autoFocus
                            />
                            <button
                                onClick={saveNewAlbum}
                                disabled={isPending}
                                className="p-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded transition-colors"
                            >
                                {isPending ? (
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <FaCheck className="text-xs" />
                                )}
                            </button>
                            <button
                                onClick={cancelAdding}
                                disabled={isPending}
                                className="p-1.5 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded transition-colors"
                            >
                                <FaTimes className="text-xs" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Saving Indicator */}
                <AnimatePresence>
                    {isPending && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-300 dark:border-blue-600"
                        >
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                                Saving album...
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer with Add Button */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {!isAdding && (
                    <motion.button
                        onClick={startAdding}
                        className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FaPlus className="text-xs" />
                        <span>Add New Album</span>
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}
