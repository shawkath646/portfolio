"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import getSiteAccess from "@/actions/secure/getSiteAccess";
import { FiLock, FiEye, FiEyeOff, FiShield, FiMail, FiInfo } from "react-icons/fi";
import { SiteCodeType } from "@/types";

interface RestrictedPageLoginProps {
    siteCode: SiteCodeType;
    title: string;
    description: string;
    icon?: React.ReactNode;
}

export default function RestrictedPageLogin({
    siteCode,
    title,
    description,
    icon
}: RestrictedPageLoginProps) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await getSiteAccess(siteCode, password);
            if (!response.success) {
                setError(response.message);
            } else {
                // Refresh the page to show authenticated content
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        }

        setIsLoading(false);
    };

    return (
        <main
            className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden px-4"
            role="main"
            aria-labelledby="restricted-heading"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            {/* Login Card */}
            <motion.section
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                <div
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
                    role="region"
                    aria-labelledby="restricted-heading"
                >
                    {/* Header Section with Gradient */}
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/10 p-6 text-center">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-3 shadow-lg shadow-blue-500/50"
                            aria-hidden="true"
                        >
                            {icon || <FiLock className="text-2xl text-white" />}
                        </motion.div>

                        <motion.h1
                            id="restricted-heading"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-bold text-white mb-1"
                        >
                            {title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-gray-300 text-sm"
                        >
                            {description}
                        </motion.p>
                    </div>

                    {/* Info Notice */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mx-6 mt-5 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3"
                    >
                        <div className="flex items-start gap-2.5">
                            <FiInfo className="text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-gray-300 leading-relaxed">
                                <p className="mb-1.5">
                                    To access this content, you need permission from <span className="font-semibold text-white">Shawkat Hossain Maruf</span>.
                                </p>
                                <p>
                                    If you&apos;re curious,{" "}
                                    <Link 
                                        href="/contact" 
                                        className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors inline-flex items-center gap-1"
                                    >
                                        contact me
                                        <FiMail className="text-xs" />
                                    </Link>
                                    {" "}to request a password.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Login Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        onSubmit={handleSubmit}
                        className="p-6 space-y-5"
                    >
                        {/* Password Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-300"
                            >
                                Access Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
                                    <FiLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter access password"
                                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    required
                                    autoComplete="current-password"
                                    aria-describedby={error ? "password-error" : undefined}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    id="password-error"
                                    role="alert"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className={`p-3 ${error.includes("rate") || error.includes("attempts") ? "bg-yellow-500/20 border-yellow-500/30" : "bg-red-500/20 border-red-500/30"} border rounded-lg`}
                                >
                                    <p className={`${error.includes("rate") || error.includes("attempts") ? "text-yellow-200" : "text-red-200"} text-sm`}>
                                        {error.split('. ').map((sentence, i) => (
                                            <span key={i} className={i > 0 && (sentence.includes("attempts") || sentence.includes("last attempt")) ? "font-semibold block mt-1" : ""}>
                                                {sentence}{i < error.split('. ').length - 1 && '. '}
                                            </span>
                                        ))}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={!password || isLoading}
                            whileHover={!isLoading ? { scale: 1.02 } : undefined}
                            whileTap={!isLoading ? { scale: 0.98 } : undefined}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3.5 px-6 rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                            aria-busy={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                                        role="progressbar"
                                        aria-label="Loading"
                                    />
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    <FiLock aria-hidden="true" />
                                    <span>Unlock Access</span>
                                </>
                            )}
                        </motion.button>
                    </motion.form>

                    {/* Security Footer */}
                    <motion.footer
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="border-t border-white/10 bg-gradient-to-r from-slate-900/50 to-indigo-900/50 px-6 py-4"
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-2 text-gray-400">
                                <FiShield className="text-green-400 text-sm" />
                                <span className="text-xs font-medium">Secured by</span>
                            </div>
                            <a 
                                href="https://cloudburstlab.vercel.app" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center hover:opacity-80 transition-opacity duration-200"
                            >
                                <Image
                                    src="https://cloudburstlab.vercel.app/api/branding/logo?variant=transparent"
                                    alt="CloudBurst Lab"
                                    width={120}
                                    height={30}
                                    className="h-5 w-auto"
                                />
                            </a>
                        </div>
                    </motion.footer>
                </div>
            </motion.section>

            {/* Decorative Dots */}
            <div className="absolute top-2 left-2 w-4 h-4 bg-blue-500/50 rounded-full blur-sm" aria-hidden="true" />
            <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500/50 rounded-full blur-sm" aria-hidden="true" />
            <div className="absolute bottom-2 left-2 w-4 h-4 bg-purple-500/50 rounded-full blur-sm" aria-hidden="true" />
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-blue-500/50 rounded-full blur-sm" aria-hidden="true" />
        </main>
    );
}
