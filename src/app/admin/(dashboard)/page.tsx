import type { Metadata } from 'next';
import AdminPage from "./AdminPage";

export const metadata: Metadata = {
    title: 'Admin Panel',
};

export default async function Page() {
    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            aria-label="Admin page content"
            className="relative min-h-screen bg-gray-50 dark:bg-[#0B0F19] overflow-hidden selection:bg-blue-100 dark:selection:bg-blue-900/30"
        >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-blue-400 opacity-20 blur-[100px] dark:bg-blue-900"></div>
            </div>

            <AdminPage />
        </main>
    );
};