"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
// Type definition inline (passwordless login feature is currently disabled)
export interface DeviceWithReachabilityType {
    id: string;
    deviceName: string;
    deviceOs: string;
    isReachable: boolean;
    lastActive?: Date | { toDate: () => Date } | any;
}
import { FaAndroid, FaApple, FaGlobe } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import { FiSmartphone, FiLogIn, FiCheckCircle, FiAlertTriangle, FiLock, FiUnlock } from 'react-icons/fi';

interface LoginWithDevicesProps {
    reachableDevices: DeviceWithReachabilityType[];
    redirectUrl?: string;
}

type LoginStep = 'select' | 'authenticating' | 'success' | 'error';

export default function LoginWithDevices({ reachableDevices, redirectUrl }: LoginWithDevicesProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<LoginStep>('select');
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
    const [selectedDeviceData, setSelectedDeviceData] = useState<DeviceWithReachabilityType | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const reachableDevicesCount = reachableDevices.filter(device => device.isReachable).length;

    const router = useRouter();

    useEffect(() => {
        if (reachableDevicesCount > 0) {
            setIsOpen(true);
        }
    }, [reachableDevicesCount]);

    const getDeviceIcon = (deviceOs: string) => {
        switch (deviceOs) {
            case 'android':
                return <FaAndroid className="text-green-500 text-2xl" />;
            case 'ios':
                return <FaApple className="text-gray-500 text-2xl" />;
            case 'web':
                return <FaGlobe className="text-blue-500 text-2xl" />;
            default:
                return <FiSmartphone className="text-purple-500 text-2xl" />;
        }
    };

    const handleDeviceSelect = async (deviceId: string) => {
        const deviceData = reachableDevices.find(device => device.id === deviceId);
        if (!deviceData) return;
        
        setSelectedDevice(deviceId);
        setSelectedDeviceData(deviceData);
        setStep('authenticating');

        try {
            





            // Simulate an API call to authenticate the device
        } catch (error) {
            setStep('error');
            setErrorMessage('Authentication failed. Please try again.');
            console.error('Error during device authentication:', error);
        }
    };

    const resetModal = () => {
        setStep('select');
        setSelectedDevice(null);
        setSelectedDeviceData(null);
        setErrorMessage('');
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-purple-100/30 dark:border-purple-800/30 shadow-2xl w-full max-w-md overflow-hidden transform transition-all"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-blue-400/30 via-blue-500/30 to-indigo-400/30 dark:from-blue-600/30 dark:via-blue-500/30 dark:to-indigo-600/30 p-5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/30 dark:bg-white/20 rounded-xl backdrop-blur-sm">
                                {step === 'select' && <FiLogIn className="text-white text-xl" />}
                                {step === 'authenticating' && <FiLock className="text-white text-xl" />}
                                {step === 'success' && <FiUnlock className="text-white text-xl" />}
                                {step === 'error' && <FiAlertTriangle className="text-white text-xl" />}
                            </div>
                            <div>
                                <h2 
                                    id="modal-title"
                                    className="text-xl font-bold text-white"
                                >
                                    {step === 'select' && 'Login with Connected Devices'}
                                    {step === 'authenticating' && 'Authenticating...'}
                                    {step === 'success' && 'Login Successful'}
                                    {step === 'error' && 'Authentication Failed'}
                                </h2>
                                <p className="text-blue-50 dark:text-blue-100 text-sm mt-1">
                                    {step === 'select' && 'Use one of your trusted devices'}
                                    {step === 'authenticating' && 'Please wait while we verify your device'}
                                    {step === 'success' && 'You will be redirected shortly'}
                                    {step === 'error' && 'Please try again or use password'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={closeModal}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition"
                            aria-label="Close"
                            disabled={step === 'authenticating'}
                        >
                            <HiX className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Modal Body - Device Selection Step */}
                    <AnimatePresence mode="wait">
                        {step === 'select' && (
                            <motion.div
                                key="select-step"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="p-6"
                            >
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Select a device to authenticate without entering your password:
                                </p>

                                <div className="space-y-3 max-h-60">
                                    {reachableDevices
                                        .filter(device => device.isReachable)
                                        .map(device => (
                                            <motion.button
                                                key={device.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`w-full flex items-center gap-4 p-4 ${
                                                    selectedDevice === device.id 
                                                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-300 dark:border-blue-700' 
                                                        : 'bg-gray-50/80 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent'
                                                } rounded-xl transition-all duration-200`}
                                                onClick={() => handleDeviceSelect(device.id)}
                                                disabled={!!selectedDevice}
                                            >
                                                <div className={`flex-shrink-0 w-12 h-12 ${
                                                    selectedDevice === device.id 
                                                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                                        : 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30'
                                                } rounded-full shadow-lg flex items-center justify-center`}>
                                                    {selectedDevice === device.id ? (
                                                        <FiCheckCircle className="text-white text-xl" />
                                                    ) : getDeviceIcon(device.deviceOs)}
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className={`font-medium ${
                                                        selectedDevice === device.id 
                                                            ? 'text-blue-800 dark:text-blue-300' 
                                                            : 'text-gray-900 dark:text-white'
                                                    } truncate`}>
                                                        {device.deviceName}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Last active: {device.lastActive.toLocaleString()}
                                                    </p>
                                                </div>
                                            </motion.button>
                                        ))}
                                </div>

                                {reachableDevicesCount === 0 && (
                                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        No reachable devices found.
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Authentication Loading Step */}
                        {step === 'authenticating' && (
                            <motion.div
                                key="authenticating-step"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-8 flex flex-col items-center justify-center"
                            >
                                {selectedDeviceData && (
                                    <div className="mb-8 flex flex-col items-center">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 mb-4 flex items-center justify-center">
                                            {getDeviceIcon(selectedDeviceData.deviceOs)}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                            {selectedDeviceData.deviceName}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            Verifying device identity...
                                        </p>
                                    </div>
                                )}
                                
                                <div className="relative">
                                    {/* Spinner */}
                                    <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-900/30 rounded-full"></div>
                                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-blue-500 border-r-blue-500 dark:border-t-blue-400 dark:border-r-blue-400 rounded-full animate-spin"></div>
                                </div>
                                
                                <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
                                    Establishing secure connection...<br />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        This might take a few moments
                                    </span>
                                </p>
                            </motion.div>
                        )}

                        {/* Success Step */}
                        {step === 'success' && (
                            <motion.div
                                key="success-step"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-8 flex flex-col items-center justify-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ 
                                        type: "spring", 
                                        damping: 15, 
                                        stiffness: 300,
                                        delay: 0.2
                                    }}
                                >
                                    <FiCheckCircle className="w-18 h-18 mb-8 text-white text-4xl" />
                                </motion.div>
                                
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                    Login Successful!
                                </h3>
                                
                                {selectedDeviceData && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                            {getDeviceIcon(selectedDeviceData.deviceOs)}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {selectedDeviceData.deviceName}
                                        </p>
                                    </div>
                                )}
                                
                                <p className="text-center text-gray-500 dark:text-gray-400">
                                    You will be redirected to the admin dashboard automatically.
                                </p>
                                
                                <div className="mt-8 w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2 }}
                                        className="bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-blue-500 dark:to-indigo-600 h-1.5 rounded-full"
                                        onAnimationComplete={() => {
                                            setTimeout(() => {
                                                closeModal();
                                                router.push(redirectUrl ?? '/admin');
                                            }, 500);
                                        }}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Error Step */}
                        {step === 'error' && (
                            <motion.div
                                key="error-step"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-8 flex flex-col items-center justify-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 15, stiffness: 300 }}
                                    className="w-24 h-24 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mb-6"
                                >
                                    <FiAlertTriangle className="text-white text-4xl" />
                                </motion.div>
                                
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                    Authentication Failed
                                </h3>
                                
                                <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
                                    {errorMessage || "Unable to verify your device. Please try again or use password login."}
                                </p>
                                
                                <div className="flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={resetModal}
                                        className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg flex items-center gap-2"
                                    >
                                        Try Again
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Modal Footer */}
                    {step === 'select' && (
                        <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={closeModal}
                                className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                Skip for now
                            </motion.button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}