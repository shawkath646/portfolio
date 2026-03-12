import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getAlbumById, getImageFromAlbum } from "@/actions/gallery/getGalleryData";
import NumberPagination from "@/components/navigation/NumberPagination";
import GalleryGrid from "./GalleryGrid";
import GalleryHeader from "./GalleryHeader";

const IMAGES_PER_PAGE = 20;

export const generateMetadata = async (
    { params, searchParams }: PageProps<'/admin/gallery/[id]'>
): Promise<Metadata> => {
    const { id } = await params;
    const requestedPage = Number((await searchParams).page) || 1;

    const albumDetails = await getAlbumById(id);

    if (!albumDetails) {
        return {
            title: "Album Not Found",
            description: "The requested gallery album could not be found in the admin panel."
        };
    }

    return {
        title: `${albumDetails.name} (Page ${requestedPage})`,
        description: `Manage the "${albumDetails.name}" gallery album in the admin dashboard.`
    };
};


export default async function GalleryPage({ params, searchParams }: PageProps<'/admin/gallery/[id]'>) {
    const { id } = await params;

    const paramsList = await searchParams;

    const requestedPage = Number(paramsList.page) || 1;
    const selectedImageId = paramsList.selected;

    const [albumDetails, imagesResponse] = await Promise.all([
        getAlbumById(id),
        getImageFromAlbum(id, { page: requestedPage, limit: IMAGES_PER_PAGE })
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
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
                <GalleryHeader
                    name={albumDetails.name}
                    timestamp={albumDetails.timestamp}
                    imageCount={albumDetails.imageCount}
                />

                <GalleryGrid images={imagesResponse.images} />

                {selectedImage && (
                    <DynamicImageViewModal image={selectedImage} />
                )}

                <NumberPagination
                    basePath={`/admin/gallery/${id}`}
                    currentPage={imagesResponse.page}
                    totalPages={imagesResponse.totalItems}
                />
            </div>
        </main>
    );
}
