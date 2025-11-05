import { notFound } from "next/navigation";
import { getAlbumDetails, getAlbumImages } from "@/actions/gallery/getAlbumImages";
import GalleryHeader from "./GalleryHeader";
import GalleryGrid from "./GalleryGrid";

interface GalleryPageProps {
    params: Promise<{ slug: string }>;
}

export default async function GalleryPage({ params }: GalleryPageProps) {
    const { slug } = await params;
    
    const [albumDetails, initialImagesData] = await Promise.all([
        getAlbumDetails(slug),
        getAlbumImages(slug, 20)
    ]);

    if (!albumDetails) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
                <GalleryHeader 
                    name={albumDetails.name}
                    timestamp={albumDetails.timestamp}
                    imageCount={albumDetails.imageCount}
                />
                
                <GalleryGrid 
                    albumId={slug}
                    initialImages={initialImagesData.images}
                    hasMore={initialImagesData.hasMore}
                />
            </div>
        </main>
    );
}
