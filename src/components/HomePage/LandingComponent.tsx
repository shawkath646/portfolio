"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
    FaCode,
    FaAndroid,
    FaBriefcase,
    FaProjectDiagram,
    FaGlobe,
    FaChevronDown,
    FaUserGraduate,
    FaMapMarkerAlt,
    FaCloudDownloadAlt
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import AnimatedHeading from "./AnimatedHeading";
import useReducedMotion from "@/hooks/useReducedMotion";

// Animation Variants with performance optimizations
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.05,
            when: "beforeChildren",
        },
    },
};

const fadeUp: Variants = {
    hidden: { 
        opacity: 0, 
        y: 20,
        transition: { duration: 0.2 } 
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};

const delayedFade: Variants = {
    hidden: { 
        opacity: 0, 
        y: 20,
        transition: { duration: 0.2 }
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: { 
            delay: 0.8, 
            duration: 0.5,
            ease: "easeOut"
        },
    },
};

// Profile image component
function ProfileImage() {
    return (
        <Image
            src="/profile.jpg"
            width={512}
            height={512}
            alt="Shawkath Hossain Maruf - Software Developer"
            className="rounded-full shadow-lg border-4 border-white dark:border-gray-800 h-[128px] w-[128px]"
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 128px, 128px"
        />
    );
}

// Animated background component with blue theme
function AnimatedBackground() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Main gradient background - Lighter for light mode, darker for dark mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-300 dark:from-slate-900/50 dark:via-blue-900/50 dark:to-slate-800/50" />
            
            {/* Overlay gradients for depth */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-300/40 via-transparent to-cyan-300/30 dark:from-blue-800/50 dark:via-transparent dark:to-cyan-800/30" />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-cyan-300/20 to-blue-400/30 dark:from-transparent dark:via-blue-700/20 dark:to-slate-900/40" />
            
            {/* Animated gradient orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-300/30 dark:bg-cyan-400/20 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/30 dark:bg-blue-500/20 rounded-full blur-3xl animate-float-reverse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/20 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
            
            {/* Geometric shapes */}
            <div className="absolute top-20 right-20 w-32 h-32 border-2 border-blue-500/30 dark:border-cyan-300/20 rounded-lg rotate-12 animate-spin-slow" />
            <div className="absolute bottom-40 left-40 w-24 h-24 border-2 border-cyan-500/30 dark:border-blue-300/20 rounded-full animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="absolute top-1/3 right-1/4 w-16 h-16 border-2 border-blue-400/40 dark:border-cyan-400/30 rotate-45 animate-bounce-gentle" style={{ animationDuration: '10s' }} />
            
            {/* Dot pattern overlay */}
            <div className="absolute inset-0 opacity-[0.15] dark:opacity-10" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
                backgroundSize: '30px 30px'
            }} />
            
            {/* Light rays effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent dark:from-white/5 dark:via-transparent dark:to-transparent" />
        </div>
    );
}

// Skill item component
function SkillItem({ icon, text, index }: { icon: React.ReactNode; text: string; index: number }) {
    return (
        <motion.li
            custom={index}
            variants={{
                hidden: { opacity: 0, x: -10, transition: { duration: 0.2 } },
                visible: (i: number) => ({
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.3, delay: 0.05 * i }
                })
            }}
            className="inline-flex items-center gap-1 bg-blue-100 dark:bg-cyan-900 text-blue-700 dark:text-cyan-200 px-3 py-1 rounded-full text-sm font-medium shadow-md"
            role="listitem"
        >
            <span className="flex items-center justify-center" aria-hidden="true">
                {icon}
            </span>
            <span>{text}</span>
        </motion.li>
    );
}

export default function LandingComponent() {
    // Set up intersection observer for lazy loading
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
        rootMargin: "50px 0px"
    });
    
    // Track scroll state to hide scroll hint
    const [isScrolled, setIsScrolled] = React.useState(false);
    
    // Use reduced motion preference
    const prefersReducedMotion = useReducedMotion(controls);

    React.useEffect(() => {
        if (inView && !prefersReducedMotion) {
            controls.start("visible");
        }
    }, [controls, inView, prefersReducedMotion]);
    
    // Hide scroll hint when user scrolls
    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return (
        <section aria-labelledby="hero-title" className="relative min-h-screen flex justify-center pt-20 sm:pt-18 md:pt-0">
            
            <AnimatedBackground />

            {/* Main content */}
            <motion.div
                ref={ref}
                className="relative z-20 px-4 sm:px-6 md:px-16 md:py-20 w-full items-start max-w-7xl mt-6 sm:mt-10 md:mt-20 h-fit"
                initial="hidden"
                animate={controls}
                variants={containerVariants}
                aria-label="Developer introduction"
            >
                <AnimatedHeading />

                <div className="mt-6 md:mt-4 flex flex-col md:flex-row items-center gap-4 md:gap-6">
                    <ProfileImage />
                    <motion.p
                        className="text-white dark:text-gray-300 bg-white/20 py-1 px-2 rounded-full text-xs sm:text-sm w-fit text-center md:text-left"
                        variants={fadeUp}
                    >
                        <span className="font-medium tracking-widest">@shawkath646:</span> Tech-minded, outdoor lover, and wants to explore everything!
                    </motion.p>
                </div>


                <motion.ul
                    className="mt-6 flex flex-wrap gap-2 sm:gap-3 max-w-md"
                    variants={fadeUp}
                    role="list"
                    aria-label="Developer skills and expertise"
                >
                    {[
                        { icon: <FaCode className="text-blue-500 dark:text-cyan-300" />, text: "Full stack web developer" },
                        { icon: <FaAndroid className="text-green-500 dark:text-green-300" />, text: "Android app developer" },
                        { icon: <FaBriefcase className="text-blue-500 dark:text-cyan-300" />, text: "4 years+ experience" },
                        { icon: <FaProjectDiagram className="text-purple-500 dark:text-purple-300" />, text: "10+ real life projects" },
                        { icon: <FaGlobe className="text-blue-400 dark:text-cyan-200" />, text: "Working remotely" },
                    ].map((item, i) => (
                        <SkillItem 
                            key={`skill-${i}`} 
                            icon={item.icon} 
                            text={item.text} 
                            index={i}
                        />
                    ))}
                </motion.ul>

                <motion.div
                    className="mt-6 sm:mt-8 flex flex-col items-start gap-2"
                    variants={fadeUp}
                >
                    <div 
                        className="inline-flex items-center gap-2 text-white dark:text-gray-200 text-xs sm:text-sm font-medium bg-black/20 px-2 py-1 rounded-lg"
                        aria-label="Education information"
                    >
                        <FaUserGraduate className="text-blue-500 dark:text-cyan-400" aria-hidden="true" />
                        <span>Studying CSE in Sejong University</span>
                    </div>
                    <div 
                        className="inline-flex items-center gap-2 text-white dark:text-gray-200 text-xs sm:text-sm font-medium bg-black/20 px-2 py-1 rounded-lg"
                        aria-label="Location information"
                    >
                        <FaMapMarkerAlt className="text-red-500 dark:text-red-400" aria-hidden="true" />
                        <span>Lives in Seoul, South Korea</span>
                    </div>
                </motion.div>

                <motion.nav
                    className="mt-8 sm:mt-10 w-full flex items-center justify-center md:justify-start gap-3 sm:gap-4 flex-wrap"
                    variants={fadeUp}
                    aria-label="Primary call-to-action links"
                >
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm sm:px-6 sm:py-2.5 sm:text-base md:text-lg rounded-lg font-bold shadow-xl bg-blue-600 dark:bg-cyan-400 text-white dark:text-[#0a192f] hover:bg-blue-700 dark:hover:bg-cyan-300 transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        aria-label="Download CV document"
                    >
                        <FaCloudDownloadAlt className="text-base sm:text-lg md:text-xl" aria-hidden="true" /> 
                        <span>Download CV</span>
                    </Link>
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm sm:px-6 sm:py-2.5 sm:text-base md:text-lg rounded-lg font-bold shadow-xl bg-blue-100 dark:bg-cyan-900 text-blue-700 dark:text-cyan-200 hover:bg-blue-200 dark:hover:bg-cyan-800 transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                        aria-label="View portfolio projects"
                    >
                        <span>View my works</span> 
                        <IoIosArrowForward className="text-base sm:text-lg md:text-xl" aria-hidden="true" />
                    </Link>
                </motion.nav>
            </motion.div>

            {/* Scroll down hint */}
            <motion.div
                className="animate-bounce flex items-center gap-3 sm:gap-5 w-fit px-4 justify-center absolute left-1/2 -translate-x-1/2 bottom-10 sm:bottom-15 z-30"
                variants={delayedFade}
                initial="hidden"
                animate={isScrolled ? "hidden" : controls}
                aria-hidden="true"
            >
                <span className="uppercase tracking-widest font-semibold text-white dark:text-gray-300 text-xs sm:text-sm text-center leading-none">
                    Scroll down
                </span>
                <FaChevronDown className="text-blue-500 dark:text-cyan-300 text-lg sm:text-xl" />
            </motion.div>
        </section>
    );
}
