import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAlbumDetails, getImageBySlug } from "@/actions/gallery/getAlbumImages";
import { FiArrowLeft } from "react-icons/fi";
import { FaMapMarkerAlt, FaCalendar } from "react-icons/fa";

const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || "https://shawkath646.pro";

interface ImagePageProps {
    params: Promise<{ albumSlug: string; imageSlug: string }>;
}

export async function generateMetadata({ params }: ImagePageProps): Promise<Metadata> {
    const { albumSlug, imageSlug } = await params;
    const albumDetails = await getAlbumDetails(albumSlug);
    const image = await getImageBySlug(albumSlug, imageSlug);

    if (!image || !albumDetails) {
        return {
            title: "Image Not Found",
            description: "The requested image could not be found.",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    return {
        title: `${image.title} - ${albumDetails.name} | Shawkat Hossain Maruf`,
        description: image.description || `View ${image.title} from ${albumDetails.name} album.`,
        robots: {
            index: false,
            follow: false,
        },
        openGraph: {
            title: image.title,
            description: image.description || `Photo from ${albumDetails.name}`,
            url: `${baseUrl}/about/gallery/${albumSlug}/${imageSlug}`,
            siteName: "Shawkat Hossain Maruf Portfolio",
            locale: "en_US",
            type: "website",
            images: [
                {
                    url: image.src,
                    width: image.width,
                    height: image.height,
                    alt: image.alt || image.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            site: "@shawkath646",
            creator: "@shawkath646",
            title: image.title,
            description: image.description || `Photo from ${albumDetails.name}`,
            images: [image.src],
        },
    };
}

export default async function ImagePage({ params }: ImagePageProps) {
    const { albumSlug, imageSlug } = await params;
    const albumDetails = await getAlbumDetails(albumSlug);
    const image = await getImageBySlug(albumSlug, imageSlug);

    if (!image || !albumDetails) {
        notFound();
    }

    const imageSchema = {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        "@id": `${baseUrl}/about/gallery/${albumSlug}/${imageSlug}#image`,
        "name": image.title,
        "description": image.description || `Photo from ${albumDetails.name} album`,
        "contentUrl": image.src,
        "url": `${baseUrl}/about/gallery/${albumSlug}/${imageSlug}`,
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
        "uploadDate": image.timestamp.toISOString(),
        "datePublished": image.timestamp.toISOString(),
        "author": {
            "@type": "Person",
            "@id": `${baseUrl}/#person`,
            "name": "Shawkat Hossain Maruf",
            "url": "https://shawkath646.pro"
        },
        "creator": {
            "@type": "Person",
            "@id": `${baseUrl}/#person`
        },
        "copyrightHolder": {
            "@type": "Person",
            "@id": `${baseUrl}/#person`
        },
        "copyrightYear": new Date(image.timestamp).getFullYear(),
        "license": "https://creativecommons.org/licenses/by-nc/4.0/",
        "acquireLicensePage": `${baseUrl}/contact`,
        ...(image.location && {
            "contentLocation": {
                "@type": "Place",
                "name": image.location
            }
        }),
        "isPartOf": {
            "@type": "ImageGallery",
            "@id": `${baseUrl}/about/gallery/${albumSlug}#gallery`,
            "name": albumDetails.name,
            "url": `${baseUrl}/about/gallery/${albumSlug}`
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${baseUrl}/about/gallery/${albumSlug}/${imageSlug}`
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
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 pt-24 pb-16 px-3 sm:px-4 lg:px-6 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Floating Orbs */}
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-xl opacity-60 animate-float"></div>
                    <div className="absolute top-1/4 -right-8 w-32 h-32 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-xl opacity-40 animate-float-reverse"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-cyan-200 dark:bg-cyan-900/30 rounded-full blur-xl opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-pink-200 dark:bg-pink-900/30 rounded-full blur-xl opacity-45 animate-float-reverse" style={{ animationDelay: '1s' }}></div>
                    
                    {/* Gradient Lines */}
                    <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-300/20 to-transparent"></div>
                    <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-300/20 to-transparent"></div>
                    
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
                            <span>Back to {albumDetails.name}</span>
                        </Link>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Image Section - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="relative aspect-video lg:aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
                                    <Image
                                        src={image.src}
                                        alt={image.alt || image.title}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 66vw"
                                        className="object-contain p-2 sm:p-4"
                                        placeholder="blur"
                                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGVhNWU5IiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
                                        priority
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Details Sidebar - Takes 1 column */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 sticky top-24">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                        {image.title}
                                    </h1>
                                    <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 rounded-full"></div>
                                </div>

                                {image.description && (
                                    <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                                        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                            Description
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {image.description}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {image.location && (
                                        <div className="flex items-start gap-3 group">
                                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                <FaMapMarkerAlt className="text-white text-base" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                                    Location
                                                </h2>
                                                <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium truncate">
                                                    {image.location}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3 group">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                            <FaCalendar className="text-white text-base" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                                Date Captured
                                            </h2>
                                            <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                                                {image.timestamp.toLocaleDateString("en-US", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
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
