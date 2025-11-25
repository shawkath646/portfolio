"use client";
import { Fragment, useState, useTransition } from 'react';
import { Dialog, DialogTitle, Transition, Radio, RadioGroup } from '@headlessui/react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { generatePassword } from '@/actions/secure/passwordFunc';
import { FiPlus, FiRefreshCw, FiCheck, FiX, FiKey, FiCopy } from 'react-icons/fi';
import { SiteCodeType } from '@/types';


interface GeneratePasswordModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}


const siteOptions = [
    'Admin panel',
    'Personal Life',
    'Friends Corner',
    'Love Corner',
];

const expireOptions = [1, 2, 3, 5, 7, 15];
const usableTimeOptions: (number | 'unlimited')[] = [1, 2, 3, 4, 5, 'unlimited'];

// Optimized animation variants
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
            <span className="text-purple-600 dark:text-purple-400 font-mono text-lg">{displayValue}</span>
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
                    background: `linear-gradient(to right, #8b5cf6 0%, #ec4899 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
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

// Checkbox Component
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
        whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
        className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer"
    >
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </motion.label>
);

// Modal Trigger Component
export const GeneratePasswordButton = ({ isOpen, onOpen }: { isOpen: boolean; onOpen: () => void }) => {
    return (
        <motion.button
            onClick={onOpen}
            disabled={isOpen}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden bg-purple-100/50 dark:bg-white/20 backdrop-blur-sm border border-purple-200 dark:border-white/30 text-purple-700 dark:text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-purple-200/60 dark:hover:bg-white/30 disabled:opacity-50 transition-all duration-300 flex items-center gap-2 shadow-md text-sm"
        >
            <div className="relative z-10 flex items-center gap-2">
                <FiPlus className="text-sm" />
                <span>Generate New</span>
            </div>

            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 dark:from-purple-400/20 dark:to-pink-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
    );
};

// Main Modal Component
export const GeneratePasswordModal = ({ open, onClose, onSuccess }: GeneratePasswordModalProps) => {
    const shouldReduceMotion = useReducedMotion();
    const [step, setStep] = useState<'config' | 'result'>('config');
    const [length, setLength] = useState(12);
    const [siteName, setSiteName] = useState('Admin panel');
    const [expireIndex, setExpireIndex] = useState(4);
    const [usableIndex, setUsableIndex] = useState(5);
    const [includeUppercase, setIncludeUppercase] = useState(false);
    const [includeLowercase, setIncludeLowercase] = useState(false);
    const [includeSpecial, setIncludeSpecial] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    // Computed values
    const expireDays = expireOptions[expireIndex];
    const usableTimes = usableTimeOptions[usableIndex];
    const expireLabel = `${expireDays} day${expireDays > 1 ? 's' : ''}`;
    const usableLabel = usableTimes === 'unlimited' ? 'unlimited' : `${usableTimes} time${usableTimes === 1 ? '' : 's'}`;

    // Animation variants
    const backdropVariants = createBackdropVariants(shouldReduceMotion ?? false);
    const panelVariants = createPanelVariants(shouldReduceMotion ?? false);
    const stepVariants = createStepVariants(shouldReduceMotion ?? false);

    const handleGeneratePassword = () => {
        setError('');

        startTransition(async () => {
            const result = await generatePassword({
                siteCode: siteName.toLowerCase().replace(" ", "-") as SiteCodeType,
                length,
                expireDays,
                includeLowercase,
                includeSpecial,
                includeUppercase,
                includeNumbers: true,
                usableTimes
            });

            if (result.success && result.data) {
                setGeneratedPassword(result.data.password);
                setStep('result');
            } else {
                setError(result.message || 'Failed to generate password');
            }
        });
    };

    const handleCopyPassword = async () => {
        if (generatedPassword) {
            try {
                await navigator.clipboard.writeText(generatedPassword);
                alert('Password copied to clipboard!');
            } catch (err) {
                alert('Failed to copy password to clipboard');
            }
        }
    };

    const handleGotIt = () => {
        if (onSuccess && generatedPassword) onSuccess();

        setStep('config');
        setGeneratedPassword('');
        setLength(12);
        setSiteName('Admin panel');
        setExpireIndex(4);
        setUsableIndex(5);
        setIncludeUppercase(false);
        setIncludeLowercase(false);
        setIncludeSpecial(false);
        setError('');
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
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
                                    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 p-5">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                                    <FiKey className="text-white text-xl" />
                                                </div>
                                                <div>
                                                    <DialogTitle className="text-xl font-bold text-white">
                                                        {step === 'config' ? 'Generate Site Password' : 'Password Generated!'}
                                                    </DialogTitle>
                                                    <p className="text-purple-100 text-sm mt-1">
                                                        {step === 'config'
                                                            ? 'Create a secure password with custom settings'
                                                            : 'Your secure password is ready to use'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={onClose}
                                                disabled={isPending}
                                                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition disabled:opacity-50"
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
                                                                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                                                    <div className="flex items-center gap-3">
                                                                        <FiCheck className="text-blue-600 dark:text-blue-400 text-lg" />
                                                                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Numbers (0-9) - Always Included</span>
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
                                                            <RadioGroup value={siteName} onChange={setSiteName} disabled={isPending}>
                                                                <div className="grid grid-cols-1 gap-3">
                                                                    {siteOptions.map(opt => (
                                                                        <Radio
                                                                            key={opt}
                                                                            value={opt}
                                                                            className={({ checked }) =>
                                                                                `cursor-pointer rounded-xl border-2 px-6 py-4 text-sm font-medium transition-all ${checked
                                                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600 shadow-lg'
                                                                                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-400 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                                                                                } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`
                                                                            }
                                                                        >
                                                                            {opt}
                                                                        </Radio>
                                                                    ))}
                                                                </div>
                                                            </RadioGroup>
                                                        </div>

                                                        {/* Expire Days Slider */}
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

                                                        {/* Usable Times Slider */}
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

                                                {/* Generate Button - Full Width */}
                                                <div className="pt-8 border-t border-gray-200 dark:border-gray-700 mt-8">
                                                    <motion.button
                                                        whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                                                        whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                                                        onClick={handleGeneratePassword}
                                                        disabled={isPending}
                                                        className="w-full rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all"
                                                        type="button"
                                                    >
                                                        {isPending ? (
                                                            <>
                                                                <FiRefreshCw className="animate-spin text-xl" />
                                                                <span>Generating Password...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FiKey className="text-xl" />
                                                                <span>Generate Secure Password</span>
                                                            </>
                                                        )}
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
                                                    className="mx-auto w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                                                >
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={shouldReduceMotion
                                                            ? { duration: 0.1 }
                                                            : { delay: 0.4 }
                                                        }
                                                    >
                                                        <FiCheck className="text-white text-4xl" />
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
                                                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                                                        Your Secure Password
                                                    </h3>
                                                    <div className="relative">
                                                        <div className="rounded-2xl border-2 border-purple-300 dark:border-purple-600 p-6 lg:p-8 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
                                                            <code className="text-xl lg:text-3xl font-mono font-bold text-gray-800 dark:text-white select-all break-all tracking-wider block">
                                                                {generatedPassword}
                                                            </code>
                                                        </div>
                                                    </div>

                                                    {/* Password Info - Responsive Grid */}
                                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 text-sm lg:text-base text-gray-600 dark:text-gray-400">
                                                        <div className="p-4 lg:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                            <span className="font-medium block mb-2">Site:</span>
                                                            <div className="font-mono text-purple-600 dark:text-purple-400 text-xs lg:text-sm break-words">{siteName}</div>
                                                        </div>
                                                        <div className="p-4 lg:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                            <span className="font-medium block mb-2">Length:</span>
                                                            <div className="font-mono text-purple-600 dark:text-purple-400">{length} chars</div>
                                                        </div>
                                                        <div className="p-4 lg:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                            <span className="font-medium block mb-2">Expires:</span>
                                                            <div className="font-mono text-purple-600 dark:text-purple-400 text-xs lg:text-sm">{expireLabel}</div>
                                                        </div>
                                                        <div className="p-4 lg:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                            <span className="font-medium block mb-2">Usage:</span>
                                                            <div className="font-mono text-purple-600 dark:text-purple-400 text-xs lg:text-sm">{usableLabel}</div>
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
                                                    className="flex flex-col sm:flex-row gap-4 lg:gap-6 pt-4"
                                                >
                                                    <motion.button
                                                        whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                                                        whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                                                        onClick={handleCopyPassword}
                                                        className="flex-1 rounded-lg sm:rounded-xl border-2 border-purple-300 dark:border-purple-600 px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-base font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all flex items-center justify-center gap-3"
                                                        type="button"
                                                    >
                                                        <FiCopy className="text-lg lg:text-xl" />
                                                        <span>Copy Password</span>
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                                                        whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                                                        onClick={handleGotIt}
                                                        className="flex-1 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-base font-bold hover:shadow-xl transition-all flex items-center justify-center gap-3"
                                                        type="button"
                                                    >
                                                        <FiCheck className="text-lg lg:text-xl" />
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
            )}
        </AnimatePresence>
    );
};
