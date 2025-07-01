"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { FaTelegramPlane, FaLinkedin } from "react-icons/fa";
import { FaUpwork } from "react-icons/fa6";
import { SiFiverr } from "react-icons/si";

// Animation Variants
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.3 + i * 0.1,
      duration: 0.4,
    },
  }),
};

export default function OrderNowComponent() {
  const reasons = [
    "Freelance / Remote working expert",
    "4+ years of experience in software development",
    "Pro-level structured code with easy readability",
    "Worked on 10+ real-life, large-scale projects",
    "Friendly and understands client needs",
    "Works until client satisfaction is achieved",
  ];

  return (
    <motion.section
      className="container mx-auto pt-20 px-4 md:px-0"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.h3
        className="text-2xl sm:text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-300"
        variants={fadeInUp}
      >
        Order Now / Hire Me
      </motion.h3>

      <motion.div
        className="my-10 max-w-6xl mx-auto"
        variants={fadeInUp}
      >
        <h4 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
          Why Me?
        </h4>
        <ul className="text-left space-y-3 text-gray-700 dark:text-gray-300">
          {reasons.map((point, idx) => (
            <motion.li
              key={idx}
              className="relative pl-6 before:content-['✔'] before:absolute before:left-0 before:text-green-500 dark:before:text-green-300 font-medium"
              variants={listItemVariants}
              custom={idx}
            >
              {point}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* PLATFORM GROUP */}
      <motion.div
        className="w-full flex flex-col md:flex-row gap-8"
        variants={containerVariants}
      >
        {/* Quick Direct Connect */}
        <motion.div
          className="flex-1 bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50 dark:from-blue-900/40 dark:via-blue-900/30 dark:to-blue-900/40 border border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg p-6 flex flex-col items-center"
          variants={fadeInUp}
        >
          <span className="inline-flex items-center gap-2 mb-2">
            <span className="text-blue-700 dark:text-blue-300 text-xl font-semibold">
              Quick Direct Connect
            </span>
            <span className="bg-blue-200/80 dark:bg-blue-700/50 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded text-xs font-bold">
              Fastest
            </span>
          </span>
          <p className="text-blue-900 dark:text-blue-100 mb-4 text-center text-sm">
            Connect directly for instant response and a more personal collaboration experience.
          </p>
          <div className="flex gap-6 mt-2">
            <a
              href="https://t.me/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center group"
            >
              <FaTelegramPlane className="text-blue-500 group-hover:scale-110 transition-transform text-3xl" />
              <span className="text-xs text-blue-700 dark:text-blue-200 mt-1 font-medium">Telegram</span>
            </a>
            <a
              href="https://www.linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center group"
            >
              <FaLinkedin className="text-blue-700 group-hover:scale-110 transition-transform text-3xl" />
              <span className="text-xs text-blue-700 dark:text-blue-200 mt-1 font-medium">LinkedIn</span>
            </a>
          </div>
        </motion.div>

        {/* Trustable Platforms */}
        <motion.div
          className="flex-1 bg-gradient-to-b from-green-50 via-green-100 to-green-50 dark:from-green-900/40 dark:via-green-900/30 dark:to-green-900/40 border border-green-200 dark:border-green-700 rounded-2xl shadow-lg p-6 flex flex-col items-center"
          variants={fadeInUp}
        >
          <span className="inline-flex items-center gap-2 mb-2">
            <span className="text-green-700 dark:text-green-300 text-xl font-semibold">
              Order via Platforms
            </span>
            <span className="bg-green-200/80 dark:bg-green-700/50 text-green-700 dark:text-green-200 px-2 py-0.5 rounded text-xs font-bold">
              Trusted
            </span>
          </span>
          <p className="text-green-900 dark:text-green-100 mb-4 text-center text-sm">
            Hire me securely through top freelancing platforms for extra peace of mind and buyer protection.
          </p>
          <div className="flex gap-6 mt-2">
            <Link
              href="https://www.fiverr.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center group"
            >
              <SiFiverr className="text-green-500 group-hover:scale-110 transition-transform text-3xl" />
              <span className="text-xs text-green-700 dark:text-green-200 mt-1 font-medium">Fiverr</span>
            </Link>
            <Link
              href="https://www.upwork.com/freelancers/~yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center group"
            >
              <FaUpwork className="text-green-600 group-hover:scale-110 transition-transform text-3xl" />
              <span className="text-xs text-green-700 dark:text-green-200 mt-1 font-medium">Upwork</span>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Why Me Section */}
      
    </motion.section>
  );
}
