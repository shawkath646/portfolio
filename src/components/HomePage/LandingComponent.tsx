"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation, Variants } from "framer-motion";
import {
    FaCode,
    FaAndroid,
    FaBriefcase,
    FaProjectDiagram,
    FaGlobe,
    FaCloudDownloadAlt,
    FaUserGraduate,
    FaMapMarkerAlt
} from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";

// --- Premium "Mask Reveal" Text Animation ---
const revealWrapper: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
};

const revealWord: Variants = {
    hidden: { y: "120%", opacity: 0, rotateZ: 5 },
    visible: {
        y: "0%",
        opacity: 1,
        rotateZ: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }, // Apple-style easing
    },
};

export default function EnhancedLanding() {
    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Track mouse for the spotlight effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        if (inView) controls.start("visible");
    }, [controls, inView]);

    const titleWords = "Shawkat Hossain Maruf".split(" ");

    // Skill tags with different floating offsets
    const floatingItems = [
        { icon: <FaCode />, text: "Full Stack", delay: 0 },
        { icon: <FaAndroid />, text: "Android Dev", delay: 1.5 },
        { icon: <FaBriefcase />, text: "4+ Years Exp", delay: 0.5 },
        { icon: <FaProjectDiagram />, text: "10+ Projects", delay: 2 },
        { icon: <FaGlobe />, text: "Remote Ready", delay: 1 },
    ];

    return (
        <header
            role="banner"
            ref={ref}
            className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-slate-50 dark:bg-[#050B14]"
        >
            {/* Interactive Mouse Spotlight Background */}
            <div
                className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
                style={{
                    background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.08), transparent 40%)`
                }}
            />

            {/* Ambient Base Gradients */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-125 h-125 rounded-full bg-blue-400 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 rounded-full bg-cyan-300 blur-[150px]" />
            </div>

            <div
                itemScope
                itemType="https://schema.org/Person"
                className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center mt-12"
            >
                {/* Profile Badge */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8 relative group"
                >
                    <div className="absolute inset-0 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 blur-xl opacity-40 group-hover:opacity-60 transition duration-500" />
                    <Image
                        itemProp="image"
                        src="/profile.jpg"
                        width={120}
                        height={120}
                        alt="Shawkat Hossain Maruf"
                        className="relative rounded-full border border-white/20 dark:border-white/10 shadow-2xl z-10"
                        priority
                    />
                    <p
                        itemProp="alternateName"
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/80 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-blue-900 dark:text-cyan-100 border border-white/30 dark:border-white/10 z-20 shadow-sm"
                    >
                        @shawkath646
                    </p>
                </motion.div>

                {/* Staggered Word Reveal Heading */}
                <motion.h1
                    itemProp="name"
                    aria-label="Shawkat Hossain Maruf"
                    className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6"
                    variants={revealWrapper}
                    initial="hidden"
                    animate={controls}
                >
                    {titleWords.map((word, index) => {
                        const isLastWord = index === titleWords.length - 1;

                        return (
                            <span key={index} className="overflow-hidden pb-2">
                                <motion.span className="inline-block origin-bottom-left" variants={revealWord}>
                                    {isLastWord ? (
                                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500">
                                            {word}
                                        </span>
                                    ) : (
                                        `${word} `
                                    )}
                                </motion.span>
                            </span>
                        );
                    })}
                </motion.h1>

                {/* Bio & Status - Scannable List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="max-w-3xl mx-auto w-full"
                >
                    {/* Changed to ul */}
                    <ul className="flex flex-wrap justify-center items-center gap-x-4 gap-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium list-none p-0 m-0">

                        {/* Item 1 */}
                        <li className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-blue-500 dark:text-cyan-400">✨</span>
                                <span>Tech-minded explorer</span>
                            </div>
                            {/* Separator moved INSIDE the li, hidden from screen readers */}
                            <span className="hidden sm:inline text-slate-300 dark:text-slate-700" aria-hidden="true">|</span>
                        </li>

                        {/* Item 2 */}
                        <li className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-green-500 dark:text-green-400">🌲</span>
                                <span>Outdoor lover</span>
                            </div>
                            <span className="hidden md:inline text-slate-300 dark:text-slate-700" aria-hidden="true">|</span>
                        </li>

                        {/* On smaller screens, force a wrap here. Changed to an empty li */}
                        <li className="w-full md:w-auto h-0 md:h-auto" aria-hidden="true" />

                        {/* Item 3 */}
                        <li className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <FaUserGraduate className="text-purple-500 dark:text-purple-400" />
                                <span>CSE @ Sejong University</span>
                            </div>
                            <span className="hidden sm:inline text-slate-300 dark:text-slate-700" aria-hidden="true">|</span>
                        </li>

                        {/* Item 4 (No trailing separator needed) */}
                        <li className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-rose-500 dark:text-rose-400" />
                            <span>Seoul, South Korea</span>
                        </li>

                    </ul>
                </motion.div>

                {/* Floating "Ecosystem" Tags */}
                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="flex flex-wrap justify-center gap-3 mt-10 max-w-3xl list-none p-0 m-0"
                >
                    {floatingItems.map((item, i) => (
                        <motion.li
                            key={i}
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: item.delay
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm font-medium shadow-sm hover:scale-105 transition-transform cursor-default"
                        >
                            <span aria-hidden="true" className="text-blue-500 dark:text-cyan-400">
                                {item.icon}
                            </span>
                            {item.text}
                        </motion.li>
                    ))}
                </motion.ul>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="mt-12 flex flex-col sm:flex-row items-center gap-4"
                >
                    <Link
                        href="/contact"
                        className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-sm sm:text-base overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30"
                    >
                        <span className="absolute inset-0 bg-linear-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <FaCloudDownloadAlt className="relative z-10 text-lg group-hover:text-white" />
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300">Download CV</span>
                    </Link>

                    <Link
                        href="/projects"
                        className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white/50 dark:bg-transparent text-slate-900 dark:text-white rounded-full font-bold text-sm sm:text-base border border-slate-300 dark:border-white/20 transition-all hover:border-blue-500 dark:hover:border-cyan-400 hover:bg-white dark:hover:bg-white/5"
                    >
                        <span>View my works</span>
                        <IoIosArrowForward className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
            >
                <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <IoIosArrowDown className="text-slate-500 dark:text-slate-400" />
                </motion.div>
            </motion.div>
        </header>
    );
}