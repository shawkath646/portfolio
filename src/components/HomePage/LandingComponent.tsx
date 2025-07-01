"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import {
    FaCode,
    FaAndroid,
    FaBriefcase,
    FaProjectDiagram,
    FaGlobe,
    FaEnvelope,
    FaChevronDown,
    FaUserGraduate,
    FaMapMarkerAlt,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import techBg from "@/assets/v627-aew-09-technologybackground.jpg";
import AnimatedHeading from "./AnimatedHeading";

// Animation Variants
const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};

const delayedFade: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { delay: 1, duration: 0.7 },
    },
};

export default function LandingComponent() {
    return (
        <div className="relative min-h-screen flex justify-center">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src={techBg}
                    alt="Tech background"
                    fill
                    className="object-cover brightness-75 dark:brightness-50 transition-all duration-700"
                    priority
                />
                <div className="absolute inset-0 bg-white/10 dark:bg-[#0a192f]/30 backdrop-blur-md" />
            </div>

            {/* Main content */}
            <motion.section
                className="relative z-20 px-4 md:px-16 md:py-20 w-full items-start max-w-7xl mt-10 md:mt-20 h-fit"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={containerVariants}
            >
                <AnimatedHeading />

                <div className="mt-4 flex flex-col md:flex-row items-center gap-6">
                    <Image
                        src="/a.png"
                        width={512}
                        height={512}
                        alt="Shawkath Hossain Maruf - Software Developer"
                        className="rounded-full shadow-lg border-4 border-white dark:border-gray-800 h-[128px] w-[128px]"
                        priority
                    />
                    <motion.p
                        className="text-white dark:text-gray-300 bg-white/20 py-1 px-2 rounded-full text-sm w-fit"
                        variants={fadeUp}
                    >
                        <span className="font-medium tracking-widest">@shawkath646:</span> Tech-minded, outdoor lover, and wants to explore everything!
                    </motion.p>
                </div>


                <motion.ul
                    className="mt-6 flex flex-wrap gap-3 max-w-md"
                    variants={fadeUp}
                >
                    {[
                        { icon: <FaCode className="text-blue-500 dark:text-cyan-300" />, text: "Full stack web developer" },
                        { icon: <FaAndroid className="text-green-500 dark:text-green-300" />, text: "Android app developer" },
                        { icon: <FaBriefcase className="text-blue-500 dark:text-cyan-300" />, text: "4 years+ experience" },
                        { icon: <FaProjectDiagram className="text-purple-500 dark:text-purple-300" />, text: "10+ real life projects" },
                        { icon: <FaGlobe className="text-blue-400 dark:text-cyan-200" />, text: "Working remotely" },
                    ].map((item, i) => (
                        <li
                            key={i}
                            className="inline-flex items-center gap-1 bg-blue-100 dark:bg-cyan-900 text-blue-700 dark:text-cyan-200 px-3 py-1 rounded-full text-sm font-medium shadow-md"
                        >
                            {item.icon} {item.text}
                        </li>
                    ))}
                </motion.ul>

                <motion.div
                    className="mt-8 flex flex-col items-start gap-2"
                    variants={fadeUp}
                >
                    <div className="inline-flex items-center gap-2 text-white dark:text-gray-200 text-sm font-medium bg-black/20 px-2 py-1 rounded-lg">
                        <FaUserGraduate className="text-blue-500 dark:text-cyan-400" />
                        Studying CSE in Sejong University
                    </div>
                    <div className="inline-flex items-center gap-2 text-white dark:text-gray-200 text-sm font-medium bg-black/20 px-2 py-1 rounded-lg">
                        <FaMapMarkerAlt className="text-red-500 dark:text-red-400" />
                        Lives in Seoul, South Korea
                    </div>
                </motion.div>

                <motion.div
                    className="mt-10 w-full flex items-center justify-center md:justify-start gap-4"
                    variants={fadeUp}
                >
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-4 py-1.5 text-base sm:px-6 sm:py-2 sm:text-lg rounded-lg font-bold shadow-xl bg-blue-600 dark:bg-cyan-400 text-white dark:text-[#0a192f] hover:bg-blue-700 dark:hover:bg-cyan-300 transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                        <FaEnvelope className="text-lg sm:text-xl" /> Contact me
                    </Link>
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 px-4 py-1.5 text-base sm:px-6 sm:py-2 sm:text-lg rounded-lg font-bold shadow-xl bg-blue-100 dark:bg-cyan-900 text-blue-700 dark:text-cyan-200 hover:bg-blue-200 dark:hover:bg-cyan-800 transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                    >
                        View my works <IoIosArrowForward className="text-lg sm:text-xl" />
                    </Link>
                </motion.div>
            </motion.section>

            {/* Scroll down hint */}
            <motion.div
                className="animate-bounce flex items-center gap-5 w-fit px-4 justify-center absolute left-1/2 -translate-x-1/2 bottom-32 z-30"
                variants={delayedFade}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <span className="uppercase tracking-widest font-semibold text-white dark:text-gray-300 text-xs sm:text-sm text-center leading-none">
                    Scroll down
                </span>
                <FaChevronDown className="text-blue-500 dark:text-cyan-300 text-xl" />
            </motion.div>
        </div>
    );
}
