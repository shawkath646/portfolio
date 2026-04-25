import { Metadata } from "next";
import { getAllSharedFiles } from "@/actions/share/getSharedFiles";
import SharedFilesClient from "./SharedFilesClient";

export const metadata: Metadata = {
    title: "Shared Files",
};

export default async function SharedFilesPage(props: PageProps<'/admin/shared-files'>) {

    const searchParams = await props.searchParams;
    let startAfter = searchParams.startAfter;

    if (Array.isArray(startAfter)) {
        startAfter = startAfter[0];
    }

    const sharedFiles = await getAllSharedFiles({ startAfter, limit: 20 });

    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            aria-label="Shared files admin page content"
            className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SharedFilesClient sharedFiles={sharedFiles} />
            </div>
        </main>
    );
}
