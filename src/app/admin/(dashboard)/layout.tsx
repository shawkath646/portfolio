import AdminNavbar from '@/components/navigation/AdminNavbar';
import { ToastProvider } from "@/components/Toast";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ToastProvider>
            <AdminNavbar />
            {children}
        </ToastProvider>
    );
}
