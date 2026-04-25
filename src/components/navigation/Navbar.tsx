"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { AnimatePresence, motion } from "motion/react";
import { FaBars } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { isLocale } from "@/lib/locale";

const navigation = [
    { key: "home", href: "/" },
    { key: "about", href: "/about" },
    { key: "creations", href: "/creations" },
    { key: "blogs", href: "/blogs" },
    { key: "contact", href: "/contact" },
] as const;

type NavKey = (typeof navigation)[number]["key"];
type NavItemConfig = (typeof navigation)[number];
type NavLanguagePack = Partial<Record<NavKey | `${NavKey}-desc` | "top-text", string>>;

const OutsideClickHandler = ({
    open,
    close,
    containerRef,
}: {
    open: boolean;
    close: () => void;
    containerRef: React.RefObject<HTMLElement | null>;
}) => {
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
            if (open && containerRef.current && !containerRef.current.contains(event.target as Node)) {
                close();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        };
    }, [open, close, containerRef]);

    return null;
};
export const normalizePath = (path: string): string => {
  const segments = path.split('/').filter(Boolean);

  if (segments.length > 0 && isLocale(segments[0])) {
    return '/' + segments.slice(1).join('/');
  }

  return path;
};

const getLocaleFromPath = (path: string): string | null => {
    const segments = path.split('/').filter(Boolean);

    if (segments.length > 0 && isLocale(segments[0])) {
        return segments[0];
    }

    return null;
};

const getLocalizedHref = (href: string, locale: string | null): string => {
    if (!locale) {
        return href;
    }

    if (href === "/") {
        return `/${locale}`;
    }

    return `/${locale}${href}`;
};

const NavItem = ({
    item,
    currentPath,
    isMobile = false,
    onClose,
    navLanguagePack,
}: {
    item: NavItemConfig;
    currentPath: string;
    isMobile?: boolean;
    onClose?: () => void;
    navLanguagePack: NavLanguagePack;
}) => {
    const normalizedPath = normalizePath(currentPath);
    const currentLocale = getLocaleFromPath(currentPath);
    const localizedHref = getLocalizedHref(item.href, currentLocale);
    const itemLabel = navLanguagePack[item.key] ?? item.key;
    const itemDescription = navLanguagePack[`${item.key}-desc`];
    const itemAriaLabel = itemDescription ? `${itemLabel}: ${itemDescription}` : itemLabel;

    const isActive =
        item.href === "/"
            ? normalizedPath === "/"
            : normalizedPath.startsWith(item.href);

    return (
        <Link
            href={localizedHref}
            onClick={onClose}
            className={`group relative rounded-md px-3 py-2 text-sm font-semibold transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
                ${isMobile ? 'block w-full text-left' : ''}
                ${isActive
                    ? 'text-blue-700 dark:text-cyan-300'
                    : 'text-gray-800 dark:text-gray-100 hover:text-blue-700 dark:hover:text-cyan-300'
                }
            `}
            aria-current={isActive ? 'page' : undefined}
            aria-label={itemAriaLabel}
            title={itemDescription}
        >
            <span className="relative z-10">{itemLabel}</span>

            {!isMobile && (
                <span
                    className={`
                        absolute left-1/2 bottom-1 h-0.5 bg-linear-to-r from-blue-500 via-cyan-400 to-blue-700 rounded-full 
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
};

export default function Navbar({ navLanguagePack }: { navLanguagePack: NavLanguagePack }) {
    const currentPath = usePathname();
    const currentLocale = getLocaleFromPath(currentPath);
    const brandHref = getLocalizedHref("/", currentLocale);
    const disclosureButtonId = "main-nav-toggle";
    const disclosurePanelId = "main-nav-panel";

    const navRef = useRef<HTMLElement>(null);

    return (
        <Disclosure
            as="header"
            ref={navRef}
            role="navigation"
            className="fixed left-0 top-0 w-full z-50 bg-white/70 dark:bg-[#0a192f]/80 backdrop-blur shadow-sm transition-all duration-300"
            aria-label="Main navigation"
        >
            {({ open, close }) => (
                <>
                    <OutsideClickHandler open={open} close={close} containerRef={navRef} />

                    <div className="mx-auto container px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between items-center">
                            {/* Logo/Brand */}
                            <div className="shrink-0 flex items-center">
                                <Link
                                    href={brandHref}
                                    className="font-extrabold text-xl text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded"
                                    aria-label={`${navLanguagePack["top-text"]} - ${navLanguagePack.home}`}
                                >
                                    <span>{navLanguagePack["top-text"]}</span>
                                </Link>
                            </div>

                            <nav
                                className="hidden md:flex space-x-1"
                                aria-label="Main menu"
                                role="navigation"
                            >
                                <ul className="flex space-x-1" role="menubar">
                                    {navigation.map((item) => (
                                        <li key={item.key} role="none">
                                            <NavItem
                                                item={item}
                                                currentPath={currentPath}
                                                navLanguagePack={navLanguagePack}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            <div className="flex md:hidden">
                                <DisclosureButton
                                    id={disclosureButtonId}
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-800 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-[#112240] focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
                                    aria-label={open ? "Close main menu" : "Open main menu"}
                                    aria-expanded={open}
                                    aria-controls={disclosurePanelId}
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

                    <AnimatePresence>
                        {open && (
                            <DisclosurePanel id={disclosurePanelId} static className="md:hidden">
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
                                                key={item.key}
                                                item={item}
                                                currentPath={currentPath}
                                                isMobile={true}
                                                onClose={close}
                                                navLanguagePack={navLanguagePack}
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
    );
}