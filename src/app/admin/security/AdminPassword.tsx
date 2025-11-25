"use client";
import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { FiKey,  FiEye, FiEyeOff, FiCheck, FiAlertTriangle, FiShield } from "react-icons/fi";
import changeSitePassword from "@/actions/secure/changeAdminPassword";

export default function AdminPassword() {
    const [isPending, startTransition] = useTransition();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState<{
        type: "success" | "error" | "idle";
        message: string;
    }>({ type: "idle", message: "" });

    // Password validation
    const passwordErrors = {
        length: newPassword.length < 8,
        uppercase: !/[A-Z]/.test(newPassword),
        lowercase: !/[a-z]/.test(newPassword),
        number: !/\d/.test(newPassword),
        special: !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
        match: newPassword !== confirmPassword && confirmPassword !== ""
    };

    const isValid = !Object.values(passwordErrors).some(Boolean) && newPassword === confirmPassword;

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isValid) {
            setStatus({
                type: "error",
                message: "Please fix the validation errors before submitting."
            });
            return;
        }

        startTransition(async () => {
            try {
                const result = await changeSitePassword(newPassword);
                
                if (result.success) {
                    setStatus({
                        type: "success",
                        message: "Admin password successfully updated!"
                    });
                    setNewPassword("");
                    setConfirmPassword("");
                } else {
                    setStatus({
                        type: "error",
                        message: result.message || "Failed to update password. Please try again."
                    });
                }
            } catch (error) {
                setStatus({
                    type: "error",
                    message: "Failed to update password. Please try again later."
                });
            }
        });
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
            aria-labelledby="admin-password-title"
        >
            <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-purple-100/30 dark:border-purple-800/30 shadow-lg">
                <header className="flex items-center gap-3 mb-4">
                    <div 
                        className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl backdrop-blur-sm shadow-md"
                        aria-hidden="true"
                    >
                        <FiShield className="text-lg text-white" />
                    </div>
                    <div>
                        <h2 
                            id="admin-password-title"
                            className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-800 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-0.5"
                        >
                            Admin Password
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                            Change the main administrator password
                        </p>
                    </div>
                </header>

                {/* Status Message */}
                {status.type !== "idle" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className={`mb-4 p-3 rounded-lg backdrop-blur-sm ${
                            status.type === "success" 
                                ? "bg-green-100/80 dark:bg-green-900/20 border border-green-200/50 dark:border-green-700/30" 
                                : "bg-red-100/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-700/30"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            {status.type === "success" ? (
                                <FiCheck className="text-green-600 dark:text-green-400 text-sm" />
                            ) : (
                                <FiAlertTriangle className="text-red-600 dark:text-red-400 text-sm" />
                            )}
                            <p className={`text-xs font-medium ${
                                status.type === "success"
                                    ? "text-green-700 dark:text-green-300"
                                    : "text-red-700 dark:text-red-300"
                            }`}>
                                {status.message}
                            </p>
                        </div>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* New Password */}
                    <div className="space-y-1.5">
                        <label htmlFor="new-password" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full pr-10 py-2 px-3 text-sm bg-white/90 dark:bg-gray-900/90 border border-purple-100 dark:border-purple-900/50 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-pink-400 focus:border-transparent transition-all"
                                placeholder="Enter new admin password"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <label htmlFor="confirm-password" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full pr-10 py-2 px-3 text-sm bg-white/90 dark:bg-gray-900/90 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-pink-400 focus:border-transparent transition-all ${
                                    passwordErrors.match && confirmPassword
                                        ? "border-red-300 dark:border-red-700" 
                                        : "border-purple-100 dark:border-purple-900/50"
                                }`}
                                placeholder="Confirm new admin password"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                            </button>
                        </div>
                        {passwordErrors.match && confirmPassword && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                Passwords do not match
                            </p>
                        )}
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-gradient-to-br from-gray-50/80 to-purple-50/80 dark:from-gray-900/30 dark:to-purple-900/20 backdrop-blur-sm rounded-lg p-3 border border-purple-100/20 dark:border-purple-800/20">
                        <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Password Requirements
                        </h3>
                        <ul className="space-y-1.5 text-xs">
                            <li className="flex items-center gap-2">
                                <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                                    !passwordErrors.length 
                                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                                }`}>
                                    {!passwordErrors.length ? <FiCheck size={10} /> : null}
                                </span>
                                <span className={!passwordErrors.length ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}>
                                    At least 8 characters
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                                    !passwordErrors.uppercase 
                                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                                }`}>
                                    {!passwordErrors.uppercase ? <FiCheck size={10} /> : null}
                                </span>
                                <span className={!passwordErrors.uppercase ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}>
                                    At least one uppercase letter
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                                    !passwordErrors.lowercase 
                                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                                }`}>
                                    {!passwordErrors.lowercase ? <FiCheck size={10} /> : null}
                                </span>
                                <span className={!passwordErrors.lowercase ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}>
                                    At least one lowercase letter
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                                    !passwordErrors.number 
                                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                                }`}>
                                    {!passwordErrors.number ? <FiCheck size={10} /> : null}
                                </span>
                                <span className={!passwordErrors.number ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}>
                                    At least one number
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                                    !passwordErrors.special 
                                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                                }`}>
                                    {!passwordErrors.special ? <FiCheck size={10} /> : null}
                                </span>
                                <span className={!passwordErrors.special ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}>
                                    At least one special character
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <motion.button
                            type="submit"
                            disabled={!isValid || isPending}
                            whileHover={{ scale: isValid && !isPending ? 1.02 : 1 }}
                            whileTap={{ scale: isValid && !isPending ? 0.98 : 1 }}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-400 dark:disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg shadow-md disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 text-sm"
                        >
                            {isPending ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <FiKey className="text-sm" />
                                    Update Admin Password
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </div>
        </motion.section>
    );
}
