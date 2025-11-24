"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getAlbumImages } from "@/actions/gallery/getAlbumImages";
import { GalleryImageType } from "@/actions/gallery/saveGalleryImage";
import { FaFolder } from "react-icons/fa";

interface AlbumPreviewProps {
    albumId: string;
    albumSlug: string;
}

export default function AlbumPreview({ albumId, albumSlug }: AlbumPreviewProps) {
    const [images, setImages] = useState<GalleryImageType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPreviewImages = async () => {
            try {
                const result = await getAlbumImages(albumSlug, 4); // Get latest 4 images
                setImages(result.images);
            } catch (error) {
                console.error("Error fetching preview images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPreviewImages();
    }, [albumId, albumSlug]);

    if (loading) {
        return (
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <FaFolder className="text-3xl text-gray-400 dark:text-gray-600 animate-pulse" />
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <FaFolder className="text-3xl text-gray-400 dark:text-gray-600" />
            </div>
        );
    }

    // Folder-style layout with latest images
    return (
        <div className="aspect-square relative overflow-hidden">
            {images.length === 1 && (
                <div className="absolute inset-0">
                    <Image
                        src={images[0].src}
                        alt={images[0].alt || images[0].title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGVhNWU5IiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
                    />
                </div>
            )}

            {images.length === 2 && (
                <>
                    <div className="absolute inset-0 w-1/2">
                        <Image
                            src={images[0].src}
                            alt={images[0].alt || images[0].title}
                            fill
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGVhNWU5IiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
                        />
                    </div>
                    <div className="absolute inset-0 left-1/2">
                        <Image
                            src={images[1].src}
                            alt={images[1].alt || images[1].title}
                            fill
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGVhNWU5IiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-px left-1/2"></div>
                </>
            )}

            {images.length === 3 && (
                <>
                    <div className="absolute inset-0 w-1/2">
                        <Image
                            src={images[0].src}
                            alt={images[0].alt || images[0].title}
                            fill
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGVhNWU5IiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
                        />
                    </div>
                    <div className="absolute top-0 right-0 w-1/2 h-1/2">
                        <Image
                            src={images[1].src}
                            alt={images[1].alt || images[1].title}
                            fill
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGVhNWU5IiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2">
                        <Image
                            src={images[2].src}
                            alt={images[2].alt || images[2].title}
                            fill
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGVhNWU5IiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-px left-1/2"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent h-px top-1/2 left-1/2"></div>
                </>
            )}

            {images.length >= 4 && (
                <>
                    <div className="absolute top-0 left-0 w-1/2 h-1/2">
                        <Image
                            src={images[0].src}
                            alt={images[0].alt || images[0].title}
                            fill
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGVhNWU5IiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
                        />
                    </div>
                    <div className="absolute top-0 right-0 w-1/2 h-1/2">
                        <Image
                            src={images[1].src}
                            alt={images[1].alt || images[1].title}
                            fill
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGVhNWU5IiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
                        />
                    </div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2">
                        <Image
                            src={images[2].src}
                            alt={images[2].alt || images[2].title}
                            fill
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGVhNWU5IiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2">
                        <Image
                            src={images[3].src}
                            alt={images[3].alt || images[3].title}
                            fill
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, (max-width: 1280px) 10vw, 8vw"
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGVhNWU5IiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
                        />
                    </div>
                    {/* Grid separator lines */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-px left-1/2"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent h-px top-1/2"></div>
                </>
            )}
        </div>
    );
}
