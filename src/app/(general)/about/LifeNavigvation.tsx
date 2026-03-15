'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { FiArrowUpRight, FiUser, FiHeart, FiUsers } from 'react-icons/fi';

const LifeNavigation = () => {
    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
                staggerChildren: 0.1
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    const links = [
        {
            title: 'Personal Life',
            href: '/about/personal-life',
            icon: FiUser,
            iconTheme: 'text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/40 group-hover:bg-blue-200/50 dark:group-hover:bg-blue-800/50'
        },
        {
            title: 'Love Corner',
            href: '/about/love-corner',
            icon: FiHeart,
            iconTheme: 'text-rose-600 dark:text-rose-400 bg-rose-100/50 dark:bg-rose-900/40 group-hover:bg-rose-200/50 dark:group-hover:bg-rose-800/50'
        },
        {
            title: 'Friends Corner',
            href: '/about/friends-corner',
            icon: FiUsers,
            iconTheme: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/40 group-hover:bg-emerald-200/50 dark:group-hover:bg-emerald-800/50'
        },
    ];

    return (
        <section className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-15">
            <motion.div
                className="bg-white/20 dark:bg-gray-900/20 rounded-2xl p-6 md:p-8 border border-white/50 dark:border-gray-700/50 backdrop-blur-md shadow-sm"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                <div className="mb-8 max-w-xl">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                        Want to know about my life?
                    </h2>
                    <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                        Knowing about my life history maybe little bit complicated!
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {links.map((link) => {
                        const Icon = link.icon;
                        return (
                            <motion.div key={link.title} variants={itemVariants}>
                                <Link
                                    href={link.href}
                                    className="group relative flex items-center justify-between p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-md overflow-hidden"
                                >
                                    {/* Left side: Dedicated Icon + Title */}
                                    <div className="relative z-10 flex items-center gap-3.5">
                                        <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${link.iconTheme}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-base font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300">
                                            {link.title}
                                        </span>
                                    </div>

                                    {/* Right side: Angled arrow */}
                                    <FiArrowUpRight className="relative z-10 w-5 h-5 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transform group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300" />

                                    {/* Subtle universal background slide effect */}
                                    <div className="absolute inset-0 bg-gray-50/40 dark:bg-gray-700/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
};

export default LifeNavigation;