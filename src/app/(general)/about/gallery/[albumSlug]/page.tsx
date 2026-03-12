import { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiFolder } from "react-icons/fi";
import { getAlbumBySlug, getImageFromAlbum } from "@/actions/gallery/getGalleryData";
import appBaseUrl from "@/data/appBaseUrl";
import { formatDateTime } from "@/utils/dateTime";
import GalleryGrid from "./GalleryGrid";

const IMAGES_PER_PAGE = 20;

export async function generateMetadata(
    { params, searchParams }: PageProps<'/about/gallery/[albumSlug]'>
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

    const requestedPage = Number((await searchParams).page) || 1;

    const imagesResponse = await getImageFromAlbum(
        albumDetails.id,
        { page: requestedPage, limit: IMAGES_PER_PAGE }
    );

    const { page, totalPages } = imagesResponse;

    const baseUrl = `/about/gallery/${albumSlug}`;

    const previous =
        page > 1
            ? page === 2
                ? baseUrl
                : `${baseUrl}?page=${page - 1}`
            : undefined;

    const next =
        page < totalPages
            ? `${baseUrl}?page=${page + 1}`
            : undefined;

    const title =
        page === 1
            ? `${albumDetails.name} - Photo Album`
            : `${albumDetails.name} - Photo Album (Page ${page})`;

    const description =
        page === 1
            ? `View ${albumDetails.imageCount} ${albumDetails.imageCount === 1 ? "photo" : "photos"
            } from the ${albumDetails.name} album. Captured moments and memories from ${formatDateTime(albumDetails.timestamp)}.`
            : `Browse page ${page} of ${totalPages} from the ${albumDetails.name} photo album. Featuring ${albumDetails.imageCount} captured moments and memories from ${formatDateTime(albumDetails.timestamp)}.`;

    return {
        title,
        description,

        pagination: {
            previous,
            next,
        },

        alternates: {
            canonical:
                page === 1
                    ? `${appBaseUrl}${baseUrl}`
                    : `${appBaseUrl}${baseUrl}?page=${page}`,
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
    { params, searchParams }: PageProps<'/about/gallery/[albumSlug]'>
) {
    const { albumSlug } = await params;
    const albumDetails = await getAlbumBySlug(albumSlug);

    const requestedPage = Number((await searchParams).page) || 1;

    if (!albumDetails) {
        notFound();
    }

    const imagesResponse = await getImageFromAlbum(
        albumDetails.id,
        { page: requestedPage, limit: IMAGES_PER_PAGE }
    );

    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            aria-label="Album page content"
            className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 pt-24 pb-16 px-3 sm:px-4 lg:px-6"
        >
            <div className="max-w-7xl mx-auto">
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
            </div>
        </main>
    );
}
