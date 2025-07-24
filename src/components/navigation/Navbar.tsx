"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { FaBars } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";


const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
];

export default function Navbar() {

    const currentPath = usePathname();

    return (
        <header>
            <Disclosure as="nav" className="fixed left-0 top-0 w-full z-50 bg-white/70 dark:bg-[#0a192f]/80 backdrop-blur shadow">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 justify-between items-center">
                                <div className="flex-shrink-0 flex items-center">
                                    <Link href="/" className="font-extrabold text-xl text-blue-600 dark:text-cyan-400">
                                        SH MARUF
                                    </Link>
                                </div>
                                <ul className="hidden md:flex space-x-1">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className={`group relative rounded-md px-3 py-2 text-sm font-semibold transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
        ${currentPath === item.href 
            ? 'text-blue-700 dark:text-cyan-300' 
            : 'text-gray-800 dark:text-gray-100 hover:text-blue-700 dark:hover:text-cyan-300'
        }
        `}
                                            >
                                                <span className="relative z-10">{item.name}</span>
                                                {/* Animated underline */}
                                                <span
                                                    className={`
          absolute left-1/2 bottom-1 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-700 rounded-full 
          transition-all duration-300 
          ${currentPath === item.href 
            ? 'w-3/5 group-hover:w-4/5' 
            : 'w-0 group-hover:w-3/5'
          }
        `}
                                                    style={{ transform: "translateX(-50%)" }}
                                                />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex md:hidden">
                                    {/* Mobile menu button */}
                                    <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-800 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-[#112240] focus:outline-none">
                                        <span className="sr-only">Open main menu</span>
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
                                <DisclosurePanel static className="md:hidden">
                                    <motion.ul
                                        initial={{ opacity: 0, y: -24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -24 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="origin-top space-y-1 px-2 pb-3 pt-2 shadow-lg"
                                    >
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={`block rounded-md px-3 py-2 text-base font-semibold transition-all duration-200
        hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 dark:hover:from-[#112240] dark:hover:to-[#1e293b]
        hover:pl-5
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
        ${currentPath.startsWith(item.href)
            ? 'text-blue-700 dark:text-cyan-300' 
            : 'text-gray-800 dark:text-gray-100 hover:text-blue-700 dark:hover:text-cyan-300'
        }
        `}
                                                    style={{
                                                        transitionProperty: "background, color, padding-left",
                                                    }}
                                                >
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </motion.ul>
                                </DisclosurePanel>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </Disclosure>
        </header>
    );
}