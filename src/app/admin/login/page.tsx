import { Metadata } from "next";
import AdminLoginPage from "./AdminLoginPage";

export const metadata: Metadata = {
    title: 'Admin Login',
    description: 'Login page for the admin panel to manage portfolio content and settings'
}

export default async function Page() {
    return <AdminLoginPage />;
}