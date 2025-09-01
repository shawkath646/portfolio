import type { Metadata } from 'next';
import AdminPage from "./AdminPage";

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'Admin panel for managing portfolio content and settings',
    robots: {
        index: false,
        follow: false,
        nocache: true,
        nosnippet: true,
        noimageindex: true,
        noarchive: true,
    },
    alternates: {
        canonical: null,
    },
    other: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex',
    },
};

export default async function Page() {
    return <AdminPage />
};