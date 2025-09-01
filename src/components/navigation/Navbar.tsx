"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { memo, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { navbarDisallowedPaths } from "@/data/pathsConfig";
import { FaBars } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

// Navigation configuration with SEO-friendly structure
const navigation = [
    { name: "Home", href: "/", description: "Welcome to my portfolio" },
    { name: "About", href: "/about", description: "Learn about my background and experience" },
    { name: "Projects", href: "/projects", description: "View my latest projects and work" },
    { name: "Blog", href: "/blog", description: "Read my thoughts and tutorials" },
    { name: "Contact", href: "/contact", description: "Get in touch with me" },
];

// Memoized navigation item component for performance
const NavItem = memo<{
    item: typeof navigation[0];
    currentPath: string;
    isMobile?: boolean;
}>(({ item, currentPath, isMobile = false }) => {
    const isActive = currentPath === item.href;
    
    return (
        <Link
            href={item.href}
            className={`group relative rounded-md px-3 py-2 text-sm font-semibold transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
                ${isMobile ? 'block w-full text-left' : ''}
                ${isActive 
                    ? 'text-blue-700 dark:text-cyan-300' 
                    : 'text-gray-800 dark:text-gray-100 hover:text-blue-700 dark:hover:text-cyan-300'
                }
            `}
            aria-current={isActive ? 'page' : undefined}
            title={item.description}
        >
            <span className="relative z-10">{item.name}</span>
            {/* Animated underline for desktop */}
            {!isMobile && (
                <span
                    className={`
                        absolute left-1/2 bottom-1 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-700 rounded-full 
                        transition-all duration-300 
                        ${isActive 
                            ? 'w-3/5 group-hover:w-4/5' 
                            : 'w-0 group-hover:w-3/5'
                        }
                    `}
                    style={{ transform: "translateX(-50%)" }}
                    aria-hidden="true"
                />
            )}
        </Link>
    );
});

NavItem.displayName = 'NavItem';

export default function Navbar() {
    const currentPath = usePathname();
    
    // Memoize path check for performance
    const shouldShowNavbar = useMemo(
        () => !navbarDisallowedPaths.some((path) => currentPath.startsWith(path)),
        [currentPath]
    );
    
    if (!shouldShowNavbar) return null;

    return (
        <header role="banner">
            <Disclosure 
                as="nav" 
                className="fixed left-0 top-0 w-full z-50 bg-white/70 dark:bg-[#0a192f]/80 backdrop-blur shadow-sm transition-all duration-300"
                aria-label="Main navigation"
            >
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 justify-between items-center">
                                {/* Logo/Brand */}
                                <div className="flex-shrink-0 flex items-center">
                                    <Link 
                                        href="/" 
                                        className="font-extrabold text-xl text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded"
                                        aria-label="Shawkat Hossain Maruf - Home"
                                    >
                                        <span>SH MARUF</span>
                                    </Link>
                                </div>
                                
                                {/* Desktop Navigation */}
                                <nav 
                                    className="hidden md:flex space-x-1"
                                    aria-label="Main menu"
                                    role="navigation"
                                >
                                    <ul className="flex space-x-1" role="menubar">
                                        {navigation.map((item) => (
                                            <li key={item.name} role="none">
                                                <NavItem 
                                                    item={item} 
                                                    currentPath={currentPath}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                                {/* Mobile menu button */}
                                <div className="flex md:hidden">
                                    <DisclosureButton 
                                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-800 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-[#112240] focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
                                        aria-label={open ? "Close main menu" : "Open main menu"}
                                        aria-expanded={open}
                                    >
                                        <AnimatePresence mode="wait" initial={false}>
                                            {open ? (
                                                <motion.span
                                                    key="close"
                                                    initial={{ opacity: 0, scale: 0.7, rotate: -90 }}
                                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                                    exit={{ opacity: 0, scale: 0.7, rotate: 90 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="flex"
                                                >
                                                    <RxCross2 className="block h-6 w-6" aria-hidden="true" />
                                                </motion.span>
                                            ) : (
                                                <motion.span
                                                    key="menu"
                                                    initial={{ opacity: 0, scale: 0.7, rotate: 90 }}
                                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                                    exit={{ opacity: 0, scale: 0.7, rotate: -90 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="flex"
                                                >
                                                    <FaBars className="block h-6 w-6" aria-hidden="true" />
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </DisclosureButton>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Navigation Menu */}
                        <AnimatePresence>
                            {open && (
                                <DisclosurePanel static className="md:hidden">
                                    <motion.div
                                        initial={{ opacity: 0, y: -24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -24 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="origin-top bg-white/95 dark:bg-[#0a192f]/95 backdrop-blur-md shadow-lg border-t border-gray-200/20 dark:border-gray-700/20"
                                    >
                                        <nav 
                                            className="px-4 pt-2 pb-4 space-y-1"
                                            aria-label="Mobile menu"
                                            role="navigation"
                                        >
                                            {navigation.map((item) => (
                                                <NavItem
                                                    key={item.name}
                                                    item={item}
                                                    currentPath={currentPath}
                                                    isMobile={true}
                                                />
                                            ))}
                                        </nav>
                                    </motion.div>
                                </DisclosurePanel>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </Disclosure>
        </header>
    );
}