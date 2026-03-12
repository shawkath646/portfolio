"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCalendar } from "react-icons/fa";
import { GalleryImageType } from "@/types/gallery.types";
import { formatDateTime } from "@/utils/dateTime";

interface GalleryGridProps {
    albumName: string;
    albumSlug: string;
    images: GalleryImageType[];
}

export default function GalleryGrid({ albumName, albumSlug, images }: GalleryGridProps) {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
            },
        },
    };

    return (
        <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3"
            aria-label={`Photos from ${albumName} album`}
        >
            {images.map((image) => (
                <motion.article key={image.id} variants={itemVariants} className="group relative">
                    <Link href={`/about/gallery/${albumSlug}/${image.slug}`} className="block">
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
                            {/* Image */}
                            <div className="relative aspect-square overflow-hidden bg-gray-200 dark:bg-gray-700">
                                <Image
                                    src={image.src}
                                    alt={image.alt || image.title}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    placeholder="blur"
                                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGVhNWU5IiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Info */}
                            <div className="p-2">
                                <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 line-clamp-1">
                                    {image.title}
                                </h3>
                                {image.description && (
                                    <p className="text-[12px] text-gray-600 dark:text-gray-400 line-clamp-1 mb-1.5">
                                        {image.description}
                                    </p>
                                )}
                                <div className="flex flex-col gap-0.5 text-[10px] text-gray-500 dark:text-gray-500">
                                    {image.location && (
                                        <p className="flex items-center gap-1">
                                            <FaMapMarkerAlt className="text-red-500 text-[8px]" />
                                            <span className="line-clamp-1">{image.location}</span>
                                        </p>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <FaCalendar className="text-blue-500 text-[8px]" />
                                        <time dateTime={image.timestamp.toISOString()}>{formatDateTime(image.timestamp)}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.article>
            ))}
        </motion.section>
    );
}
