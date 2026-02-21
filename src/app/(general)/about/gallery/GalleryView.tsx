"use client";
import { FiFolder } from "react-icons/fi";
import { GalleryAlbumType } from "@/actions/gallery/albumManagement";
import AlbumsList from "./AlbumsList";

interface GalleryViewProps {
    albumList: GalleryAlbumType[];
}

export default function GalleryView({ albumList }: GalleryViewProps) {
    return (
        <div className="max-w-7xl mx-auto relative z-10">
            <header className="mb-8 text-center">
                <div className="inline-flex items-center justify-center gap-3 mb-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <FiFolder className="text-3xl text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Photo Gallery
                    </h1>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Explore my collection of captured moments, organized in albums
                </p>
            </header>

            <AlbumsList albumList={albumList} />
        </div>
    );
}
