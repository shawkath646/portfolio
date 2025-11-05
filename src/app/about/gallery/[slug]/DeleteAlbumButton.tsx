"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2, FiAlertCircle } from "react-icons/fi";
import { deleteAlbum } from "@/actions/gallery/albumManagement";

interface DeleteAlbumButtonProps {
    albumId: string;
    albumName: string;
}

export default function DeleteAlbumButton({ albumId, albumName }: DeleteAlbumButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteAlbum(albumId);
            router.push("/about/gallery");
            router.refresh();
        } catch (error) {
            console.error("Error deleting album:", error);
            alert("Failed to delete album. Please try again.");
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting}
                aria-label={`Delete ${albumName} album`}
            >
                <FiTrash2 className="text-sm" />
                <span className="hidden sm:inline">Delete Album</span>
            </button>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <FiAlertCircle className="text-2xl text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Delete Album?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Are you sure you want to delete <strong>&quot;{albumName}&quot;</strong>? 
                                    This will permanently delete the album and all its photos. This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 justify-end">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors duration-200"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiTrash2 />
                                        <span>Delete</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
