import type { Metadata } from 'next';
import AdminPage from "./AdminPage";

export const metadata: Metadata = {
    title: 'Dashboard',
};

export default async function Page() {

    return <AdminPage />
};