import { Metadata } from "next";
import { FiLock, FiUser, FiShare2 } from "react-icons/fi";
import { getSelfSharedFiles } from "@/actions/share/getSharedFiles";
import appBaseUrl from "@/data/appBaseUrl";
import { getLanguagePack } from "@/lib/locale";
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
        canonical: new URL("/contact/share-files", appBaseUrl),
    },
    robots: {
        index: true,
        follow: true
    }
};

export default async function SharePage({
    params,
}: Readonly<{
    params: Promise<{ lang: string }>;
}>) {

    const { lang } = await params;

    const [
        selfSharedFiles,
        pageLanguagePack,
        fileSubmissionLanguagePack,
        userUploadsLanguagePack,
    ] = await Promise.all([
        getSelfSharedFiles(),
        getLanguagePack(lang, "contact-share-files-page"),
        getLanguagePack(lang, "contact-share-files-file-submission-component"),
        getLanguagePack(lang, "contact-share-files-user-uploads-list-component"),
    ]);

    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            aria-label={pageLanguagePack.mainAriaLabel}
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
                            {pageLanguagePack.title}
                        </h1>
                    </div>

                    <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                        {pageLanguagePack.description}
                    </p>

                    <div className="flex flex-wrap gap-3 justify-center mb-6" role="list" aria-label={pageLanguagePack.featuresAriaLabel}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 dark:border-gray-700" role="listitem">
                            <FiLock className="text-green-600 dark:text-green-400" aria-hidden="true" />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {pageLanguagePack.featureSecureEncrypted}
                            </span>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 dark:border-gray-700" role="listitem">
                            <FiUser className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {pageLanguagePack.featureMultiUpload}
                            </span>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 dark:border-gray-700" role="listitem">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {pageLanguagePack.featureMaxPerFile}
                            </span>
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
                    <div className="lg:col-span-7 xl:col-span-8">
                        <FileSubmission languagePack={fileSubmissionLanguagePack} />
                    </div>

                    <aside className="lg:col-span-5 lg:sticky lg:mt-10 xl:col-span-4">
                        <UserUploadsList sharedFiles={selfSharedFiles} languagePack={userUploadsLanguagePack} />
                    </aside>
                </section>
            </div>
        </main>
    );
}
