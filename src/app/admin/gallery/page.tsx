import UploadForm from "./UploadForm";
import GalleryHeader from "./GalleryHeader";

export default function AdminGalleryPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 py-8 px-4 sm:px-6 lg:px-8">
            <GalleryHeader />
            <div className="mt-8">
                <UploadForm />
            </div>
        </main>
    );
}
