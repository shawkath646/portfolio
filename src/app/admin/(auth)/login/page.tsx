import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/actions/authentication/authActions";
import LoginPageContainer from "./LoginPageContainer";


export const metadata: Metadata = {
    title: 'Login',
}

export default async function Page() {

    const adminSession = await getAuthSession();
    if (adminSession) redirect("/admin");
    
    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            aria-label="Admin login page content"
            className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden"
            aria-labelledby="login-heading"
        >
            <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
            >
                <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <Suspense fallback={
                <div className="relative w-full max-w-md">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 flex items-center justify-center min-h-100">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            }>
                <LoginPageContainer />
            </Suspense>

            <div className="absolute top-2 left-2 w-4 h-4 bg-blue-500/50 rounded-full blur-sm" aria-hidden="true" />
            <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500/50 rounded-full blur-sm" aria-hidden="true" />
            <div className="absolute bottom-2 left-2 w-4 h-4 bg-purple-500/50 rounded-full blur-sm" aria-hidden="true" />
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-blue-500/50 rounded-full blur-sm" aria-hidden="true" />
        </main>
    );
}