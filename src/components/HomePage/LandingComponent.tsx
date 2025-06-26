"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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

export default function LandingComponent() {
    return (
        <div className="relative min-h-screen flex justify-center">
            {/* Fullscreen Tech background with overlay and blur */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src={techBg}
                    alt="Tech background"
                    fill
                    className="object-cover brightness-75 dark:brightness-50 transition-all duration-700"
                    priority
                />
                {/* Overlay with blur */}
                <div className="absolute inset-0 bg-white/10 dark:bg-[#0a192f]/30 backdrop-blur-md" />
            </div>

            {/* Main content */}
            <section
                className="relative z-20 px-4 md:px-16 md:py-20 w-full items-start md:w-fit mt-10 md:mt-20 h-fit"
            >
                <motion.h1
                    className="text-4xl sm:text-6xl font-extrabold text-cyan-400 drop-shadow-md text-left"
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                >
                    Hi, I'm Shawkat Hossain Maruf
                </motion.h1>
                <motion.p
                    className="mt-4 text-white dark:text-gray-300 bg-white/20 py-1 px-2 rounded-full text-sm w-fit"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <span className="font-medium tracking-widest">@shawkath646:</span> Tech-minded, outdoor lover, and wants to explore everything!
                </motion.p>
                {/* Tags with icons */}
                <motion.ul
                    className="mt-6 flex flex-wrap gap-3 max-w-md"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                >
                    <li className="inline-flex items-center gap-1 bg-blue-100 dark:bg-cyan-900 text-blue-700 dark:text-cyan-200 px-3 py-1 rounded-full text-sm font-medium shadow-md">
                        <FaCode className="text-blue-500 dark:text-cyan-300" /> Full stack web developer
                    </li>
                    <li className="inline-flex items-center gap-1 bg-blue-100 dark:bg-cyan-900 text-blue-700 dark:text-cyan-200 px-3 py-1 rounded-full text-sm font-medium shadow-md">
                        <FaAndroid className="text-green-500 dark:text-green-300" /> Android app developer
                    </li>
                    <li className="inline-flex items-center gap-1 bg-blue-100 dark:bg-cyan-900 text-blue-700 dark:text-cyan-200 px-3 py-1 rounded-full text-sm font-medium shadow-md">
                        <FaBriefcase className="text-blue-500 dark:text-cyan-300" /> 4 years+ experience
                    </li>
                    <li className="inline-flex items-center gap-1 bg-blue-100 dark:bg-cyan-900 text-blue-700 dark:text-cyan-200 px-3 py-1 rounded-full text-sm font-medium shadow-md">
                        <FaProjectDiagram className="text-purple-500 dark:text-purple-300" /> 10+ real life projects
                    </li>
                    <li className="inline-flex items-center gap-1 bg-blue-100 dark:bg-cyan-900 text-blue-700 dark:text-cyan-200 px-3 py-1 rounded-full text-sm font-medium shadow-md">
                        <FaGlobe className="text-blue-400 dark:text-cyan-200" /> Working remotely
                    </li>
                </motion.ul>

                {/* Other info: university & location */}
                <motion.div
                    className="mt-8 flex flex-col items-start gap-2"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
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

                {/* Action Buttons */}
                <motion.div
                    className="mt-10 w-full flex items-center justify-center md:justify-start gap-4"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.7 }}
                >
                    <Link
                        href="/contact"
                        className="
      inline-flex items-center gap-2
      px-4 py-1.5 text-base
      sm:px-6 sm:py-2 sm:text-lg
      rounded-lg font-bold shadow-xl
      bg-blue-600 dark:bg-cyan-400 text-white dark:text-[#0a192f]
      hover:bg-blue-700 dark:hover:bg-cyan-300
      transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
    "
                    >
                        <FaEnvelope className="text-lg sm:text-xl" /> Contact me
                    </Link>
                    <Link
                        href="/projects"
                        className="
      inline-flex items-center gap-2
      px-4 py-1.5 text-base
      sm:px-6 sm:py-2 sm:text-lg
      rounded-lg font-bold shadow-xl
      bg-blue-100 dark:bg-cyan-900 text-blue-700 dark:text-cyan-200
      hover:bg-blue-200 dark:hover:bg-cyan-800
      transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300
    "
                    >
                        View my works <IoIosArrowForward className="text-lg sm:text-xl" />
                    </Link>
                </motion.div>
            </section>
            {/* Scroll down hint */}
            <motion.div
                className="animate-bounce flex items-center gap-5 w-fit px-4 justify-center absolute left-1/2 -translate-x-1/2 bottom-32 z-30"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.25, duration: 0.4 }}
            >
                <span className="uppercase tracking-widest font-semibold text-white dark:text-gray-300 text-xs sm:text-sm text-center leading-none">
                    Scroll down
                </span>
                <FaChevronDown className="text-blue-500 dark:text-cyan-300 text-xl" />
            </motion.div>
        </div>
    );
};