import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaMapMarkerAlt, FaCalendar } from "react-icons/fa";
import { getAlbumBySlug, getImageBySlug } from "@/actions/gallery/getGalleryData";
import appBaseUrl from "@/data/appBaseUrl";
import { defaultLocale, getLanguagePack, locales, resolveLocale } from "@/lib/locale";
import { formatDateTime } from "@/utils/dateTime";
import GalleryImageViewer from "./GalleryImageViewer";


export async function generateMetadata(
    { params }: PageProps<'/[lang]/about/gallery/[albumSlug]/[imageSlug]'>
): Promise<Metadata> {
    const { albumSlug, imageSlug, lang: paramsLang } = await params;
    const lang = resolveLocale(paramsLang);

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

    const languages: Record<string, string> = {};
    for (const l of locales) {
        languages[l] = new URL(`/${l}/about/gallery/${albumSlug}/${imageSlug}`, appBaseUrl).toString();
    }
    languages["x-default"] = new URL(`/${defaultLocale}/about/gallery/${albumSlug}/${imageSlug}`, appBaseUrl).toString();

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
            canonical: new URL(`/${lang}/about/gallery/${albumSlug}/${imageSlug}`, appBaseUrl),
            languages,
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

export default async function ImagePage({ params }: PageProps<'/[lang]/about/gallery/[albumSlug]/[imageSlug]'>) {
    const { albumSlug, imageSlug, lang: paramsLang } = await params;
    const lang = resolveLocale(paramsLang);
    const [dict, viewerLanguagePack] = await Promise.all([
        getLanguagePack(lang, "gallery-image-page"),
        getLanguagePack(lang, "gallery-image-viewer-component"),
    ]);

    const albumDetails = await getAlbumBySlug(albumSlug);
    const imageRecord = await getImageBySlug(imageSlug);

    if (!imageRecord) notFound();

    const albumName = albumDetails?.name ?? "Unknown Album";
    const imageSchemas = imageRecord.images.map((img, index) => {
        const isMainImage = index === 0;

        return {
            "@context": "https://schema.org",
            "@type": "ImageObject",
            "@id": `${appBaseUrl}/${lang}/about/gallery/${albumSlug}/${imageSlug}#image-${index}`,
            "name": isMainImage ? imageRecord.title : `${imageRecord.title} - Image ${index + 1}`,
            "description": imageRecord.description || `High-resolution photo from ${albumName} album`,
            "contentUrl": img.src,
            "url": `${appBaseUrl}/${lang}/about/gallery/${albumSlug}/${imageSlug}`,
            "thumbnailUrl": img.src,
            "width": img.width,
            "height": img.height,
            "uploadDate": imageRecord.timestamp.toISOString(),
            "datePublished": imageRecord.timestamp.toISOString(),
            "author": {
                "@type": "Person",
                "@id": `${appBaseUrl}/${lang}/#person`,
                "name": "Shawkat Hossain Maruf",
                "url": `${appBaseUrl}/${lang}`
            },
            "creator": {
                "@type": "Person",
                "@id": `${appBaseUrl}/${lang}/#person`
            },
            "copyrightHolder": {
                "@type": "Person",
                "@id": `${appBaseUrl}/${lang}/#person`
            },
            "copyrightYear": imageRecord.timestamp.getFullYear(),
            "license": "https://creativecommons.org/licenses/by-nc/4.0/",
            "acquireLicensePage": `${appBaseUrl}/${lang}/contact`,

            ...(imageRecord.location && {
                "contentLocation": {
                    "@type": "Place",
                    "name": imageRecord.location
                }
            }),

            "isPartOf": {
                "@type": "ImageGallery",
                "@id": `${appBaseUrl}/${lang}/about/gallery/${albumSlug}#gallery`,
                "name": albumName,
                "url": `${appBaseUrl}/${lang}/about/gallery/${albumSlug}`
            },

            ...(isMainImage && {
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `${appBaseUrl}/${lang}/about/gallery/${albumSlug}/${imageSlug}`
                }
            })
        };
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(imageSchemas).replace(/</g, '\\u003c'),
                }}
            />
            <main
                id="main-content"
                tabIndex={-1}
                role="main"
                aria-label={dict.ariaLabel?.main}
                className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 pt-24 pb-16 px-3 sm:px-4 lg:px-6 relative"
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

                <div className="container mx-auto relative z-10">
                    <div className="mb-5">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent whitespace-normal wrap-break-word">
                            {imageRecord.title}
                        </h1>
                        <div className="h-1 w-20 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 lg:items-start">
                        {/* Image Section - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                                <GalleryImageViewer
                                    images={imageRecord.images}
                                    altText={imageRecord.alt || imageRecord.title}
                                    languagePack={viewerLanguagePack}
                                />
                            </div>
                        </div>

                        {/* Details Sidebar - Takes 1 column */}
                        <aside className="lg:col-span-1 lg:h-full">
                            <dl className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 lg:top-28">
                                <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                                    <dt className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-bold">
                                        {dict.labels?.description}
                                    </dt>
                                    <dd className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed wrap-break-word m-0">
                                        {imageRecord.description || (dict.emptyState?.description)}
                                    </dd>
                                </div>

                                {imageRecord.location && (
                                    <div className="flex items-start gap-3 group">
                                        <div className="shrink-0 w-10 h-10 bg-linear-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                            <FaMapMarkerAlt className="text-white text-base" aria-hidden="true" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <dt className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                                {dict.labels?.location}
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

                                    <div className="flex-1 min-w-0">
                                        <dt className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                            {dict.labels?.dateCaptured}
                                        </dt>
                                        <dd className="m-0">
                                            <time dateTime={imageRecord.timestamp.toISOString()} className="text-xs text-gray-900 dark:text-white">
                                                {formatDateTime(imageRecord.timestamp, { showYear: true })}
                                            </time>
                                        </dd>
                                    </div>
                                </div>

                                {imageRecord.alt && (
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <dt className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                            {dict.labels?.accessibility}
                                        </dt>
                                        <dd className="text-sm text-gray-700 dark:text-gray-300 italic bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 m-0">
                                            “{imageRecord.alt}”
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </aside>
                    </div>
                </div>
            </main>
        </>
    );
}
