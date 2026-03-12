"use client";
import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

interface PasswordFormProps {
    password: string;
    setPassword: (password: string) => void;
    isLoading: boolean;
    error: string;
    onSubmit: (e: React.SubmitEvent) => void;
    stepIndicator: ReactNode;
}

export default function PasswordForm({
    password,
    setPassword,
    isLoading,
    error,
    onSubmit,
    stepIndicator
}: PasswordFormProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <header className="text-center">
                <h1
                    id="login-heading"
                    className="text-lg sm:text-xl font-bold text-white mb-0.5"
                >
                    Admin Access
                </h1>

                <p className="text-gray-400 text-xs sm:text-sm">
                    Enter your password to continue
                </p>
            </header>

            {stepIndicator}

            {/* Login Form */}
            <form
                onSubmit={onSubmit}
                className="space-y-5"
                aria-labelledby="login-heading"
            >
                {/* Password Field */}
                <div className="space-y-2">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-300"
                    >
                        Password
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
                            placeholder="Enter admin password"
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
                {error && (
                    <motion.div
                        id="password-error"
                        role="alert"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
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

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    disabled={!password || isLoading}
                    whileHover={!isLoading ? { scale: 1.02 } : undefined}
                    whileTap={!isLoading ? { scale: 0.98 } : undefined}
                    className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                    aria-busy={isLoading}
                    aria-disabled={!password || isLoading}
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
                            <span>Sign In</span>
                        </>
                    )}
                </motion.button>
            </form>

            {/* Footer */}
            <footer className="mt-8 text-center">
                <p className="text-xs text-gray-400">
                    This is a protected area. Unauthorized access is prohibited.
                </p>
            </footer>
        </motion.div>
    );
}