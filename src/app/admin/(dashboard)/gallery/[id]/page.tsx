import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getAlbumById, getImageFromAlbum } from "@/actions/gallery/getGalleryData";
import SimplePagination from "@/components/navigation/SimplePagination";
import { buildCursorUrl } from "@/utils/cursor";
import { getSingleSearchParam } from "@/utils/string";
import GalleryGrid from "./GalleryGrid";
import GalleryHeader from "./GalleryHeader";


export const generateMetadata = async (
    { params, searchParams }: PageProps<'/admin/gallery/[id]'>
): Promise<Metadata> => {
    const { id } = await params;
    await searchParams;

    const albumDetails = await getAlbumById(id);

    if (!albumDetails) {
        return {
            title: "Album Not Found",
            description: "The requested gallery album could not be found in the admin panel."
        };
    }

    return {
        title: `${albumDetails.name} Gallery Preview`,
        description: `Manage the "${albumDetails.name}" gallery album in the admin dashboard.`
    };
};


export default async function GalleryPage({ params, searchParams }: PageProps<'/admin/gallery/[id]'>) {
    const { id } = await params;

    const paramsList = await searchParams;

    const startAfter = getSingleSearchParam(paramsList.startAfter);
    const selectedImageId = paramsList.selected;

    const [albumDetails, imagesResponse] = await Promise.all([
        getAlbumById(id),
        getImageFromAlbum(id, startAfter)
    ]);

    if (!albumDetails) {
        notFound();
    }

    const selectedImage = imagesResponse.images.find(img => img.id === selectedImageId);

    const DynamicImageViewModal = dynamic(() => import("./ImageViewModal"));

    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            aria-label="Admin album page content"
            className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900"
        >
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6">
                <GalleryHeader
                    name={albumDetails.name}
                    timestamp={albumDetails.timestamp}
                    imageCount={albumDetails.imageCount}
                />

                <p className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Page {imagesResponse.page} of {imagesResponse.totalPages}
                </p>

                <GalleryGrid images={imagesResponse.images} />

                {selectedImage && (
                    <DynamicImageViewModal image={selectedImage} />
                )}

                {(imagesResponse.hasPrev || imagesResponse.hasMore) && (
                    <div className="mt-8">
                        <SimplePagination
                            prevPage={
                                imagesResponse.hasPrev
                                    ? buildCursorUrl(`/admin/gallery/${id}`, imagesResponse.prevStartAfter)
                                    ?? `/admin/gallery/${id}`
                                    : undefined
                            }
                            nextPage={buildCursorUrl(`/admin/gallery/${id}`, imagesResponse.nextStartAfter)}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
