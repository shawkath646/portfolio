"use client";
import { Fragment, useState, useTransition } from 'react';
import { Dialog, DialogTitle, Description, Transition, Radio, RadioGroup } from '@headlessui/react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { FiRefreshCw, FiCheck, FiX, FiKey, FiCopy } from 'react-icons/fi';
import { generatePassword } from '@/actions/genericAuth/passwordManagement';
import { useToast } from '@/components/Toast';
import useLockBodyScroll from '@/hooks/useLockBodyScroll';
import { AccessScopeLabel } from "@/types/genericAuth.types";


interface GeneratePasswordModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const siteOptions: AccessScopeLabel[] = [
    'personal_life',
    'friends_corner',
    'love_corner'
];

const expireOptions = [1, 2, 3, 5, 7, 15];
const usableTimeOptions: (number | 'unlimited')[] = [1, 2, 3, 4, 5, 'unlimited'];

const createBackdropVariants = (shouldReduceMotion: boolean) => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: shouldReduceMotion ? 0.1 : 0.3 }
    },
    exit: {
        opacity: 0,
        transition: { duration: shouldReduceMotion ? 0.1 : 0.2 }
    },
});

const createPanelVariants = (shouldReduceMotion: boolean) => ({
    hidden: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : 40,
        scale: shouldReduceMotion ? 1 : 0.97
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: shouldReduceMotion
            ? { duration: 0.1 }
            : {
                type: 'spring' as const,
                stiffness: 260,
                damping: 22
            }
    },
    exit: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : 20,
        scale: shouldReduceMotion ? 1 : 0.97,
        transition: { duration: shouldReduceMotion ? 0.1 : 0.15 }
    },
});

const createStepVariants = (shouldReduceMotion: boolean) => ({
    enter: {
        opacity: 0,
        x: shouldReduceMotion ? 0 : 20
    },
    center: {
        opacity: 1,
        x: 0,
        transition: { duration: shouldReduceMotion ? 0.1 : 0.3 }
    },
    exit: {
        opacity: 0,
        x: shouldReduceMotion ? 0 : -20,
        transition: { duration: shouldReduceMotion ? 0.1 : 0.2 }
    }
});

const PasswordSlider = ({
    label,
    value,
    onChange,
    min,
    max,
    disabled,
    displayValue,
    markers
}: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    disabled: boolean;
    displayValue: string;
    markers?: string[];
}) => (
    <div className="space-y-3">
        <label className="text-sm font-semibold flex justify-between text-gray-700 dark:text-gray-300">
            <span>{label}</span>
            <span className="text-indigo-600 dark:text-indigo-300 font-mono text-lg">{displayValue}</span>
        </label>
        <div className="relative">
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                disabled={disabled}
                style={{
                    background: `linear-gradient(to right, #1e3a8a 0%, #8b5cf6 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
                }}
            />
        </div>
        {markers && (
            <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                {markers.map((marker, idx) => (
                    <span key={idx}>{marker}</span>
                ))}
            </div>
        )}
    </div>
);

const CharacterTypeCheckbox = ({
    label,
    checked,
    onChange,
    disabled,
    shouldReduceMotion
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled: boolean;
    shouldReduceMotion: boolean;
}) => (
    <motion.label
        whileHover={!disabled && !shouldReduceMotion ? { scale: 1.02 } : undefined}
        whileTap={!disabled && !shouldReduceMotion ? { scale: 0.98 } : undefined}
        className={`
            group relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none
            ${checked
                ? "bg-indigo-50/80 dark:bg-indigo-900/20 border-indigo-500 dark:border-indigo-400 shadow-sm shadow-indigo-200/50 dark:shadow-none"
                : "bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            }
            ${disabled ? "opacity-50 cursor-not-allowed grayscale pointer-events-none" : ""}
        `}
    >
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
        />

        <div className={`
            flex items-center justify-center w-5 h-5 rounded-md border transition-all duration-200
            ${checked
                ? "bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500 scale-110"
                : "bg-transparent border-gray-300 dark:border-gray-500 group-hover:border-indigo-400"
            }
        `}>
            <motion.svg
                initial={false}
                animate={checked ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </motion.svg>
        </div>

        {/* Label Text */}
        <span className={`text-sm font-medium transition-colors ${checked ? "text-indigo-900 dark:text-indigo-100" : "text-gray-600 dark:text-gray-400"}`}>
            {label}
        </span>
    </motion.label>
);


const GeneratePasswordModal = ({ open, onClose, onSuccess }: GeneratePasswordModalProps) => {
    const shouldReduceMotion = useReducedMotion();
    const [step, setStep] = useState<'config' | 'result'>('config');
    const [length, setLength] = useState(12);
    const [accessScope, setAccessScope] = useState<AccessScopeLabel>('personal_life');
    const [expireIndex, setExpireIndex] = useState(4);
    const [usableIndex, setUsableIndex] = useState(5);
    const [includeUppercase, setIncludeUppercase] = useState(false);
    const [includeLowercase, setIncludeLowercase] = useState(false);
    const [includeSpecial, setIncludeSpecial] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    const expireDays = expireOptions[expireIndex];
    const usableTimes = usableTimeOptions[usableIndex];
    const expireLabel = `${expireDays} day${expireDays > 1 ? 's' : ''}`;
    const usableLabel = usableTimes === 'unlimited' ? 'unlimited' : `${usableTimes} time${usableTimes === 1 ? '' : 's'}`;

    const backdropVariants = createBackdropVariants(shouldReduceMotion ?? false);
    const panelVariants = createPanelVariants(shouldReduceMotion ?? false);
    const stepVariants = createStepVariants(shouldReduceMotion ?? false);

    const handleGeneratePassword = () => {
        setError('');

        startTransition(async () => {
            const result = await generatePassword({
                scopeLabels: [accessScope],
                length,
                expireDays,
                includeLowercase,
                includeSpecial,
                includeUppercase,
                includeNumbers: true,
                usableTimes
            });

            if (result.success && result.password) {
                setGeneratedPassword(result.password);
                setStep('result');
            } else {
                setError(result.message || 'Failed to generate password');
            }
        });
    };

    const toast = useToast();

    const handleCopyPassword = async () => {
        if (generatedPassword) {
            try {
                await navigator.clipboard.writeText(generatedPassword);
                toast('Password copied to clipboard!', 'success');
            } catch {
                toast('Failed to copy password to clipboard', 'error');
            }
        }
    };

    const handleGotIt = () => {
        if (onSuccess && generatedPassword) onSuccess();

        setStep('config');
        setGeneratedPassword('');
        setLength(12);
        setAccessScope('personal_life');
        setExpireIndex(4);
        setUsableIndex(5);
        setIncludeUppercase(false);
        setIncludeLowercase(false);
        setIncludeSpecial(false);
        setError('');
        onClose();
    };

    useLockBodyScroll();

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <style jsx>{`
                            input[type="range"] {
                                -webkit-appearance: none;
                                appearance: none;
                                background: transparent;
                                cursor: pointer;
                            }
                            
                            input[type="range"]::-webkit-slider-track {
                                height: 12px;
                                border-radius: 6px;
                            }
                            
                            input[type="range"]::-webkit-slider-thumb {
                                -webkit-appearance: none;
                                appearance: none;
                                height: 24px;
                                width: 24px;
                                border-radius: 50%;
                                background: linear-gradient(45deg, #8b5cf6, #ec4899);
                                cursor: pointer;
                                box-shadow: 0 6px 12px rgba(139, 92, 246, 0.4);
                                border: 3px solid white;
                                transition: all 0.3s ease;
                            }
                            
                            input[type="range"]::-webkit-slider-thumb:hover {
                                transform: scale(1.1);
                                box-shadow: 0 8px 16px rgba(139, 92, 246, 0.5);
                            }
                            
                            input[type="range"]::-moz-range-track {
                                height: 12px;
                                border-radius: 6px;
                                background: transparent;
                                border: none;
                            }
                            
                            input[type="range"]::-moz-range-thumb {
                                height: 24px;
                                width: 24px;
                                border-radius: 50%;
                                background: linear-gradient(45deg, #8b5cf6, #ec4899);
                                cursor: pointer;
                                box-shadow: 0 6px 12px rgba(139, 92, 246, 0.4);
                                border: 3px solid white;
                                transition: all 0.3s ease;
                            }
                            
                            input[type="range"]::-moz-range-thumb:hover {
                                transform: scale(1.1);
                                box-shadow: 0 8px 16px rgba(139, 92, 246, 0.5);
                            }

                            @media (prefers-reduced-motion: reduce) {
                                input[type="range"]::-webkit-slider-thumb,
                                input[type="range"]::-moz-range-thumb {
                                    transition: none;
                                }
                                
                                input[type="range"]::-webkit-slider-thumb:hover,
                                input[type="range"]::-moz-range-thumb:hover {
                                    transform: none;
                                }
                            }
                        `}</style>
                <motion.div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 lg:p-8">
                        <motion.div
                            variants={panelVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full max-w-lg lg:max-w-6xl rounded-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl ring-1 ring-gray-200/70 dark:ring-gray-700/50 overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="border-b border-indigo-100/50 dark:border-indigo-900/40 bg-white/80 dark:bg-gray-900/80 backdrop-blur p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-linear-to-br from-blue-600 via-indigo-600 to-fuchsia-600 rounded-xl shadow-md" aria-hidden="true">
                                            <FiKey className="text-white text-xl" />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-xl font-bold bg-linear-to-r from-blue-900 via-indigo-800 to-fuchsia-700 dark:from-white dark:via-indigo-200 dark:to-pink-200 bg-clip-text text-transparent">
                                                {step === 'config' ? 'Generate Site Password' : 'Password Generated!'}
                                            </DialogTitle>
                                            <Description className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                                {step === 'config'
                                                    ? 'Create a secure password with custom settings'
                                                    : 'Your secure password is ready to use'
                                                }
                                            </Description>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        disabled={isPending}
                                        className="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-white/10 rounded-xl transition disabled:opacity-50"
                                        aria-label="Close"
                                    >
                                        <FiX className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <AnimatePresence mode="wait">
                                {step === 'config' ? (
                                    <motion.div
                                        key="config"
                                        variants={stepVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="p-6 lg:p-8"
                                    >
                                        {/* Error Message */}
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: shouldReduceMotion ? 0.1 : 0.3 }}
                                                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                                            >
                                                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                                            </motion.div>
                                        )}

                                        {/* Grid Layout for larger screens */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                                            {/* Left Column - Password Configuration */}
                                            <div className="space-y-6">
                                                <div className="text-lg font-bold text-gray-800 dark:text-white lg:mb-8">
                                                    Password Settings
                                                </div>

                                                {/* Password Length */}
                                                <PasswordSlider
                                                    label="Password Length"
                                                    value={length}
                                                    onChange={setLength}
                                                    min={8}
                                                    max={32}
                                                    disabled={isPending}
                                                    displayValue={length.toString()}
                                                    markers={['8', '32']}
                                                />

                                                {/* Character Types */}
                                                <div className="space-y-4">
                                                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Character Types</div>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-900/20 border border-indigo-100/70 dark:border-indigo-800/60">
                                                            <div className="flex items-center gap-3">
                                                                <FiCheck className="text-indigo-600 dark:text-indigo-300 text-lg" />
                                                                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-200">Numbers (0-9) - Always Included</span>
                                                            </div>
                                                        </div>

                                                        <CharacterTypeCheckbox
                                                            label="Include Uppercase (A-Z)"
                                                            checked={includeUppercase}
                                                            onChange={setIncludeUppercase}
                                                            disabled={isPending}
                                                            shouldReduceMotion={shouldReduceMotion ?? false}
                                                        />

                                                        <CharacterTypeCheckbox
                                                            label="Include Lowercase (a-z)"
                                                            checked={includeLowercase}
                                                            onChange={setIncludeLowercase}
                                                            disabled={isPending}
                                                            shouldReduceMotion={shouldReduceMotion ?? false}
                                                        />

                                                        <CharacterTypeCheckbox
                                                            label="Include Special Characters (!@#$)"
                                                            checked={includeSpecial}
                                                            onChange={setIncludeSpecial}
                                                            disabled={isPending}
                                                            shouldReduceMotion={shouldReduceMotion ?? false}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column - Site & Limits Configuration */}
                                            <div className="space-y-6">
                                                <div className="text-lg font-bold text-gray-800 dark:text-white lg:mb-8">
                                                    Access Settings
                                                </div>

                                                {/* Site Name */}
                                                <div className="space-y-4">
                                                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Site Selection</div>
                                                    <RadioGroup value={accessScope} onChange={setAccessScope} disabled={isPending}>
                                                        <div className="grid grid-cols-1 gap-3">
                                                            {siteOptions.map(opt => (
                                                                <Radio
                                                                    key={opt}
                                                                    value={opt}
                                                                    className={({ checked }) =>
                                                                        `cursor-pointer rounded-xl border-2 px-6 py-4 text-sm font-medium transition-all ${checked
                                                                            ? 'bg-linear-to-r from-blue-600/20 to-indigo-600/20 text-white border-indigo-600 shadow-sm'
                                                                            : 'border-indigo-100/70 dark:border-indigo-900/40 hover:border-indigo-300 dark:hover:border-indigo-500 text-gray-700 dark:text-gray-300 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20'
                                                                        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`
                                                                    }
                                                                >
                                                                    {opt}
                                                                </Radio>
                                                            ))}
                                                        </div>
                                                    </RadioGroup>
                                                </div>

                                                <PasswordSlider
                                                    label="Expiration Time"
                                                    value={expireIndex}
                                                    onChange={setExpireIndex}
                                                    min={0}
                                                    max={expireOptions.length - 1}
                                                    disabled={isPending}
                                                    displayValue={expireLabel}
                                                    markers={expireOptions.map(d => `${d}d`)}
                                                />

                                                <PasswordSlider
                                                    label="Usage Limit"
                                                    value={usableIndex}
                                                    onChange={setUsableIndex}
                                                    min={0}
                                                    max={usableTimeOptions.length - 1}
                                                    disabled={isPending}
                                                    displayValue={usableLabel}
                                                    markers={usableTimeOptions.map(v => v === 'unlimited' ? '∞' : v.toString())}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-indigo-100/60 dark:border-indigo-900/40 mt-6">
                                            <motion.button
                                                whileTap={{ scale: shouldReduceMotion ? 1 : 0.98, translateY: 0 }}
                                                onClick={handleGeneratePassword}
                                                disabled={isPending}
                                                className={`
                                                            group relative w-full overflow-hidden rounded-xl 
                                                            bg-linear-to-r from-indigo-600 via-purple-600 to-fuchsia-600 
                                                            px-4 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 
                                                            transition-all duration-300
                                                            hover:shadow-2xl hover:shadow-indigo-500/40 
                                                            disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none
                                                            flex items-center justify-center gap-2
                                                        `}
                                                type="button"
                                            >
                                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent z-0" />

                                                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent opacity-50" />

                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    {isPending ? (
                                                        <>
                                                            <FiRefreshCw className="animate-spin text-lg" />
                                                            <span>Generating...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiKey className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                                                            <span>Generate Secure Password</span>
                                                        </>
                                                    )}
                                                </span>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="result"
                                        variants={stepVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="p-6 lg:p-8 space-y-8 text-center"
                                    >
                                        {/* Success Animation */}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={shouldReduceMotion
                                                ? { duration: 0.1 }
                                                : { type: "spring", stiffness: 200, damping: 10, delay: 0.2 }
                                            }
                                            className="mx-auto w-20 h-20 rounded-full border border-indigo-200/70 dark:border-indigo-800/60 bg-indigo-50/70 dark:bg-indigo-900/30 flex items-center justify-center"
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={shouldReduceMotion
                                                    ? { duration: 0.1 }
                                                    : { delay: 0.4 }
                                                }
                                            >
                                                <FiCheck className="text-indigo-600 dark:text-indigo-300 text-3xl" />
                                            </motion.div>
                                        </motion.div>

                                        {/* Generated Password Display */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={shouldReduceMotion
                                                ? { duration: 0.1 }
                                                : { delay: 0.6 }
                                            }
                                            className="space-y-6 lg:space-y-8"
                                        >
                                            <h3 className="text-2xl lg:text-3xl font-bold bg-linear-to-r from-blue-900 via-indigo-800 to-fuchsia-700 dark:from-white dark:via-indigo-200 dark:to-pink-200 bg-clip-text text-transparent">
                                                Your Secure Password
                                            </h3>
                                            <div className="relative">
                                                <div className="rounded-2xl border border-indigo-200/70 dark:border-indigo-700/60 p-6 lg:p-8 bg-white/80 dark:bg-gray-900/60">
                                                    <code className="text-xl lg:text-3xl font-mono font-bold text-gray-900 dark:text-white select-all break-all tracking-wider block">
                                                        {generatedPassword}
                                                    </code>
                                                </div>
                                            </div>

                                            {/* Password Info - Responsive Grid */}
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 text-sm lg:text-base text-gray-600 dark:text-gray-400">
                                                <div className="p-4 lg:p-6 bg-indigo-50/60 dark:bg-indigo-900/20 rounded-xl border border-indigo-100/70 dark:border-indigo-800/60">
                                                    <span className="font-medium block mb-2">Site:</span>
                                                    <div className="font-mono text-indigo-700 dark:text-indigo-200 text-xs lg:text-sm wrap-break-word">{accessScope.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</div>
                                                </div>
                                                <div className="p-4 lg:p-6 bg-indigo-50/60 dark:bg-indigo-900/20 rounded-xl border border-indigo-100/70 dark:border-indigo-800/60">
                                                    <span className="font-medium block mb-2">Length:</span>
                                                    <div className="font-mono text-indigo-700 dark:text-indigo-200">{length} chars</div>
                                                </div>
                                                <div className="p-4 lg:p-6 bg-indigo-50/60 dark:bg-indigo-900/20 rounded-xl border border-indigo-100/70 dark:border-indigo-800/60">
                                                    <span className="font-medium block mb-2">Expires:</span>
                                                    <div className="font-mono text-indigo-700 dark:text-indigo-200 text-xs lg:text-sm">{expireLabel}</div>
                                                </div>
                                                <div className="p-4 lg:p-6 bg-indigo-50/60 dark:bg-indigo-900/20 rounded-xl border border-indigo-100/70 dark:border-indigo-800/60">
                                                    <span className="font-medium block mb-2">Usage:</span>
                                                    <div className="font-mono text-indigo-700 dark:text-indigo-200 text-xs lg:text-sm">{usableLabel}</div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Action Buttons */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={shouldReduceMotion
                                                ? { duration: 0.1 }
                                                : { delay: 0.8 }
                                            }
                                            className="flex flex-col sm:flex-row gap-3 pt-4"
                                        >
                                            <motion.button
                                                whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                                                whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                                                onClick={handleCopyPassword}
                                                className="flex-1 rounded-lg border border-indigo-200 dark:border-indigo-700 px-4 py-2.5 text-sm font-semibold text-indigo-700 dark:text-indigo-200 hover:bg-indigo-50/60 dark:hover:bg-indigo-900/30 transition-all flex items-center justify-center gap-2"
                                                type="button"
                                            >
                                                <FiCopy className="text-base" />
                                                <span>Copy Password</span>
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                                                whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                                                onClick={handleGotIt}
                                                className="flex-1 rounded-lg bg-linear-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white px-4 py-2.5 text-sm font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-fuchsia-700 transition-all flex items-center justify-center gap-2"
                                                type="button"
                                            >
                                                <FiCheck className="text-base" />
                                                <span>Got It</span>
                                            </motion.button>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default GeneratePasswordModal;
