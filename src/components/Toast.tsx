"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiX } from "react-icons/fi";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
}

type ToastFn = (message: string, type?: ToastType) => void;

const ToastContext = createContext<ToastFn | null>(null);

const DURATION = 4500;

const variantConfig: Record<
    ToastType,
    { icon: React.ElementType; bar: string; iconClass: string; border: string }
> = {
    success: {
        icon: FiCheckCircle,
        bar: "bg-green-500",
        iconClass: "text-green-400",
        border: "border-green-500/40",
    },
    error: {
        icon: FiXCircle,
        bar: "bg-red-500",
        iconClass: "text-red-400",
        border: "border-red-500/40",
    },
    warning: {
        icon: FiAlertTriangle,
        bar: "bg-yellow-500",
        iconClass: "text-yellow-400",
        border: "border-yellow-500/40",
    },
    info: {
        icon: FiInfo,
        bar: "bg-blue-500",
        iconClass: "text-blue-400",
        border: "border-blue-500/40",
    },
};

function ToastCard({
    toast,
    onDismiss,
}: {
    toast: ToastItem;
    onDismiss: (id: string) => void;
}) {
    const config = variantConfig[toast.type];
    const Icon = config.icon;

    useEffect(() => {
        const timer = setTimeout(() => onDismiss(toast.id), DURATION);
        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 80, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className={`relative flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)] rounded-xl border shadow-2xl overflow-hidden pl-5 pr-4 py-3.5 bg-white dark:bg-zinc-900 ${config.border}`}
            role="alert"
            aria-live="assertive"
        >
            {/* Left accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.bar}`} />

            <Icon
                className={`shrink-0 text-lg mt-0.5 ${config.iconClass}`}
                aria-hidden="true"
            />

            <p className="flex-1 text-sm font-medium leading-relaxed text-gray-800 dark:text-zinc-100 wrap-break-word">
                {toast.message}
            </p>

            <button
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 mt-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                aria-label="Dismiss notification"
            >
                <FiX className="text-base" />
            </button>
        </motion.div>
    );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback<ToastFn>((message, type = "info") => {
        const id = Math.random().toString(36).slice(2, 10);
        setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
    }, []);

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <div
                className="fixed bottom-4 right-4 z-9999 flex flex-col gap-2 items-end pointer-events-none"
                aria-label="Notifications"
                aria-atomic="false"
                aria-relevant="additions"
            >
                <AnimatePresence mode="popLayout">
                    {toasts.map((t) => (
                        <div key={t.id} className="pointer-events-auto">
                            <ToastCard toast={t} onDismiss={dismiss} />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
    return ctx;
}
