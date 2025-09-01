import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAllowedPaths } from '@/data/pathsConfig';

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
    const cookieStore = await cookies();
    
    const adminAuth = cookieStore.get('admin_logged_in');

    const currentPath = headersList.get('x-next-pathname') || '';
    const isAllowedPath = adminAllowedPaths.some(path => currentPath.startsWith(path));

    if (!isAllowedPath && (!adminAuth || adminAuth.value !== 'true')) {
        //redirect('/admin/login');
    }

    return <>{children}</>;
}