import { Metadata } from "next";
import { FiLock, FiUser, FiShare2 } from "react-icons/fi";
import { getSelfSharedFiles } from "@/actions/share/getSharedFiles";
import appBaseUrl from "@/data/appBaseUrl";
import FileSubmission from "./FileSubmission";
import UserUploadsList from "./UserUploadsList";


export const metadata: Metadata = {
    title: "Share Files Securely",
    description: "Easily and securely share documents, images, and media directly with Shawkat Hossain Maruf. Fast, secure file transfer with real-time progress tracking.",
    keywords: [
        "secure file drop",
        "share files",
        "send documents",
        "client file upload",
        "cloud transfer",
        "portfolio contact",
        "Shawkat Hossain Maruf"
    ],
    alternates: {
        canonical: `${appBaseUrl}/contact/share-files`,
    },
    robots: {
        index: true,
        follow: true
    }
};

export default async function SharePage() {

    const selfSharedFiles = await getSelfSharedFiles();

    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            aria-label="Share page content"
            aria-labelledby="page-title"
            className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 py-20 px-4"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto relative z-10">
                <header className="text-center mt-5 mb-8">
                    <div className="flex space-x-2 justify-center items-center mb-2">
                        <div className="inline-flex items-center gap-2 mb-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <FiShare2 className="text-2xl text-blue-600 dark:text-blue-400" aria-hidden="true" />
                            </div>
                        </div>

                        <h1 id="page-title" className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
                            Share Files
                        </h1>
                    </div>

                    <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                        Share documents, images, videos, and multimedia files with Shawkat Hossain Maruf.
                    </p>

                    <div className="flex flex-wrap gap-3 justify-center mb-6" role="list" aria-label="Upload features">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 dark:border-gray-700" role="listitem">
                            <FiLock className="text-green-600 dark:text-green-400" aria-hidden="true" />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Secure & Encrypted
                            </span>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 dark:border-gray-700" role="listitem">
                            <FiUser className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Multi-File Upload
                            </span>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 dark:border-gray-700" role="listitem">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                500MB Max Per File
                            </span>
                        </div>
                    </div>
                </header>

                <FileSubmission />

                {selfSharedFiles.length && (
                    <UserUploadsList sharedFiles={selfSharedFiles} />
                )}
            </div>
        </main>
    );
}
