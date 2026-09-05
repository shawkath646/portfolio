"use client";
import { Fragment, useState, useTransition, useMemo, useCallback, useEffect, memo } from "react";
import { Dialog, DialogTitle, Description, Transition, TransitionChild, DialogPanel } from "@headlessui/react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { FiRefreshCw, FiCheck, FiX, FiKey, FiCopy, FiAlertCircle } from "react-icons/fi";
import { generatePassword, getDynamicRouteScopesAction } from "@/actions/genericAuth/passwordManagement.actions";
import { useToast } from "@/components/Toast";
import { BASE_SITE_SCOPES, RouteScope } from "@/data/site_scopes";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";

interface GeneratePasswordModalProps {
    open: boolean;
    onClose: () => void;
    availableRoutes?: RouteScope[];
}

const expireOptions = [1, 2, 3, 5, 7, 15];
const usableTimeOptions: (number | "unlimited")[] = [1, 2, 3, 4, 5, "unlimited"];

const createBackdropVariants = (shouldReduceMotion: boolean) => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: shouldReduceMotion ? 0.1 : 0.3 } },
    exit: { opacity: 0, transition: { duration: shouldReduceMotion ? 0.1 : 0.2 } },
});

const createPanelVariants = (shouldReduceMotion: boolean) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 40, scale: shouldReduceMotion ? 1 : 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: shouldReduceMotion ? { duration: 0.1 } : { type: "spring" as const, stiffness: 260, damping: 22 }
    },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.97, transition: { duration: shouldReduceMotion ? 0.1 : 0.15 } },
});

const createStepVariants = (shouldReduceMotion: boolean) => ({
    enter: { opacity: 0, x: shouldReduceMotion ? 0 : 20 },
    center: { opacity: 1, x: 0, transition: { duration: shouldReduceMotion ? 0.1 : 0.3 } },
    exit: { opacity: 0, x: shouldReduceMotion ? 0 : -20, transition: { duration: shouldReduceMotion ? 0.1 : 0.2 } }
});

const PasswordSlider = ({
    label, value, onChange, min, max, disabled, displayValue, markers
}: {
    label: string; value: number; onChange: (value: number) => void;
    min: number; max: number; disabled: boolean; displayValue: string; markers?: string[];
}) => {
    const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;

    return (
        <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                <span>{label}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60">
                    {displayValue}
                </span>
            </div>
            <div className="relative pt-1 pb-1">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="custom-range-slider"
                    disabled={disabled}
                    style={{
                        background: `linear-gradient(to right, #6366f1 0%, #9333ea ${percentage}%, var(--slider-track-bg, #e5e7eb) ${percentage}%, var(--slider-track-bg, #e5e7eb) 100%)`
                    }}
                />
            </div>
            {markers && (
                <div className="flex justify-between items-center text-[11px] font-medium text-gray-400 dark:text-gray-500 px-0.5 select-none">
                    {markers.map((marker, idx) => {
                        const isSelected = idx === value;
                        return (
                            <button
                                key={idx}
                                type="button"
                                disabled={disabled}
                                onClick={() => onChange(idx)}
                                className={`cursor-pointer transition-colors hover:text-indigo-600 dark:hover:text-indigo-300 ${
                                    isSelected ? "text-indigo-600 dark:text-indigo-400 font-bold" : ""
                                }`}
                            >
                                {marker}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const CompactRouteCheckbox = memo<{ path: string; checked: boolean; onToggle: (path: string) => void; disabled: boolean; }>(({
    path, checked, onToggle, disabled,
}) => (
    <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onToggle(path)}
        disabled={disabled}
        className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs font-mono transition-all text-left select-none cursor-pointer w-full ${checked
                ? "border-indigo-500 bg-indigo-50/90 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-medium shadow-xs ring-1 ring-indigo-500/20"
                : "border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gray-50/70 dark:hover:bg-gray-800"
            } ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
    >
        <span className="truncate" title={path}>{path}</span>
        <div
            className={`flex items-center justify-center w-4 h-4 rounded transition-colors shrink-0 ${checked
                    ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                    : "border border-gray-300 dark:border-gray-600 bg-transparent text-transparent group-hover:border-indigo-400"
                }`}
            aria-hidden="true"
        >
            <FiCheck className="w-3 h-3 stroke-[2.5]" />
        </div>
    </button>
));
CompactRouteCheckbox.displayName = "CompactRouteCheckbox";

const GeneratePasswordModal = ({ open, onClose, availableRoutes }: GeneratePasswordModalProps) => {
    const shouldReduceMotion = useReducedMotion();
    const toast = useToast();

    const [fetchedRoutes, setFetchedRoutes] = useState<RouteScope[]>([]);

    const hasAvailableRoutes = (availableRoutes?.length ?? 0) > 0;

    const dynamicRoutes = useMemo(() => {
        if (hasAvailableRoutes) return availableRoutes!;
        if (fetchedRoutes.length > 0) return fetchedRoutes;
        return BASE_SITE_SCOPES;
    }, [availableRoutes, hasAvailableRoutes, fetchedRoutes]);

    const defaultSelectedRoutes = useMemo(() => {
        return dynamicRoutes.filter((r) => !r.parentPath).map((s) => s.path);
    }, [dynamicRoutes]);

    const [step, setStep] = useState<"config" | "result">("config");
    const [name, setName] = useState("");
    const [selectedRoutes, setSelectedRoutes] = useState<string[]>(defaultSelectedRoutes);
    const [searchQuery, setSearchQuery] = useState("");
    const [expireIndex, setExpireIndex] = useState(4);
    const [usableIndex, setUsableIndex] = useState(5);
    const [generatedPassword, setGeneratedPassword] = useState("");
    const [validationError, setValidationError] = useState("");
    const [isPending, startTransition] = useTransition();
    
    // Prevent infinite loops by checking lengths rather than array references
    useEffect(() => {
        if (!hasAvailableRoutes && fetchedRoutes.length === 0) {
            getDynamicRouteScopesAction()
                .then((scopes) => {
                    if (scopes && scopes.length > 0) {
                        setFetchedRoutes(scopes);
                        // Safely set default checkboxes when data arrives, 
                        // but only if the user hasn't selected anything yet!
                        setSelectedRoutes(prev => 
                            prev.length === 0 ? scopes.filter((r) => !r.parentPath).map((s) => s.path) : prev
                        );
                    }
                })
                .catch(() => {});
        }
    }, [hasAvailableRoutes, fetchedRoutes.length]);

    // Reset modal state reliably on close
    useEffect(() => {
        if (!open) {
            // We wait 300ms for the exit animation to finish before clearing the data
            const timer = setTimeout(() => {
                setStep("config");
                setName("");
                setSearchQuery("");
                setGeneratedPassword("");
                setValidationError("");
                setExpireIndex(4);
                setUsableIndex(5);
                setSelectedRoutes(defaultSelectedRoutes); // This is perfectly fine because it's async inside the setTimeout!
            }, 300);
            return () => clearTimeout(timer);
        }
        // Removed the synchronous `else` block to fix the React cascading render warning!
    }, [open, defaultSelectedRoutes]);

    const expireDays = expireOptions[expireIndex];
    const usableTimes = usableTimeOptions[usableIndex];
    const expireLabel = `${expireDays} day${expireDays > 1 ? "s" : ""}`;
    const usableLabel = usableTimes === "unlimited" ? "unlimited" : `${usableTimes} time${usableTimes === 1 ? "" : "s"}`;

    const backdropVariants = createBackdropVariants(shouldReduceMotion ?? false);
    const panelVariants = createPanelVariants(shouldReduceMotion ?? false);
    const stepVariants = createStepVariants(shouldReduceMotion ?? false);

    const selectedSet = useMemo(() => new Set(selectedRoutes), [selectedRoutes]);

    const selectedParentSet = useMemo(() => {
        const parents = new Set<string>();
        for (const route of dynamicRoutes) {
            if (!route.parentPath && selectedSet.has(route.path)) parents.add(route.path);
        }
        return parents;
    }, [dynamicRoutes, selectedSet]);

    const visibleRoutes = useMemo(() => {
        return dynamicRoutes.filter((route) => !(route.parentPath && selectedParentSet.has(route.parentPath)));
    }, [dynamicRoutes, selectedParentSet]);

    const filteredVisibleRoutes = useMemo(() => {
        if (!searchQuery.trim()) return visibleRoutes;
        const q = searchQuery.trim().toLowerCase();
        return visibleRoutes.filter((r) => r.path.toLowerCase().includes(q));
    }, [visibleRoutes, searchQuery]);

    const parentRoutes = useMemo(() => dynamicRoutes.filter((r) => !r.parentPath).map((r) => r.path), [dynamicRoutes]);
    const isAllSelected = parentRoutes.length > 0 && parentRoutes.every((p) => selectedSet.has(p));

    const handleToggleRoute = useCallback((routePath: string) => {
        setSelectedRoutes((prev) => {
            const next = new Set(prev);
            if (next.has(routePath)) {
                next.delete(routePath);
            } else {
                next.add(routePath);
                const prefix = routePath + "/";
                for (const item of Array.from(next)) {
                    if (item.startsWith(prefix)) next.delete(item);
                }
            }
            return Array.from(next);
        });
        setValidationError(prev => prev ? "" : prev);
    }, []);

    const handleSelectAll = useCallback(() => {
        setSelectedRoutes(dynamicRoutes.filter((r) => !r.parentPath).map((r) => r.path));
        setValidationError(prev => prev ? "" : prev);
    }, [dynamicRoutes]);

    const handleClearAll = useCallback(() => setSelectedRoutes([]), []);

    const handleGeneratePassword = () => {
        if (!name.trim()) return setValidationError("Please enter a name for this password.");
        if (selectedRoutes.length === 0) return setValidationError("Please select at least one allowed route scope.");
        setValidationError("");

        startTransition(async () => {
            const result = await generatePassword({
                name: name.trim(),
                allowedRoutes: selectedRoutes,
                expireDays,
                usableTimes,
            });

            toast(result.message, result.success ? "success" : "error");

            if (result.success && result.password) {
                setGeneratedPassword(result.password);
                setStep("result");
            }
        });
    };

    const handleCopyPassword = async () => {
        if (generatedPassword) {
            try {
                await navigator.clipboard.writeText(generatedPassword);
                toast("Password copied to clipboard!", "success");
            } catch {
                toast("Failed to copy password to clipboard", "error");
            }
        }
    };

    useLockBodyScroll();

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                    <motion.div
                        variants={backdropVariants} initial="hidden" animate="visible" exit="exit"
                        className="fixed inset-0 bg-black/60 backdrop-blur-md"
                    />
                </TransitionChild>

                {/* Modal Positioner */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel
                                as={motion.div} variants={panelVariants} initial="hidden" animate="visible" exit="exit"
                                className="w-full max-w-xl sm:max-w-2xl transform overflow-hidden rounded-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-white/20 dark:border-gray-700/40 shadow-2xl text-left align-middle transition-all"
                            >
                                {/* Modal Header */}
                                <div className="p-6 lg:p-8 border-b border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
                                                <FiKey className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <DialogTitle className="text-xl lg:text-2xl font-bold bg-linear-to-r from-gray-900 via-indigo-950 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                                                    {step === "config" ? "Generate Access Password" : "Password Generated!"}
                                                </DialogTitle>
                                                <Description className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                                    {step === "config" ? "Create a secure, route-authorized access key" : "Your access password is ready. Copy and store it safely."}
                                                </Description>
                                            </div>
                                        </div>
                                        <button
                                            onClick={onClose} disabled={isPending}
                                            className="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-white/10 rounded-xl transition disabled:opacity-50 cursor-pointer"
                                            aria-label="Close"
                                        >
                                            <FiX className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <AnimatePresence mode="wait">
                                    {step === "config" ? (
                                        <motion.div key="config" variants={stepVariants} initial="enter" animate="center" exit="exit" className="p-6 lg:p-8">
                                            <div className="space-y-6">
                                                {/* Key Name Input */}
                                                <div className="space-y-2">
                                                    <label htmlFor="password-name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        Password Identifier / Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        id="password-name" type="text" value={name} disabled={isPending}
                                                        onChange={(e) => {
                                                            setName(e.target.value);
                                                            setValidationError(prev => prev ? "" : prev);
                                                        }}
                                                        placeholder="e.g. Close Friends, Alice, Family VIP..."
                                                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                                    />
                                                </div>

                                                {/* Route Selection Grid */}
                                                <div className="space-y-2.5">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                                Allowed Route Scopes <span className="text-red-500">*</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {selectedRoutes.length} route{selectedRoutes.length !== 1 ? "s" : ""} selected
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button type="button" onClick={handleSelectAll} disabled={isPending || isAllSelected} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-40 cursor-pointer">
                                                                Select All
                                                            </button>
                                                            <span className="text-gray-300 dark:text-gray-600">•</span>
                                                            <button type="button" onClick={handleClearAll} disabled={isPending || selectedRoutes.length === 0} className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:underline disabled:opacity-40 cursor-pointer">
                                                                Clear All
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {visibleRoutes.length > 8 && (
                                                        <div className="relative">
                                                            <input
                                                                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Filter routes..."
                                                                className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                            />
                                                            {searchQuery && (
                                                                <button type="button" onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">✕</button>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="max-h-52 sm:max-h-60 overflow-y-auto pr-1 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-2.5 bg-gray-50/50 dark:bg-gray-800/30">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {filteredVisibleRoutes.map((scope) => (
                                                                <CompactRouteCheckbox key={scope.path} path={scope.path} checked={selectedSet.has(scope.path)} onToggle={handleToggleRoute} disabled={isPending} />
                                                            ))}
                                                        </div>
                                                        {filteredVisibleRoutes.length === 0 && (
                                                            <p className="text-center text-xs text-gray-400 py-4 font-mono">No matching routes found</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Sliders Grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                                                    <PasswordSlider
                                                        label="Expiration Time" value={expireIndex} onChange={setExpireIndex} min={0} max={expireOptions.length - 1}
                                                        disabled={isPending} displayValue={expireLabel} markers={expireOptions.map((d) => `${d}d`)}
                                                    />
                                                    <PasswordSlider
                                                        label="Usage Limit" value={usableIndex} onChange={setUsableIndex} min={0} max={usableTimeOptions.length - 1}
                                                        disabled={isPending} displayValue={usableLabel} markers={usableTimeOptions.map((u) => u === "unlimited" ? "∞" : `${u}x`)}
                                                    />
                                                </div>

                                                {/* Validation Error */}
                                                {validationError && (
                                                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-300 text-xs">
                                                        <FiAlertCircle className="w-4 h-4 shrink-0" />
                                                        <span>{validationError}</span>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                    <button type="button" onClick={onClose} disabled={isPending} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium transition cursor-pointer">
                                                        Cancel
                                                    </button>
                                                    <button type="button" onClick={handleGeneratePassword} disabled={isPending} className="px-6 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer">
                                                        {isPending ? <><FiRefreshCw className="h-4 w-4 animate-spin" /><span>Generating...</span></> : <><FiKey className="h-4 w-4" /><span>Generate Password</span></>}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="result" variants={stepVariants} initial="enter" animate="center" exit="exit" className="p-6 lg:p-8">
                                            <div className="space-y-6">
                                                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-3">
                                                    <FiAlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                                    <div>
                                                        <strong className="font-semibold block mb-1">Important Security Notice</strong>
                                                        This password will only be displayed <strong>once</strong> and cannot be retrieved later. Only its secure hash is stored in the database. Please copy and share it safely with the intended recipient now.
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                        Generated Access Password ({name})
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 p-3.5 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl font-mono text-sm sm:text-base text-gray-900 dark:text-white break-all select-all font-semibold tracking-wide">
                                                            {generatedPassword}
                                                        </div>
                                                        <button onClick={handleCopyPassword} className="p-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-2xl shadow-lg shadow-indigo-600/20 transition cursor-pointer shrink-0" title="Copy to clipboard">
                                                            <FiCopy className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-xs space-y-1.5 text-gray-600 dark:text-gray-400">
                                                    <div className="flex justify-between"><span>Expiration:</span><span className="font-semibold text-gray-900 dark:text-white">{expireLabel}</span></div>
                                                    <div className="flex justify-between"><span>Usage Limit:</span><span className="font-semibold text-gray-900 dark:text-white">{usableLabel}</span></div>
                                                    <div className="flex justify-between"><span>Allowed Scopes:</span><span className="font-semibold text-gray-900 dark:text-white font-mono">{selectedRoutes.length} route(s)</span></div>
                                                </div>

                                                <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                                                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition flex items-center gap-2 cursor-pointer">
                                                        <FiCheck className="h-4 w-4" />
                                                        <span>Got It, Done</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default GeneratePasswordModal;