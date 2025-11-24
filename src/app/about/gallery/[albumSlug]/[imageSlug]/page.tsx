import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAlbumDetails, getImageBySlug } from "@/actions/gallery/getAlbumImages";
import { FiArrowLeft } from "react-icons/fi";
import { FaMapMarkerAlt, FaCalendar } from "react-icons/fa";

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
            url: `https://shawkath646.pro/about/gallery/${albumSlug}/${imageSlug}`,
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

    return (
        <main className="min-h-screen bg-black">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Navigation */}
                <nav className="mb-6">
                    <Link
                        href={`/about/gallery/${albumSlug}`}
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium transition-colors"
                    >
                        <FiArrowLeft className="text-lg" />
                        <span>Back to {albumDetails.name}</span>
                    </Link>
                </nav>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image */}
                    <div className="flex-1 relative bg-gray-900 rounded-lg overflow-hidden">
                        <div className="relative aspect-video lg:aspect-auto lg:h-[75vh]">
                            <Image
                                src={image.src}
                                alt={image.alt || image.title}
                                fill
                                sizes="100vw"
                                className="object-contain"
                                placeholder="blur"
                                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGVhNWU5IiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
                                priority
                            />
                        </div>
                    </div>

                    {/* Details Sidebar */}
                    <div className="lg:w-80 bg-gray-900 rounded-lg p-6">
                        <h1 className="text-2xl font-bold text-white mb-4">{image.title}</h1>

                        {image.description && (
                            <div className="mb-4">
                                <h2 className="text-sm font-semibold text-gray-400 mb-2">Description</h2>
                                <p className="text-gray-300">{image.description}</p>
                            </div>
                        )}

                        {image.location && (
                            <div className="mb-4">
                                <h2 className="text-sm font-semibold text-gray-400 mb-2">Location</h2>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <FaMapMarkerAlt className="text-red-500" />
                                    <span>{image.location}</span>
                                </div>
                            </div>
                        )}

                        <div className="mb-4">
                            <h2 className="text-sm font-semibold text-gray-400 mb-2">Date</h2>
                            <div className="flex items-center gap-2 text-gray-300">
                                <FaCalendar className="text-blue-500" />
                                <span>
                                    {image.timestamp.toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h2 className="text-sm font-semibold text-gray-400 mb-2">Dimensions</h2>
                            <p className="text-gray-300">
                                {image.width} × {image.height} px
                            </p>
                        </div>

                        {image.alt && (
                            <div className="mb-4">
                                <h2 className="text-sm font-semibold text-gray-400 mb-2">Alt Text</h2>
                                <p className="text-gray-300 italic">{image.alt}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
