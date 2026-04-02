import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaMapMarkerAlt, FaCalendar } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { getAlbumBySlug, getImageBySlug } from "@/actions/gallery/getGalleryData";
import appBaseUrl from "@/data/appBaseUrl";
import { formatDateTime } from "@/utils/dateTime";
import GalleryImageViewer from "./GalleryImageViewer";


export async function generateMetadata(
    { params }: PageProps<'/about/gallery/[albumSlug]/[imageSlug]'>
): Promise<Metadata> {
    const { albumSlug, imageSlug } = await params;

    const albumDetails = await getAlbumBySlug(albumSlug);
    const imageRecord = await getImageBySlug(imageSlug);

    if (!imageRecord) notFound();

    const albumName = albumDetails?.name ?? "Unknown Album";

    const ogImageMeta = imageRecord.images.map((img) => {
        return {
            url: img.src,
            width: img.width,
            height: img.height,
            alt: imageRecord.alt || imageRecord.title,
        };
    });

    const twImageMeta = imageRecord.images.map((img) => img.src);

    return {
        title: `${imageRecord.title} - ${albumName}`,
        description:
            imageRecord.description ||
            `View ${imageRecord.title} from ${albumName} album.`,
        openGraph: {
            type: "article",
            title: `${imageRecord.title} - ${albumName}`,
            description: imageRecord.description || `View ${imageRecord.title} from ${albumName} album.`,
            images: ogImageMeta,
        },
        twitter: {
            card: "summary_large_image",
            title: `${imageRecord.title} - ${albumName}`,
            description: imageRecord.description || `View ${imageRecord.title} from ${albumName} album.`,
            images: twImageMeta,
        },
        alternates: {
            canonical: new URL(`/about/gallery/${albumSlug}/${imageSlug}`, appBaseUrl),
        },
        robots: {
            index: true,
            follow: true,
            noimageindex: false,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-video-preview": -1,
                "max-snippet": -1,
            },
        },
    };
}

export default async function ImagePage(
    { params }: PageProps<'/about/gallery/[albumSlug]/[imageSlug]'>
) {
    const { albumSlug, imageSlug } = await params;
    const albumDetails = await getAlbumBySlug(albumSlug);
    const imageRecord = await getImageBySlug(imageSlug);

    if (!imageRecord) notFound();

    const albumName = albumDetails?.name ?? "Unknown Album";
    const imagesMetadata = imageRecord.images.map((img, index) => {
        return {
            "@type": "ImageObject",
            "url": img.src,
            "width": img.width,
            "height": img.height,
            "description": imageRecord.description || `Photo from ${albumName} album`,
            ...(imageRecord.location && {
                "contentLocation": {
                    "@type": "Place",
                    "name": imageRecord.location,
                },
            }),
            "name": `${imageRecord.title} (${index + 1})`
        };
    });

    const imageSchema = {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        "@id": `${appBaseUrl}/about/gallery/${albumSlug}/${imageSlug}#image`,
        "name": imageRecord.title,
        "description": imageRecord.description || `Photo from ${albumName} album`,
        "contentUrl": imageRecord.images[0].src,
        "url": `${appBaseUrl}/about/gallery/${albumSlug}/${imageSlug}`,
        "thumbnailUrl": imageRecord.images[0].src,
        "width": {
            "@type": "QuantitativeValue",
            "value": imageRecord.images[0].width,
            "unitCode": "E37"
        },
        "height": {
            "@type": "QuantitativeValue",
            "value": imageRecord.images[0].height,
            "unitCode": "E37"
        },
        "encodingFormat": "image/jpeg",
        "uploadDate": imageRecord.createdAt.toISOString(),
        "datePublished": imageRecord.createdAt.toISOString(),
        "author": {
            "@type": "Person",
            "@id": `${appBaseUrl}/#person`,
            "name": "Shawkat Hossain Maruf",
            "url": appBaseUrl.toString()
        },
        "creator": {
            "@type": "Person",
            "@id": `${appBaseUrl}/#person`
        },
        "copyrightHolder": {
            "@type": "Person",
            "@id": `${appBaseUrl}/#person`
        },
        "copyrightYear": imageRecord.timestamp.getFullYear(),
        "license": "https://creativecommons.org/licenses/by-nc/4.0/",
        "acquireLicensePage": `${appBaseUrl}/contact`,
        ...(imageRecord.location && {
            "contentLocation": {
                "@type": "Place",
                "name": imageRecord.location
            }
        }),
        "isPartOf": {
            "@type": "ImageGallery",
            "@id": `${appBaseUrl}/about/gallery/${albumSlug}#gallery`,
            "name": albumName,
            "url": `${appBaseUrl}/about/gallery/${albumSlug}`
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${appBaseUrl}/about/gallery/${albumSlug}/${imageSlug}`
        },
        ...(imagesMetadata.length > 1 && {
            "associatedMedia": imagesMetadata
        })
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(imageSchema).replace(/</g, '\\u003c'),
                }}
            />
            <main
                id="main-content"
                tabIndex={-1}
                role="main"
                aria-label="Image details page content"
                className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 pt-24 pb-16 px-3 sm:px-4 lg:px-6 relative overflow-hidden"
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Floating Orbs */}
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-xl opacity-60 animate-float"></div>
                    <div className="absolute top-1/4 -right-8 w-32 h-32 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-xl opacity-40 animate-float-reverse"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-cyan-200 dark:bg-cyan-900/30 rounded-full blur-xl opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-pink-200 dark:bg-pink-900/30 rounded-full blur-xl opacity-45 animate-float-reverse" style={{ animationDelay: '1s' }}></div>

                    {/* Gradient Lines */}
                    <div className="absolute top-0 left-1/4 w-px h-full bg-linear-to-b from-transparent via-blue-300/20 to-transparent"></div>
                    <div className="absolute top-0 right-1/3 w-px h-full bg-linear-to-b from-transparent via-purple-300/20 to-transparent"></div>

                    {/* Geometric Shapes */}
                    <div className="absolute top-1/3 left-1/6 w-8 h-8 border border-cyan-300/30 dark:border-cyan-500/20 rotate-45 animate-spin-slow"></div>
                    <div className="absolute bottom-1/4 right-1/5 w-6 h-6 border border-purple-300/30 dark:border-purple-500/20 rotate-12 animate-pulse"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Navigation */}
                    <nav className="mb-6 sm:mb-8">
                        <Link
                            href={`/about/gallery/${albumSlug}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-800 font-medium transition-all rounded-lg shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 group"
                        >
                            <FiArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" />
                            <span>Back to {albumName}</span>
                        </Link>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 lg:items-start">
                        {/* Image Section - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <GalleryImageViewer
                                    images={imageRecord.images}
                                    altText={imageRecord.alt || imageRecord.title}
                                />
                            </div>
                        </div>

                        {/* Details Sidebar - Takes 1 column */}
                        <div className="lg:col-span-1 lg:self-start">
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 lg:sticky lg:top-28">

                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent whitespace-normal wrap-break-word">
                                        {imageRecord.title}
                                    </h1>
                                    <div className="h-1 w-20 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 rounded-full"></div>
                                </div>

                                <dl className="space-y-6">

                                    <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                                        <dt className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-bold">
                                            Description
                                        </dt>
                                        <dd className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed wrap-break-word m-0">
                                            {imageRecord.description || "No description provided"}
                                        </dd>
                                    </div>

                                    {imageRecord.location && (
                                        <div className="flex items-start gap-3 group">
                                            <div className="shrink-0 w-10 h-10 bg-linear-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                <FaMapMarkerAlt className="text-white text-base" aria-hidden="true" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <dt className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                                    Location
                                                </dt>
                                                <dd className="m-0">
                                                    <Link
                                                        href={`https://maps.google.com/?q=${encodeURIComponent(imageRecord.location)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-gray-900 dark:text-white hover:text-blue-500 transition-all"
                                                    >
                                                        {imageRecord.location}
                                                    </Link>
                                                </dd>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3 group">
                                        <div className="shrink-0 w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                            <FaCalendar className="text-white text-base" aria-hidden="true" />
                                        </div>

                                        <div className="flex gap-4 w-full">
                                            <div className="flex-1 min-w-0">
                                                <dt className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                                    Date Captured
                                                </dt>
                                                <dd className="m-0">
                                                    <time dateTime={imageRecord.timestamp.toISOString()} className="text-xs text-gray-900 dark:text-white">
                                                        {formatDateTime(imageRecord.timestamp, { showYear: true })}
                                                    </time>
                                                </dd>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <dt className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                                    Uploaded
                                                </dt>
                                                <dd className="m-0">
                                                    <time dateTime={imageRecord.createdAt.toISOString()} className="text-xs text-gray-900 dark:text-white">
                                                        {formatDateTime(imageRecord.createdAt, { showYear: true })}
                                                    </time>
                                                </dd>
                                            </div>
                                        </div>
                                    </div>

                                    {imageRecord.alt && (
                                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <dt className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                                Accessibility
                                            </dt>
                                            <dd className="text-sm text-gray-700 dark:text-gray-300 italic bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 m-0">
                                                “{imageRecord.alt}”
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
