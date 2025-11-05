"use client";
import React, { memo, useEffect, useState } from "react";
import { motion, Variants, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaCode, FaAndroid, FaChartBar, FaVuejs, FaJava, FaChartLine } from "react-icons/fa";
import { SiReact, SiNextdotjs, SiBootstrap, SiTailwindcss, SiNodedotjs, SiExpress, SiFirebase, SiMongodb, SiPython, SiPandas, SiNumpy, SiJupyter, SiScikitlearn } from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import useReducedMotion from "@/hooks/useReducedMotion";

// Type definitions for improved type safety
type SkillLeaf = {
  label: string;
  icon: React.ReactNode;
  ariaLabel?: string;
};

type SkillBranch = {
  label: string;
  icon: React.ReactNode;
  children: SkillLeaf[];
  ariaLabel?: string;
};

// Memoized individual skill item component for better performance
const SkillItem = memo(({ leaf, index }: { leaf: SkillLeaf; index: number }) => {
  return (
    <motion.li
      className="flex items-center gap-3 text-base sm:text-lg text-gray-800 dark:text-gray-200 font-medium py-1"
      variants={itemVariants}
      custom={index}
      aria-label={leaf.ariaLabel || `Skill: ${leaf.label}`}
    >
      <span className="text-lg sm:text-xl flex items-center justify-center" aria-hidden="true">
        {leaf.icon}
      </span>
      <span>{leaf.label}</span>
    </motion.li>
  );
});

// Memoized skill branch component for better performance
const SkillBranchComponent = memo(({ branch }: { branch: SkillBranch }) => {
  return (
    <motion.li
      variants={fadeInUp}
      className="bg-white/70 dark:bg-[#16213e]/70 rounded-2xl shadow-xl px-6 py-5 flex flex-col focus-within:ring-2 focus-within:ring-blue-400 focus-within:outline-none transition-all duration-300"
      tabIndex={0}
    >
      <h3
        className="flex items-center text-lg sm:text-xl font-bold gap-3 mb-2"
        aria-label={branch.ariaLabel || branch.label}
      >
        <span className="flex items-center gap-2" aria-hidden="true">
          {branch.icon}
          {branch.label}
        </span>
      </h3>

      <motion.ul
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
          visible: { opacity: 1, height: "auto" },
          hidden: { opacity: 0, height: 0 },
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="pl-4 mt-2 space-y-2 overflow-hidden"
        role="list"
        aria-label={`Skills in ${branch.label}`}
      >
        {branch.children.map((leaf, lidx) => (
          <SkillItem key={leaf.label} leaf={leaf} index={lidx} />
        ))}
      </motion.ul>
    </motion.li>
  );
});

// Skills data structure
const skillsTree: SkillBranch[] = [
  {
    label: "Full Stack Web Development",
    icon: <FaCode className="text-blue-600" aria-hidden="true" />,
    ariaLabel: "Skills in Full Stack Web Development",
    children: [
      { label: "React.js", icon: <SiReact className="text-cyan-500" aria-hidden="true" />, ariaLabel: "React.js framework" },
      { label: "Vue.js", icon: <FaVuejs className="text-green-500" aria-hidden="true" />, ariaLabel: "Vue.js framework" },
      { label: "Next.js", icon: <SiNextdotjs className="text-black dark:text-white" aria-hidden="true" />, ariaLabel: "Next.js framework" },
      { label: "Bootstrap", icon: <SiBootstrap className="text-purple-600" aria-hidden="true" />, ariaLabel: "Bootstrap CSS framework" },
      { label: "TailwindCSS", icon: <SiTailwindcss className="text-cyan-400" aria-hidden="true" />, ariaLabel: "TailwindCSS framework" },
      { label: "Node.js", icon: <SiNodedotjs className="text-green-600" aria-hidden="true" />, ariaLabel: "Node.js runtime" },
      { label: "Express.js", icon: <SiExpress className="text-gray-800 dark:text-gray-200" aria-hidden="true" />, ariaLabel: "Express.js framework" },
      { label: "Firebase", icon: <SiFirebase className="text-yellow-500" aria-hidden="true" />, ariaLabel: "Firebase platform" },
      { label: "MongoDB", icon: <SiMongodb className="text-green-700" aria-hidden="true" />, ariaLabel: "MongoDB database" },
    ],
  },
  {
    label: "Android App Development",
    icon: <FaAndroid className="text-green-500" aria-hidden="true" />,
    ariaLabel: "Skills in Android App Development",
    children: [
      { label: "React Native", icon: <TbBrandReactNative className="text-cyan-500" aria-hidden="true" />, ariaLabel: "React Native framework" },
      { label: "Java", icon: <FaJava className="text-red-500" aria-hidden="true" />, ariaLabel: "Java programming language" },
      { label: "Expo", icon: <TbBrandReactNative className="text-purple-500" aria-hidden="true" />, ariaLabel: "Expo framework" },
      { label: "Firebase", icon: <SiFirebase className="text-yellow-500" aria-hidden="true" />, ariaLabel: "Firebase platform" },
    ],
  },
  {
    label: "Data Analysis",
    icon: <FaChartBar className="text-yellow-500" aria-hidden="true" />,
    ariaLabel: "Skills in Data Analysis",
    children: [
      { label: "Python", icon: <SiPython className="text-yellow-400" aria-hidden="true" />, ariaLabel: "Python programming language" },
      { label: "Pandas", icon: <SiPandas className="text-blue-600" aria-hidden="true" />, ariaLabel: "Pandas library" },
      { label: "NumPy", icon: <SiNumpy className="text-orange-600" aria-hidden="true" />, ariaLabel: "NumPy library" },
      { label: "Jupyter Notebook", icon: <SiJupyter className="text-orange-400" aria-hidden="true" />, ariaLabel: "Jupyter Notebook" },
      { label: "scikit-learn", icon: <SiScikitlearn className="text-yellow-900" aria-hidden="true" />, ariaLabel: "scikit-learn library" },
      { label: "Matplotlib", icon: <FaChartLine className="text-blue-400" aria-hidden="true" />, ariaLabel: "Matplotlib library" },
    ],
  },
];


// Animation variants with performance optimizations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.3 }
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

const scaleLine: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.5,
      delay: 0.2,
      ease: "easeOut"
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -15,
    transition: { duration: 0.2 }
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      delay: 0.05 * i,
      ease: "easeOut"
    },
  }),
};

const SkillsComponent = memo(function SkillsComponent() {
  // Set up intersection observer for lazy loading
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: "50px 0px"
  });

  // State for loading  
  // Use our custom hook for reduced motion preference
  const prefersReducedMotion = useReducedMotion(controls);


  // Start animations when component comes into view
  useEffect(() => {
    if (inView && !prefersReducedMotion) {
      // Add a small delay for smoother appearance after page load
      const timer = setTimeout(() => {
        controls.start("visible");
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [controls, inView, prefersReducedMotion]);

  return (
    <section
      aria-labelledby="skills-title"
      className="flex flex-col items-center justify-center my-20"
    >
      <motion.div
        ref={ref}
        className="w-full"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <header className="mb-10 flex flex-col items-center">
          <motion.h2
            id="skills-title"
            className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-cyan-500 to-purple-600 dark:from-cyan-200 dark:via-blue-400 dark:to-purple-500 text-center"
            variants={fadeInUp}
          >
            Skills That Power My Work
          </motion.h2>

          <motion.div
            className="w-20 h-1 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 mt-2 mb-4"
            variants={scaleLine}
            style={{ originX: 0 }}
            aria-hidden="true"
          />

          <motion.p
            className="max-w-xl text-base sm:text-lg text-gray-700 dark:text-gray-200 text-center mt-2"
            variants={fadeInUp}
          >
            Learned deeply from scratch to make your project robust, scalable, and innovative — blending strong fundamentals with hands-on expertise.
          </motion.p>
        </header>

        <ul
          className="grid gap-6 w-full max-w-6xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label="Skills categories"
        >
          {skillsTree.map((branch) => (
            <SkillBranchComponent key={branch.label} branch={branch} />
          ))}
        </ul>

        <motion.p
          className="mt-10 text-sm text-gray-500 dark:text-gray-300 text-center"
          variants={fadeInUp}
        >
          Explore my tech stack!
        </motion.p>
      </motion.div>
    </section>
  );
});

export default SkillsComponent;
