import { getGalleryAlbums } from "@/actions/gallery/albumManagement";
import AlbumsEditor from "./AlbumsEditor";
import PicUploadHeader from "./PicUploadHeader";
import UploadForm from "./UploadForm";


export default async function AdminGalleryPage() {

    const albumList = await getGalleryAlbums();

    return (
        <main className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 py-4 px-3 sm:px-4 lg:px-6">
            <div className="max-w-7xl mx-auto">
                <PicUploadHeader />
                
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                    <div className="lg:col-span-2">
                        <UploadForm albumList={albumList} />
                    </div>
                    
                    <div className="lg:col-span-1 lg:sticky lg:top-4">
                        <div className="h-full lg:max-h-[calc(100vh-8rem)]">
                            <AlbumsEditor albumList={albumList} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
