import { Metadata } from "next";
import SharePageClient from "./SharePageClient";
import { FiUpload, FiLock, FiUser } from "react-icons/fi";

export const metadata: Metadata = {
    title: "File Upload - Shawkat Hossain Maruf",
    description: "Upload and share files securely. Submit documents, images, videos, and more with real-time progress tracking. Files are accessible from the admin panel.",
    keywords: [
        "file upload",
        "file sharing",
        "upload files",
        "share documents",
        "cloud storage",
        "file transfer",
        "secure upload",
        "Shawkat Hossain Maruf"
    ],
    robots: {
        index: true,
        follow: true
    },
    openGraph: {
        title: "File Upload - Shawkat Hossain Maruf",
        description: "Upload and share files securely with real-time progress tracking",
        type: "website"
    }
};

export default function SharePage() {
    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            aria-labelledby="page-title"
            className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 py-20 px-4"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <header className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <FiUpload className="text-3xl text-blue-600 dark:text-blue-400" aria-hidden="true" />
                        </div>
                    </div>
                    
                    <h1 id="page-title" className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Upload Files
                    </h1>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                        Share documents, images, videos, and more. Upload multiple files with real-time progress tracking.
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-4 justify-center mb-8" role="list" aria-label="Upload features">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 dark:border-gray-700" role="listitem">
                            <FiLock className="text-green-600 dark:text-green-400" aria-hidden="true" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Secure & Encrypted
                            </span>
                        </div>
                        
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 dark:border-gray-700" role="listitem">
                            <FiUser className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Multi-File Upload
                            </span>
                        </div>
                        
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 dark:border-gray-700" role="listitem">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                100MB Max Per File
                            </span>
                        </div>
                    </div>
                </header>

                <SharePageClient />

                {/* Usage Guidelines */}
                <aside 
                    className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
                    role="note"
                    aria-label="Upload guidelines"
                >
                    <h2 className="text-base font-bold text-blue-900 dark:text-blue-200 mb-3">
                        Upload Guidelines
                    </h2>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                            <span>Upload multiple files simultaneously with drag-and-drop or file selection</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                            <span>Maximum file size is 100MB per file</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                            <span>Track real-time upload progress with speed and time remaining</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                            <span>Add optional notes to provide context for each file</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                            <span>Your uploads are tracked via cookies - you can see them anytime you return</span>
                        </li>
                    </ul>
                </aside>
            </div>
        </main>
    );
}
