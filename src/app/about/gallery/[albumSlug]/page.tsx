import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import GalleryGrid from "./GalleryGrid";
import { getAlbumDetails, getAlbumImages } from "@/actions/gallery/getAlbumImages";
import { FiArrowLeft, FiFolder } from "react-icons/fi";

const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || "https://shawkath646.pro";

interface AlbumPageProps {
    params: Promise<{ albumSlug: string }>;
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
    const { albumSlug } = await params;
    const albumDetails = await getAlbumDetails(albumSlug);

    if (!albumDetails) {
        return {
            title: "Album Not Found - Gallery",
            description: "The requested photo album could not be found.",
        };
    }

    const albumDate = new Date(albumDetails.timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return {
        title: `${albumDetails.name} - Photo Album by Shawkat Hossain Maruf`,
        description: `View ${albumDetails.imageCount} ${albumDetails.imageCount === 1 ? "photo" : "photos"} from the ${albumDetails.name} album. Captured moments and memories from ${albumDate}.`,
        keywords: [
            albumDetails.name,
            "Photo Album",
            "Photography",
            "Shawkat Hossain Photos",
            "Image Gallery",
            "Photo Collection",
        ],
        alternates: {
            canonical: `${baseUrl}/about/gallery/${albumSlug}`,
        },
        openGraph: {
            title: `${albumDetails.name} - Photo Album`,
            description: `View ${albumDetails.imageCount} ${albumDetails.imageCount === 1 ? "photo" : "photos"} from this album.`,
            url: `${baseUrl}/about/gallery/${albumSlug}`,
            siteName: "Shawkat Hossain Maruf Portfolio",
            locale: "en_US",
            type: "website",
            images: [
                {
                    url: `${baseUrl}/profile.jpg`,
                    width: 1200,
                    height: 630,
                    alt: `${albumDetails.name} Photo Album`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            site: "@shawkath646",
            creator: "@shawkath646",
            title: `${albumDetails.name} - Photo Album`,
            description: `View ${albumDetails.imageCount} ${albumDetails.imageCount === 1 ? "photo" : "photos"} from this album.`,
            images: [`${baseUrl}/profile.jpg`],
        },
    };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
    const { albumSlug } = await params;
    const albumDetails = await getAlbumDetails(albumSlug);

    if (!albumDetails) {
        notFound();
    }

    const { images, hasMore } = await getAlbumImages(albumSlug, 20);

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 pt-24 pb-16 px-3 sm:px-4 lg:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-3">
                                <div className="p-2 sm:p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg" aria-hidden="true">
                                    <FiFolder className="text-xl sm:text-2xl text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {albumDetails.name}
                                    </h1>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                        <span aria-label={`${albumDetails.imageCount} ${albumDetails.imageCount === 1 ? "photo" : "photos"}`}>
                                            {albumDetails.imageCount} {albumDetails.imageCount === 1 ? "photo" : "photos"}
                                        </span>
                                        {" • "}
                                        <time dateTime={new Date(albumDetails.timestamp).toISOString()}>
                                            {new Date(albumDetails.timestamp).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </time>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Gallery Grid */}
                {images.length > 0 ? (
                    <section aria-label={`Photos from ${albumDetails.name} album`}>
                        <GalleryGrid albumSlug={albumSlug} albumId={albumDetails.id} initialImages={images} hasMore={hasMore} />
                    </section>
                ) : (
                    <div 
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center"
                        role="status"
                    >
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                            <FiFolder className="text-3xl text-gray-400 dark:text-gray-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No Photos Yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            This album doesn&apos;t have any photos yet.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
