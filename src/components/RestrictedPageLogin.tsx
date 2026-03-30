"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiEye, FiEyeOff, FiShield, FiArrowRight } from "react-icons/fi";
import { handleGenericLogin } from "@/actions/genericAuth/authActions";
import { AccessScopeLabel } from "@/types/genericAuth.types";
import RecaptchaV3Client from "../lib/GoogleRecaptchaV3/RecaptchaV3Client";

interface RestrictedPageLoginProps {
    accessScope: AccessScopeLabel;
    title: string;
    description: string;
    icon?: React.ReactNode;
}

export default function RestrictedPageLogin({
    accessScope,
    title,
    description,
    icon
}: RestrictedPageLoginProps) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const [recaptchaTrigger, setRecaptchaTrigger] = useState(0);
    const recaptchaPromiseRef = useRef<{
        resolve: (token: string | null) => void;
        reject: (error: Error) => void;
        timeoutId: ReturnType<typeof setTimeout> | null;
    } | null>(null);

    const requestRecaptchaToken = () => {
        if (recaptchaPromiseRef.current) {
            if (recaptchaPromiseRef.current.timeoutId) {
                clearTimeout(recaptchaPromiseRef.current.timeoutId);
            }

            recaptchaPromiseRef.current.resolve(null);
            recaptchaPromiseRef.current = null;
        }

        return new Promise<string | null>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                recaptchaPromiseRef.current = null;
                reject(new Error("Recaptcha timeout"));
            }, 8000);

            recaptchaPromiseRef.current = { resolve, reject, timeoutId };
            setRecaptchaTrigger((prev) => prev + 1);
        });
    };

    const handleRecaptchaToken = (nextToken: string | null) => {
        if (recaptchaPromiseRef.current) {
            if (recaptchaPromiseRef.current.timeoutId) {
                clearTimeout(recaptchaPromiseRef.current.timeoutId);
            }

            recaptchaPromiseRef.current.resolve(nextToken);
            recaptchaPromiseRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (recaptchaPromiseRef.current) {
                if (recaptchaPromiseRef.current.timeoutId) {
                    clearTimeout(recaptchaPromiseRef.current.timeoutId);
                }

                recaptchaPromiseRef.current.resolve(null);
                recaptchaPromiseRef.current = null;
            }
        };
    }, []);


    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading) return;

        setError("");
        setIsLoading(true);

        try {
            const token = await requestRecaptchaToken();
            if (!token) throw new Error("recaptcha");



            const response = await handleGenericLogin(accessScope, password, token);

            if (!response.success) {
                setError(response.message);
                return;
            }

            router.refresh();
        } catch (err) {
            if (err instanceof Error && err.message === "recaptcha") {
                setError("reCAPTCHA verification failed. Please try again.");
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center relative overflow-hidden px-4 font-sans transition-colors duration-300 [&_.grecaptcha-badge]:flex">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[120px]" />
                {/* Grid texture adapted for both modes */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-10" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-100 relative z-10"
            >
                {/* Main Card */}
                <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden transition-colors duration-300">

                    {/* Compact Header */}
                    <div className="p-6 pb-2 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-tr from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 mb-4 text-white">
                            {icon || <FiLock className="text-xl" />}
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">
                            {title}
                        </h1>
                        <p className="text-gray-500 dark:text-slate-400 text-sm mt-1 transition-colors">
                            {description}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="h-4 w-4 text-gray-400 dark:text-slate-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter access password"
                                    className="w-full pl-9 pr-10 py-2.5 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
                                >
                                    {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Only render reCAPTCHA when form is visible */}
                        <RecaptchaV3Client
                            action="restricted_page_login"
                            onToken={handleRecaptchaToken}
                            trigger={recaptchaTrigger}
                        />

                        {/* Error Message */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded px-3 py-2"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                                w-full py-2.5 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                                text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20
                                transition-all duration-200 transform active:scale-[0.98]
                                flex items-center justify-center gap-2
                                ${isLoading ? "opacity-70 cursor-wait" : ""}
                            `}
                        >
                            {isLoading ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Unlock Access <FiArrowRight className="opacity-70" />
                                </>
                            )}
                        </button>

                        {/* Footer Links */}
                        <div className="pt-4 mt-2 flex items-center justify-between text-xs text-gray-400 dark:text-slate-500 border-t border-gray-100 dark:border-slate-800/50 transition-colors">
                            <Link href="/contact#contact-me" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                                Request password
                            </Link>
                            <a href="https://cloudburstlab.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-gray-600 dark:hover:text-slate-300 transition-colors opacity-70">
                                <span className="scale-75 origin-right">
                                    <FiShield />
                                </span>
                                Secured by
                                <Image
                                    src="https://cloudburstlab.vercel.app/api/branding/logo?variant=transparent"
                                    alt="Cloudburst Lab Transparent Logo"
                                    height={25}
                                    width={40}
                                />
                            </a>
                        </div>
                    </form>
                </div>
            </motion.div>
        </main>
    );
}