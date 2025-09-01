"use client";
import { useState, useTransition, useMemo, useCallback, memo } from "react";
import { motion } from "motion/react";
import { GeneratePasswordModal, GeneratePasswordButton } from "@/modals/GeneratePasswordModal";
import removePassword from "@/actions/secure/removePassword";
import {
    FiKey,
    FiTrash2,
    FiMonitor,
    FiClock,
    FiLoader,
    FiFilter,
} from "react-icons/fi";
import { AddressType } from "@/utils/getAddressFromIP";

// Memoized Statistics Card Component
const StatCard = memo<{
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    className?: string;
}>(({ title, value, icon: Icon, className = "" }) => (
    <div className={`rounded-2xl p-4 backdrop-blur-sm ${className}`}>
        <div className="flex items-center gap-3">
            <Icon className="text-lg" aria-hidden="true" />
            <div>
                <p className="text-sm opacity-80">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    </div>
));

StatCard.displayName = 'StatCard';

// Memoized Password Card Component
const PasswordCard = memo<{
    password: PasswordObjectType;
    index: number;
    onDelete: (id: string) => void;
    deletingId: string | null;
}>(({ password, index, onDelete, deletingId }) => {
    const isExpired = new Date(password.expiresAt) < new Date();
    const expiresIn = Math.ceil((new Date(password.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const isExpiringSoon = expiresIn <= 2 && expiresIn > 0;
    
    const cardId = `password-${password.id}`;
    
    return (
        <motion.article
            id={cardId}
            key={password.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`group relative rounded-2xl border p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ${
                isExpired 
                    ? 'border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-900/10' 
                    : isExpiringSoon
                    ? 'border-yellow-300 dark:border-yellow-700 bg-yellow-50/30 dark:bg-yellow-900/10'
                    : 'border-gray-200 dark:border-gray-600'
            }`}
            role="article"
            aria-labelledby={`${cardId}-title`}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative">
                {/* Header */}
                <header className="flex items-center gap-4 mb-4 pr-16">
                    <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl" aria-hidden="true">
                        <FiKey className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h3 
                            id={`${cardId}-title`}
                            className="text-xl font-semibold text-gray-900 dark:text-white mb-1"
                        >
                            {password.siteCode.charAt(0).toUpperCase() + password.siteCode.slice(1).replace(/-/g, ' ')}
                        </h3>
                        <div className="flex items-center gap-3">
                            <span 
                                className={`px-3 py-1 text-sm font-medium rounded-full ${password.isUsed
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                }`}
                                aria-label={password.isUsed ? "Password is active" : "Password is unused"}
                            >
                                {password.isUsed ? '✓ Active' : '⏳ Unused'}
                            </span>
                            <span 
                                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full font-mono"
                                aria-label={`Password length: ${password.length} characters`}
                            >
                                {password.length} chars
                            </span>
                        </div>
                    </div>
                </header>

                {/* Password Display */}
                <section className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[80px]">
                            Password:
                        </span>
                        <code 
                            className="font-mono bg-white dark:bg-gray-800 px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-600 select-all flex-1 break-all"
                            aria-label="Generated password"
                        >
                            {password.password}
                        </code>
                    </div>
                </section>

                {/* Details */}
                <dl className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {password.isUsed && password.device && (
                        <div className="flex items-center gap-2">
                            <FiMonitor className="text-blue-500 flex-shrink-0" aria-hidden="true" />
                            <dt className="sr-only">Device:</dt>
                            <dd>Device: {typeof password.device === 'string' ? password.device : password.device.city}</dd>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <FiClock className="text-green-500 flex-shrink-0" aria-hidden="true" />
                        <dt className="sr-only">Created:</dt>
                        <dd>
                            <time dateTime={password.createdAt.toISOString()}>
                                Created: {new Date(password.createdAt).toLocaleDateString()}
                            </time>
                        </dd>
                    </div>

                    <div className="flex items-center gap-2">
                        <FiClock className="text-orange-500 flex-shrink-0" aria-hidden="true" />
                        <dt className="sr-only">Expires:</dt>
                        <dd>
                            <time dateTime={password.expiresAt.toISOString()}>
                                Expires: {new Date(password.expiresAt).toLocaleDateString()}
                            </time>
                        </dd>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-purple-500" aria-hidden="true">🔢</span>
                        <dt className="sr-only">Usage limit:</dt>
                        <dd>Usage: {password.usableTimes === 'unlimited' ? 'Unlimited' : `${password.usableTimes} times`}</dd>
                    </div>
                </dl>
            </div>

            {/* Status Badge */}
            {isExpired && (
                <div 
                    className="absolute top-3 right-16 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium rounded-full"
                    aria-label="Password has expired"
                >
                    Expired
                </div>
            )}
            {isExpiringSoon && !isExpired && (
                <div 
                    className="absolute top-3 right-16 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full"
                    aria-label={`Password expires in ${expiresIn} day${expiresIn !== 1 ? 's' : ''}`}
                >
                    Expires in {expiresIn} day{expiresIn !== 1 ? 's' : ''}
                </div>
            )}

            {/* Delete Button */}
            {!password.isUsed && !isExpired && (
                <motion.button
                    whileHover={{ scale: deletingId === password.id ? 1 : 1.05 }}
                    whileTap={{ scale: deletingId === password.id ? 1 : 0.97 }}
                    onClick={() => onDelete(password.id)}
                    disabled={deletingId === password.id}
                    className="absolute top-3 right-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-red-200 dark:border-red-800 bg-red-50/70 dark:bg-red-900/20 text-red-600 dark:text-red-300 shadow-sm hover:bg-red-100 dark:hover:bg-red-900/30 hover:border-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Revoke password for ${password.siteCode}`}
                >
                    {deletingId === password.id ? (
                        <>
                            <FiLoader size={16} className="animate-spin" aria-hidden="true" />
                            <span>Deleting...</span>
                        </>
                    ) : (
                        <>
                            <FiTrash2 size={16} aria-hidden="true" />
                            <span>Revoke</span>
                        </>
                    )}
                </motion.button>
            )}
        </motion.article>
    );
});

PasswordCard.displayName = 'PasswordCard';

export interface PasswordObjectType {
    id: string;
    siteCode: string;
    password: string;
    isUsed: boolean;
    usableTimes: number | 'unlimited';
    device?: string | AddressType | null;
    createdAt: Date;
    expiresAt: Date;
    length: number;
    usedTime: number;
}

interface PasswordManagementProps {
    passwordList: PasswordObjectType[];
    onPasswordGenerated?: (password: PasswordObjectType) => void;
}

export default function PasswordManagement({ passwordList, onPasswordGenerated }: PasswordManagementProps) {
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'unused' | 'expired'>('all');

    // Memoized statistics calculation
    const stats = useMemo(() => ({
        total: passwordList.length,
        active: passwordList.filter(p => p.isUsed).length,
        unused: passwordList.filter(p => !p.isUsed && new Date(p.expiresAt) >= new Date()).length,
        expired: passwordList.filter(p => new Date(p.expiresAt) < new Date()).length,
    }), [passwordList]);

    // Memoized filtered passwords
    const filteredPasswords = useMemo(() => {
        return passwordList.filter(password => {
            const isExpired = new Date(password.expiresAt) < new Date();
            switch (filter) {
                case 'active': return password.isUsed;
                case 'unused': return !password.isUsed && !isExpired;
                case 'expired': return isExpired;
                default: return true;
            }
        });
    }, [passwordList, filter]);

    // Optimized delete handler
    const handleDeletePassword = useCallback((passwordId: string) => {
        setDeletingId(passwordId);
        startTransition(async () => {
            try {
                await removePassword(passwordId);
                setDeletingId(null);
            } catch (error) {
                console.error('Failed to delete password:', error);
                setDeletingId(null);
            }
        });
    }, []);

    // Optimized modal handlers
    const handleOpenModal = useCallback(() => setShowGenerateModal(true), []);
    const handleCloseModal = useCallback(() => setShowGenerateModal(false), []);
    
    // Filter change handler
    const handleFilterChange = useCallback((newFilter: typeof filter) => {
        setFilter(newFilter);
    }, []);

    return (
        <>
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                aria-labelledby="password-management-title"
                role="region"
            >
                {/* Section Header */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div 
                            className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm"
                            aria-hidden="true"
                        >
                            <FiKey className="text-3xl text-white" />
                        </div>
                        <div>
                            <h1 
                                id="password-management-title"
                                className="text-3xl font-bold text-white mb-2"
                            >
                                Password Management
                            </h1>
                            <p className="text-purple-100">
                                Secure password management for personal access
                            </p>
                        </div>
                    </div>

                    <GeneratePasswordButton
                        isOpen={showGenerateModal}
                        onOpen={handleOpenModal}
                    />
                </header>

                {/* Filter Controls */}
                {passwordList.length > 0 && (
                    <nav 
                        aria-labelledby="password-filters-title" 
                        className="mb-6"
                    >
                        <h2 
                            id="password-filters-title" 
                            className="sr-only"
                        >
                            Filter Options
                        </h2>
                        <div className="flex items-center justify-end">
                            <div className="flex items-center gap-2">
                                <FiFilter 
                                    className="text-white/80" 
                                    aria-hidden="true" 
                                />
                                <span className="text-white/80 text-sm font-medium">
                                    Filter:
                                </span>
                                <div 
                                    role="tablist" 
                                    className="flex rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm"
                                    aria-label="Password filter options"
                                >
                                    {[
                                        { key: 'all', label: 'All', count: stats.total },
                                        { key: 'active', label: 'Active', count: stats.active },
                                        { key: 'unused', label: 'Unused', count: stats.unused },
                                        { key: 'expired', label: 'Expired', count: stats.expired },
                                    ].map(({ key, label, count }) => (
                                        <button
                                            key={key}
                                            role="tab"
                                            aria-selected={filter === key}
                                            aria-controls="password-grid"
                                            onClick={() => handleFilterChange(key as typeof filter)}
                                            className={`px-4 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                                                filter === key
                                                    ? 'bg-white/20 text-white'
                                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                            }`}
                                        >
                                            {label} ({count})
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </nav>
                )}

                {/* Passwords Grid */}
                <main 
                    id="password-grid"
                    role="main"
                    aria-labelledby="password-list-title"
                    aria-live="polite"
                    aria-busy={isPending}
                >
                    <h2 id="password-list-title" className="sr-only">
                        Password List ({filteredPasswords.length} passwords)
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredPasswords.map((password, index) => (
                            <PasswordCard
                                key={password.id}
                                password={password}
                                index={index}
                                onDelete={handleDeletePassword}
                                deletingId={deletingId}
                            />
                        ))}

                        {/* No results for filter */}
                        {filteredPasswords.length === 0 && passwordList.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center py-12"
                                role="status"
                                aria-live="polite"
                            >
                                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiKey className="text-3xl text-white/60" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-semibold text-white/80 mb-2">
                                    No passwords match your filter
                                </h3>
                                <p className="text-white/60">
                                    Try selecting a different filter to see more passwords
                                </p>
                            </motion.div>
                        )}

                        {/* Empty state */}
                        {passwordList.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center py-12"
                                role="status"
                                aria-live="polite"
                            >
                                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiKey className="text-3xl text-white/60" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-semibold text-white/80 mb-2">
                                    No passwords generated yet
                                </h3>
                                <p className="text-white/60">
                                    Click "Generate New" to create your first secure password
                                </p>
                            </motion.div>
                        )}
                    </div>
                </main>
            </motion.section>
            
            <GeneratePasswordModal
                open={showGenerateModal}
                onClose={handleCloseModal}
                onSuccess={handleCloseModal}
            />
        </>
    );
}