import AdminNavbar from '@/components/navigation/AdminNavbar';

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <AdminNavbar />
            {children}
        </>
    );
}
