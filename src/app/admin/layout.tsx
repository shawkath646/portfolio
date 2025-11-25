import type { Metadata } from 'next';
import { headers } from 'next/headers';
import AdminNavbar from '@/components/navigation/AdminNavbar';

export const metadata: Metadata = {
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

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const headersList = await headers();
    const pathname = headersList.get('x-url-path') || '';
    const isLoginPage = pathname === '/admin/login';

    return (
        <>
            {!isLoginPage && <AdminNavbar />}
            {children}
        </>
    );
}
