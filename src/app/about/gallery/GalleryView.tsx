"use client";
import AlbumsList from "./AlbumsList";
import { GalleryAlbumType } from "@/actions/gallery/albumManagement";
import { FiFolder } from "react-icons/fi";

interface GalleryViewProps {
    albumList: GalleryAlbumType[];
}

export default function GalleryView({ albumList }: GalleryViewProps) {
    return (
        <div>
            {/* Header */}
            <header className="mb-8 text-center">
                <div className="inline-flex items-center justify-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <FiFolder className="text-3xl text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                    Photo Gallery
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Explore my collection of captured moments, organized in albums
                </p>
            </header>

            {/* Albums Grid */}
            <AlbumsList albumList={albumList} />
        </div>
    );
}
