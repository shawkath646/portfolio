import { Metadata } from "next";
import AdminLoginForm from "./AdminLoginForm";
// import LoginWithDevices from "@/modals/LoginWithDevices";
// import { reachableDeviceList } from "@/actions/secure/passwordlessLogin.bak/reachableDeviceList";


export const metadata: Metadata = {
    title: 'Admin Login',
    description: 'Login page for the admin panel to manage portfolio content and settings',
    robots: {
        index: false,
        follow: false
    }
}

export default async function Page() {

    //const reachableDevices = await reachableDeviceList();
    
    return (
        <main
            id="main-content"
            className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden"
            aria-labelledby="login-heading"
            tabIndex={-1}
        >
            {/* Background Elements */}
            <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
            >
                <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            {/* Login Form Component */}
            <AdminLoginForm />
            {/* <LoginWithDevices reachableDevices={reachableDevices} /> */}

            {/* Decorative Dots */}
            <div className="absolute top-2 left-2 w-4 h-4 bg-blue-500/50 rounded-full blur-sm" aria-hidden="true" />
            <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500/50 rounded-full blur-sm" aria-hidden="true" />
            <div className="absolute bottom-2 left-2 w-4 h-4 bg-purple-500/50 rounded-full blur-sm" aria-hidden="true" />
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-blue-500/50 rounded-full blur-sm" aria-hidden="true" />
        </main>

    );
}