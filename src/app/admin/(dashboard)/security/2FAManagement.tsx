"use client";
import { useState, useRef, useTransition, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { FiShield, FiCheck, FiCopy, FiAlertTriangle } from "react-icons/fi";
import { generate2FASecret, confirm2FASetup, disable2FA } from "@/actions/authentication/manage2FA";

type SetupStep = "idle" | "scanning" | "verifying";

interface TwoFAManagementPageProps {
    isEnabled: boolean;
    enabledOn: Date | null;
}

export default function TwoFAManagement(props: TwoFAManagementPageProps) {
    const [isPending, startTransition] = useTransition();
    const [isEnabled, setIsEnabled] = useState<boolean>(props.isEnabled);
    const [setupStep, setSetupStep] = useState<SetupStep>("idle");
    const [secret, setSecret] = useState("");
    const [otpauthUri, setOtpauthUri] = useState("");
    const [code, setCode] = useState<string[]>(Array(6).fill(""));
    const [copied, setCopied] = useState(false);
    const [status, setStatus] = useState<{
        type: "success" | "error" | "idle";
        message: string;
    }>({ type: "idle", message: "" });
    const [showDisableConfirm, setShowDisableConfirm] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (setupStep === "verifying") {
            inputRefs.current[0]?.focus();
        }
    }, [setupStep]);

    const handleStartSetup = useCallback(() => {
        setStatus({ type: "idle", message: "" });
        startTransition(async () => {
            const res = await generate2FASecret();
            if (res.success && res.secret && res.otpauthUri) {
                setSecret(res.secret);
                setOtpauthUri(res.otpauthUri);
                setSetupStep("scanning");
            } else {
                setStatus({ type: "error", message: res.message });
            }
        });
    }, []);

    const handleCopySecret = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(secret);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback: select the text
        }
    }, [secret]);

    const handleProceedToVerify = useCallback(() => {
        setSetupStep("verifying");
        setCode(Array(6).fill(""));
        setStatus({ type: "idle", message: "" });
    }, []);

    const handleVerify = useCallback((verificationCode: string) => {
        startTransition(async () => {
            const res = await confirm2FASetup(secret, verificationCode);
            if (res.success) {
                setStatus({ type: "success", message: res.message });
                setIsEnabled(true);
                setSetupStep("idle");
                setSecret("");
                setOtpauthUri("");
                setCode(Array(6).fill(""));
            } else {
                setStatus({ type: "error", message: res.message });
                setCode(Array(6).fill(""));
                setTimeout(() => inputRefs.current[0]?.focus(), 10);
            }
        });
    }, [secret]);

    const handleCodeChange = useCallback((index: number, value: string) => {
        if (value && !/^\d$/.test(value)) return;

        setCode(prev => {
            const newCode = [...prev];
            newCode[index] = value;

            // Auto-submit when complete
            if (newCode.every(d => d !== "")) {
                handleVerify(newCode.join(""));
            }
            return newCode;
        });

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }, [handleVerify]);

    const handleCodeKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }, [code]);

    const handleCodePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").match(/\d/g);
        if (!pastedData) return;

        const digits = pastedData.slice(0, 6);
        const newCode = Array(6).fill("");

        digits.forEach((d, i) => { newCode[i] = d; });
        setCode(newCode);

        const focusIdx = Math.min(digits.length, 5);
        inputRefs.current[focusIdx]?.focus();

        if (digits.length === 6) {
            handleVerify(newCode.join(""));
        }
    }, [handleVerify]);

    const handleDisable = useCallback(() => {
        startTransition(async () => {
            const res = await disable2FA();
            if (res.success) {
                setIsEnabled(false);
                setShowDisableConfirm(false);
                setStatus({ type: "success", message: res.message });
            } else {
                setStatus({ type: "error", message: res.message });
            }
        });
    }, []);

    const handleCancelSetup = useCallback(() => {
        setSetupStep("idle");
        setSecret("");
        setOtpauthUri("");
        setCode(Array(6).fill(""));
        setStatus({ type: "idle", message: "" });
    }, []);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-purple-100/30 dark:border-purple-800/30 shadow-lg"
            aria-labelledby="2fa-title"
        >
            {/* Header */}
            <header className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <div
                        className="p-2 bg-linear-to-br from-indigo-500 to-blue-600 rounded-xl backdrop-blur-sm shadow-md"
                        aria-hidden="true"
                    >
                        <FiShield className="text-white text-lg" />
                    </div>
                    <div>
                        <h2 id="2fa-title" className="text-lg font-bold text-gray-900 dark:text-white">
                            Two-Factor Authentication
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Authenticator app (TOTP)
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isEnabled
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                >
                    {isEnabled ? "Enabled" : "Disabled"}
                </span>
            </header>

            {/* Status Messages */}
            <AnimatePresence>
                {status.type !== "idle" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`mb-4 p-3 rounded-lg border ${status.type === "success"
                            ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/40"
                            : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/40"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {status.type === "success" ? (
                                <FiCheck className="text-green-600 dark:text-green-400 shrink-0" />
                            ) : (
                                <FiAlertTriangle className="text-red-600 dark:text-red-400 shrink-0" />
                            )}
                            <p className={`text-sm ${status.type === "success"
                                ? "text-green-700 dark:text-green-300"
                                : "text-red-700 dark:text-red-300"
                                }`}>
                                {status.message}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {/* Idle State — show enable/disable */}
                {setupStep === "idle" && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {isEnabled ? (
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-5 mb-2">
                                    Your account is protected with an authenticator app. A 6-digit code will be required during login.
                                </p>

                                {props.enabledOn && (
                                    <p className="text-sm text-green-700 dark:text-green-400 mb-4 font-medium flex items-center gap-1.5">
                                        <FiCheck className="shrink-0" />
                                        Enabled on: {new Intl.DateTimeFormat("en-US", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        }).format(props.enabledOn)}
                                    </p>
                                )}

                                <AnimatePresence>
                                    {showDisableConfirm ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg"
                                        >
                                            <div className="flex items-start gap-2 mb-3">
                                                <FiAlertTriangle className="text-red-500 mt-0.5 shrink-0" />
                                                <p className="text-sm text-red-700 dark:text-red-300">
                                                    Disabling 2FA will make your account less secure. Are you sure?
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleDisable}
                                                    disabled={isPending}
                                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {isPending ? "Disabling..." : "Yes, Disable"}
                                                </button>
                                                <button
                                                    onClick={() => setShowDisableConfirm(false)}
                                                    className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-wrap gap-2 mt-10"
                                        >
                                            <button
                                                onClick={handleStartSetup}
                                                disabled={isPending}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                Reconfigure
                                            </button>
                                            <button
                                                onClick={() => setShowDisableConfirm(true)}
                                                className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                Disable 2FA
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                    Add an extra layer of security by requiring a code from your authenticator app during login.
                                </p>
                                <button
                                    onClick={handleStartSetup}
                                    disabled={isPending}
                                    className="px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all disabled:opacity-50"
                                >
                                    {isPending ? "Generating..." : "Set Up Authenticator"}
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Scanning Step — show QR + secret */}
                {setupStep === "scanning" && (
                    <motion.div
                        key="scanning"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                    Step 1: Scan QR Code
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Open your authenticator app (Google Authenticator, Authy, etc.) and scan this QR code.
                                </p>
                            </div>

                            {/* Secure Client-Side QR Code */}
                            <div className="flex justify-center">
                                <div className="bg-white rounded-xl p-3 shadow-md border border-gray-100 dark:border-gray-700">
                                    <QRCodeSVG
                                        value={otpauthUri}
                                        size={180}
                                        className="rounded"
                                    />
                                </div>
                            </div>

                            {/* Manual Secret */}
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                                    Or enter this key manually:
                                </p>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700/60 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200 select-all break-all">
                                        {secret}
                                    </code>
                                    <button
                                        type="button"
                                        onClick={handleCopySecret}
                                        className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
                                        title="Copy secret"
                                    >
                                        {copied ? (
                                            <FiCheck className="text-green-500" />
                                        ) : (
                                            <FiCopy />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                    onClick={handleCancelSetup}
                                    className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleProceedToVerify}
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                                >
                                    Next: Verify Code
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Verifying Step — enter code */}
                {setupStep === "verifying" && (
                    <motion.div
                        key="verifying"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                    Step 2: Verify Setup
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Enter the 6-digit code shown in your authenticator app to confirm setup.
                                </p>
                            </div>

                            {/* Code Input */}
                            <div className="flex gap-2 justify-center" onPaste={handleCodePaste}>
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                                        disabled={isPending}
                                        className="w-10 h-12 sm:w-11 sm:h-13 text-center text-lg sm:text-xl font-bold bg-gray-100 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                                        aria-label={`Digit ${index + 1}`}
                                    />
                                ))}
                            </div>

                            {isPending && (
                                <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm">
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    <span>Verifying...</span>
                                </div>
                            )}

                            <button
                                onClick={() => setSetupStep("scanning")}
                                className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors"
                            >
                                ← Back
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}