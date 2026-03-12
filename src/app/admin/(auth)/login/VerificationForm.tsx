"use client";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { FiShield } from "react-icons/fi";

interface VerificationFormProps {
    isLoading: boolean;
    error: string;
    onSubmit: (code: string) => void;
    stepIndicator: ReactNode;
}

export default function VerificationForm({
    isLoading,
    error,
    onSubmit,
    stepIndicator
}: VerificationFormProps) {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (value && !/^\d$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newCode.every(digit => digit !== "") && !isLoading) {
            onSubmit(newCode.join(""));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        const digits = pastedData.match(/\d/g) || [];

        const newCode = [...code];
        digits.forEach((digit, index) => {
            if (index < 6) {
                newCode[index] = digit;
            }
        });
        setCode(newCode);

        const lastIndex = Math.min(digits.length, 5);
        inputRefs.current[lastIndex]?.focus();

        if (newCode.every(digit => digit !== "") && !isLoading) {
            onSubmit(newCode.join(""));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.every(digit => digit !== "") && !isLoading) {
            onSubmit(code.join(""));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <header className="text-center">
                <h1 className="text-lg sm:text-xl font-bold text-white mb-0.5">
                    Two-Factor Authentication
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm">
                    Enter the 6-digit code from your authenticator app
                </p>
            </header>

            {stepIndicator}

            {/* Error Message */}
            {error && (
                <motion.div
                    role="alert"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
                >
                    <p className="text-red-200 text-sm">{error}</p>
                </motion.div>
            )}

            {/* Code Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <div className="flex gap-1.5 sm:gap-2 justify-center" onPaste={handlePaste}>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-10 h-12 sm:w-11 sm:h-13 text-center text-lg sm:text-xl font-bold bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                aria-label={`Digit ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <motion.button
                    type="submit"
                    disabled={!code.every(digit => digit !== "") || isLoading}
                    whileHover={!isLoading ? { scale: 1.02 } : undefined}
                    whileTap={!isLoading ? { scale: 0.98 } : undefined}
                    className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                    aria-busy={isLoading}
                >
                    {isLoading ? (
                        <>
                            <div
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                                role="progressbar"
                                aria-label="Loading"
                            />
                            <span>Verifying...</span>
                        </>
                    ) : (
                        <>
                            <FiShield aria-hidden="true" />
                            <span>Verify Code</span>
                        </>
                    )}
                </motion.button>
            </form>

            {/* Footer */}
            <footer className="mt-4 text-center">
                <p className="text-[10px] sm:text-xs text-gray-500">
                    Code refreshes every 30 seconds
                </p>
            </footer>
        </motion.div>
    );
}
