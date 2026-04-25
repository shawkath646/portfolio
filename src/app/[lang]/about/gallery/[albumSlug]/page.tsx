import { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiFolder } from "react-icons/fi";
import { getAlbumBySlug, getImageFromAlbum } from "@/actions/gallery/getGalleryData";
import SimplePagination from "@/components/navigation/SimplePagination";
import appBaseUrl from "@/data/appBaseUrl";
import { buildCursorUrl } from "@/utils/cursor";
import { formatDateTime } from "@/utils/dateTime";
import { getSingleSearchParam } from "@/utils/string";
import GalleryGrid from "./GalleryGrid";

export async function generateMetadata(
    { params, searchParams }: PageProps<'/[lang]/about/gallery/[albumSlug]'>
): Promise<Metadata> {

    const { albumSlug } = await params;
    const albumDetails = await getAlbumBySlug(albumSlug);

    if (!albumDetails) {
        return {
            title: "Album Not Found - Gallery",
            description: "The requested photo album could not be found.",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const paramsList = await searchParams;
    const startAfter = getSingleSearchParam(paramsList.startAfter);

    const imagesResponse = await getImageFromAlbum(albumDetails.id, startAfter);

    const baseUrl = `/about/gallery/${albumSlug}`;

    const previous = buildCursorUrl(baseUrl, imagesResponse.prevStartAfter);
    const next = buildCursorUrl(baseUrl, imagesResponse.nextStartAfter);

    const title = `${albumDetails.name} - Photo Album`;

    const description = `View ${albumDetails.imageCount} ${albumDetails.imageCount === 1 ? "photo" : "photos"
        } from the ${albumDetails.name} album. Captured moments and memories from ${formatDateTime(albumDetails.timestamp)}.`;

    return {
        title,
        description,

        pagination: {
            previous,
            next,
        },

        alternates: {
            canonical:
                startAfter
                    ? new URL(`${baseUrl}?startAfter=${startAfter}`, appBaseUrl)
                    : new URL(baseUrl, appBaseUrl),
        },

        keywords: [
            albumDetails.name,
            "Photo Album",
            "Photography",
            "Shawkat Hossain Photos",
            "Image Gallery",
            "Photo Collection",
        ],

        robots: {
            index: true,
            follow: true,
            noimageindex: true,
            googleBot: {
                index: true,
                follow: true,
                noimageindex: true,
                "max-image-preview": "none",
            },
        },
    };
}

export default async function AlbumPage(
    { params, searchParams }: PageProps<'/[lang]/about/gallery/[albumSlug]'>
) {
    const { albumSlug, lang } = await params;
    const albumDetails = await getAlbumBySlug(albumSlug);

    const paramsList = await searchParams;
    const startAfter = getSingleSearchParam(paramsList.startAfter);

    if (!albumDetails) {
        notFound();
    }

    const imagesResponse = await getImageFromAlbum(albumDetails.id, startAfter);

    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            aria-label="Album page content"
            className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 pt-24 pb-16 px-3 sm:px-4 lg:px-6"
        >
            <div className="container mx-auto">
                {/* Header */}
                <header className="mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg" aria-hidden="true">
                                    <FiFolder className="text-lg sm:text-xl text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1">
                                        {albumDetails.name}
                                    </h1>
                                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                                        <span aria-label={`${albumDetails.imageCount} ${albumDetails.imageCount === 1 ? "photo" : "photos"}`}>
                                            {albumDetails.imageCount} {albumDetails.imageCount === 1 ? "photo" : "photos"}
                                        </span>
                                        {" • "}
                                        <time dateTime={albumDetails.timestamp.toISOString()}>
                                            {formatDateTime(albumDetails.timestamp)}
                                        </time>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <p className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Page {imagesResponse.page} of {imagesResponse.totalPages}
                </p>

                {/* Gallery Grid */}
                {imagesResponse.images.length > 0 ? (
                    <GalleryGrid albumName={albumDetails.name} albumSlug={albumDetails.slug} images={imagesResponse.images} />
                ) : (
                    <section
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center"
                        role="status"
                    >
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3" aria-hidden="true">
                            <FiFolder className="text-2xl text-gray-400 dark:text-gray-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No Photos Yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            This album doesn&apos;t have any photos yet.
                        </p>
                    </section>
                )}

                {(imagesResponse.hasPrev || imagesResponse.hasMore) && (
                    <div className="mt-8">
                        <SimplePagination
                            lang={lang}
                            prevPage={
                                imagesResponse.hasPrev
                                    ? buildCursorUrl(`/about/gallery/${albumSlug}`, imagesResponse.prevStartAfter)
                                    ?? `/about/gallery/${albumSlug}`
                                    : undefined
                            }
                            nextPage={buildCursorUrl(`/about/gallery/${albumSlug}`, imagesResponse.nextStartAfter)}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
