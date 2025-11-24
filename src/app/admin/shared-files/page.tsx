import { Metadata } from "next";
import { getAllSharedFiles } from "@/actions/storage/getAllSharedFiles";
import SharedFilesClient from "./SharedFilesClient";

export const metadata: Metadata = {
    title: "Shared Files - Admin Dashboard",
    description: "Manage public file uploads. View, download, and delete files shared by users.",
    robots: {
        index: false,
        follow: false
    }
};

export default async function SharedFilesPage() {
    const result = await getAllSharedFiles();

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SharedFilesClient initialFiles={result.files || []} error={result.error} />
            </div>
        </main>
    );
}
