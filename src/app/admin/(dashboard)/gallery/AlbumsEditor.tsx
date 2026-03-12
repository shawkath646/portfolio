"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaFolder, FaPlus, FaTimes, FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { createAlbum, updateAlbum, deleteAlbum } from "@/actions/gallery/albumManagement";
import { GalleryAlbumType } from "@/types/gallery.types";

export default function AlbumsEditor({ albumList }: { albumList: GalleryAlbumType[] }) {
    const [isAdding, setIsAdding] = useState(false);
    const [newAlbum, setNewAlbum] = useState("");
    const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
    const [editingAlbumName, setEditingAlbumName] = useState("");
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const [pendingAction, setPendingAction] = useState<"adding" | "editing" | "deleting" | null>(null);

    const startAdding = () => {
        setStatusMessage(null);
        setEditingAlbumId(null);
        setEditingAlbumName("");
        setIsAdding(true);
        setNewAlbum("");
    };

    const saveNewAlbum = async () => {
        const nextName = newAlbum.trim();

        if (!nextName) return;

        setPendingAction("adding");
        startTransition(async () => {
            const result = await createAlbum(nextName);
            setStatusMessage(result.message);

            if (result.success) {
                setNewAlbum("");
                setIsAdding(false);
            }
            setPendingAction(null);
        });
    };

    const cancelAdding = () => {
        setIsAdding(false);
        setNewAlbum("");
        setStatusMessage(null);
    };

    const startEditing = (album: GalleryAlbumType) => {
        setStatusMessage(null);
        setIsAdding(false);
        setNewAlbum("");
        setEditingAlbumId(album.id);
        setEditingAlbumName(album.name);
    };

    const cancelEditing = () => {
        setEditingAlbumId(null);
        setEditingAlbumName("");
        setStatusMessage(null);
    };

    const saveEditedAlbum = async (album: GalleryAlbumType) => {
        const nextName = editingAlbumName.trim();

        if (!nextName) return;

        if (nextName === album.name) {
            cancelEditing();
            return;
        }

        setPendingAction("editing");
        startTransition(async () => {
            const result = await updateAlbum(album.id, nextName);
            setStatusMessage(result.message);

            if (result.success) {
                setEditingAlbumId(null);
                setEditingAlbumName("");
            }
            setPendingAction(null);
        });
    };

    const startAlbumDeleting = async (galleryId: string) => {
        if (!confirm("Are you sure you want to delete this album?")) {
            return;
        }

        setPendingAction("deleting");
        startTransition(async () => {
            const response = await deleteAlbum(galleryId);
            setStatusMessage(response.message);
            setPendingAction(null);
        });
    }

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
                    {albumList.map((album) => (
                        <motion.div
                            key={album.id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, x: -20 }}
                            layout
                        >
                            {/* Reverted to just checking editing state */}
                            {editingAlbumId === album.id ? (
                                <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-2 border-amber-500 dark:border-amber-400">
                                    <FaFolder className="text-amber-600 dark:text-amber-400 text-sm shrink-0" />
                                    <input
                                        type="text"
                                        value={editingAlbumName}
                                        onChange={(e) => setEditingAlbumName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !isPending) {
                                                saveEditedAlbum(album);
                                            }

                                            if (e.key === "Escape" && !isPending) {
                                                cancelEditing();
                                            }
                                        }}
                                        disabled={isPending}
                                        className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => saveEditedAlbum(album)}
                                        disabled={isPending}
                                        className="p-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400 disabled:cursor-not-allowed text-white rounded transition-colors"
                                        aria-label={`Save album name for ${album.name}`}
                                    >
                                        {isPending && pendingAction === "editing" ? (
                                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <FaCheck className="text-xs" />
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelEditing}
                                        disabled={isPending}
                                        className="p-1.5 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded transition-colors"
                                        aria-label={`Cancel editing album ${album.name}`}
                                    >
                                        <FaTimes className="text-xs" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/admin/gallery/${album.id}`}
                                        className="flex-1 h-full flex items-center justify-between gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 border border-transparent transition-all group"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <FaFolder className="text-blue-500 dark:text-blue-400 text-sm group-hover:scale-110 transition-transform shrink-0" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                                                {album.name}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full min-w-8 text-center shrink-0">
                                            {album.imageCount ?? 0}
                                        </span>
                                    </Link>

                                    {/* FIX: Only render Action Buttons if it's NOT the unknown-album */}
                                    {album.id !== "unknown-album" && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => startAlbumDeleting(album.id)}
                                                disabled={isPending}
                                                className="p-2 h-full flex items-center bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/40 text-red-600 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label={`Delete album ${album.name}`}
                                            >
                                                <FaTrash className="text-xs" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => startEditing(album)}
                                                disabled={isPending}
                                                className="p-2 h-full flex items-center bg-gray-100 hover:bg-amber-100 dark:bg-gray-700 dark:hover:bg-amber-900/40 text-gray-600 hover:text-amber-700 dark:text-gray-300 dark:hover:text-amber-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label={`Edit album name for ${album.name}`}
                                            >
                                                <FaEdit className="text-xs" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
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
                                type="button" // Fixed: Added explicit button type
                                onClick={saveNewAlbum}
                                disabled={isPending}
                                className="p-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded transition-colors"
                            >
                                {isPending && pendingAction === "adding" ? (
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <FaCheck className="text-xs" />
                                )}
                            </button>
                            <button
                                type="button" // Fixed: Added explicit button type
                                onClick={cancelAdding}
                                disabled={isPending}
                                className="p-1.5 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded transition-colors"
                            >
                                <FaTimes className="text-xs" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Saving/Action Indicator */}
                {/* Fixed: Replaced basic text check with pendingAction specific text */}
                <AnimatePresence>
                    {isPending && pendingAction && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-300 dark:border-blue-600"
                        >
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-blue-700 dark:text-blue-300 font-medium capitalize">
                                {pendingAction} album...
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {statusMessage && !isPending && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="p-2 rounded-lg border text-xs bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        >
                            {statusMessage}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer with Add Button */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {!isAdding && (
                    <motion.button
                        type="button" // Fixed: Added explicit button type
                        onClick={startAdding}
                        className="w-full px-3 py-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
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