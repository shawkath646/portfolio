import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaMapMarkerAlt, FaCalendar } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { getAlbumBySlug, getImageBySlug } from "@/actions/gallery/getGalleryData";
import appBaseUrl from "@/data/appBaseUrl";
import blurImagePlaceholder from "@/data/blurImagePlaceholder";
import { formatDateTime } from "@/utils/dateTime";


export async function generateMetadata(
    { params }: PageProps<'/about/gallery/[albumSlug]/[imageSlug]'>
): Promise<Metadata> {
    const { albumSlug, imageSlug } = await params;

    const albumDetails = await getAlbumBySlug(albumSlug);
    const image = await getImageBySlug(imageSlug);

    if (!image) {
        return {
            title: "Image Not Found",
            description: "The requested image could not be found.",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const albumName = albumDetails?.name ?? "Unknown Album";

    return {
        title: `${image.title} - ${albumName}`,
        description:
            image.description ||
            `View ${image.title} from ${albumName} album.`,
        alternates: {
            canonical: `${appBaseUrl}/about/gallery/${albumSlug}/${imageSlug}`,
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
    const image = await getImageBySlug(imageSlug);

    if (!image) {
        notFound();
    }

    const albumName = albumDetails?.name ?? "Unknown Album";

    const imageSchema = {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        "@id": `${appBaseUrl}/about/gallery/${albumSlug}/${imageSlug}#image`,
        "name": image.title,
        "description": image.description || `Photo from ${albumName} album`,
        "contentUrl": image.src,
        "url": `${appBaseUrl}/about/gallery/${albumSlug}/${imageSlug}`,
        "thumbnailUrl": image.src,
        "width": {
            "@type": "QuantitativeValue",
            "value": image.width,
            "unitCode": "E37"
        },
        "height": {
            "@type": "QuantitativeValue",
            "value": image.height,
            "unitCode": "E37"
        },
        "encodingFormat": "image/jpeg",
        "uploadDate": image.createdAt.toISOString(),
        "datePublished": image.createdAt.toISOString(),
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
        "copyrightYear": image.timestamp.getFullYear(),
        "license": "https://creativecommons.org/licenses/by-nc/4.0/",
        "acquireLicensePage": `${appBaseUrl}/contact`,
        ...(image.location && {
            "contentLocation": {
                "@type": "Place",
                "name": image.location
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
        }
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

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Image Section - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                {/* Removed: aspect-video and lg:aspect-16/10 so the height can flow naturally */}
                                <div className="relative bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex justify-center">
                                    <Image
                                        src={image.src}
                                        alt={image.alt || image.title}
                                        width={image.width}
                                        height={image.height}
                                        sizes="(max-width: 1024px) 100vw, 66vw"
                                        className="w-full h-auto object-contain max-h-[85vh] p-2 sm:p-4"
                                        placeholder="blur"
                                        blurDataURL={blurImagePlaceholder}
                                        priority
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Details Sidebar - Takes 1 column */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 sticky top-24">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent whitespace-normal wrap-break-word">
                                        {image.title}
                                    </h1>

                                    <div className="h-1 w-20 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 rounded-full"></div>
                                </div>

                                {image.description && (
                                    <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                                        <h2 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                            Description
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed wrap-break-word">
                                            {image.description}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {image.location && (
                                        <div className="flex items-start gap-3 group">
                                            <div className="shrink-0 w-10 h-10 bg-linear-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                <FaMapMarkerAlt className="text-white text-base" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                                    Location
                                                </h2>
                                                <Link
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(image.location)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-gray-900 dark:text-white hover:text-blue-500 transition-all"
                                                >
                                                    {image.location}
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3 group">
                                        <div className="shrink-0 w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                            <FaCalendar className="text-white text-base" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                                Date Captured
                                            </h2>
                                            <time dateTime={image.timestamp.toISOString()} className="text-xs text-gray-900 dark:text-white">
                                                {formatDateTime(image.createdAt, { showYear: true })}
                                            </time>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                                Date Uploaded
                                            </h2>
                                            <time dateTime={image.createdAt.toISOString()} className="text-xs text-gray-900 dark:text-white">
                                                {formatDateTime(image.createdAt, { showYear: true })}
                                            </time>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                            Technical Details
                                        </h2>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Width</p>
                                                <p className="text-base font-bold text-gray-900 dark:text-white">
                                                    {image.width.toLocaleString()}<span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">px</span>
                                                </p>
                                            </div>
                                            <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Height</p>
                                                <p className="text-base font-bold text-gray-900 dark:text-white">
                                                    {image.height.toLocaleString()}<span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">px</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {image.alt && (
                                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                                Accessibility
                                            </h2>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 italic bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3">
                                                &ldquo;{image.alt}&rdquo;
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
