"use client";
import React, { memo, useEffect, useRef } from "react";
import { motion, Variants, useAnimation, useInView } from "framer-motion";
import { FaCode, FaAndroid, FaChartBar, FaVuejs, FaJava, FaChartLine, FaDesktop, FaCloud, FaAws, FaBookOpen } from "react-icons/fa";
import { SiReact, SiNextdotjs, SiBootstrap, SiTailwindcss, SiNodedotjs, SiExpress, SiFirebase, SiMongodb, SiPython, SiPandas, SiNumpy, SiJupyter, SiScikitlearn, SiElectron, SiC, SiCplusplus, SiGo } from "react-icons/si";
import { TbBrandReactNative, TbBrandAzure } from "react-icons/tb";
import useReducedMotion from "@/hooks/useReducedMotion";
import type { Dictionary } from "@/types/dictionary.types";

type SkillLeaf = {
  label: string;
  icon: React.ReactNode;
};

type SkillBranch = {
  label: string;
  icon: React.ReactNode;
  children: SkillLeaf[];
};

// Memoized individual skill item component for better performance
const SkillItem = memo(({ leaf, index, skillAriaPrefix }: { leaf: SkillLeaf; index: number; skillAriaPrefix: string }) => {
  return (
    <motion.li
      className="flex items-center gap-3 text-base sm:text-lg text-gray-800 dark:text-gray-200 font-medium py-1"
      variants={itemVariants}
      custom={index}
      aria-label={`${skillAriaPrefix}: ${leaf.label}`}
    >
      <span className="text-lg sm:text-xl flex items-center justify-center" aria-hidden="true">
        {leaf.icon}
      </span>
      <span>{leaf.label}</span>
    </motion.li>
  );
});
SkillItem.displayName = 'SkillItem';

const SkillBranchComponent = memo(({ branch, skillsInPrefix, skillAriaPrefix }: {
  branch: SkillBranch;
  skillsInPrefix: string;
  skillAriaPrefix: string;
}) => {
  return (
    <motion.li
      variants={fadeInUp}
      className="bg-white/70 dark:bg-[#16213e]/70 rounded-2xl shadow-xl px-6 py-5 flex flex-col focus-within:ring-2 focus-within:ring-blue-400 focus-within:outline-none transition-all duration-300 break-inside-avoid mb-6"
      tabIndex={0}
    >
      <h3 className="flex items-center text-lg sm:text-xl font-bold gap-3 mb-2">
        <span className="flex items-center justify-center" aria-hidden="true">
          {branch.icon}
        </span>
        <span>{branch.label}</span>
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
        aria-label={`${skillsInPrefix} ${branch.label}`}
      >
        {branch.children.map((leaf, lidx) => (
          <SkillItem key={leaf.label} leaf={leaf} index={lidx} skillAriaPrefix={skillAriaPrefix} />
        ))}
      </motion.ul>
    </motion.li>
  );
});
SkillBranchComponent.displayName = 'SkillBranchComponent';

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

const SkillsComponent = memo(function SkillsComponent({ languagePack }: { languagePack: Dictionary<"homepage-skills-component"> }) {
  // Set up intersection observer for lazy loading
  const controls = useAnimation();
  const ref = useRef(null);

  const inView = useInView(ref, {
    once: true,
    amount: 0.2,
    margin: "50px 0px",
  });

  const prefersReducedMotion = useReducedMotion(controls);

  useEffect(() => {
    if (inView && !prefersReducedMotion) {
      const timer = setTimeout(() => {
        controls.start("visible");
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [controls, inView, prefersReducedMotion]);

  const skillsTree: SkillBranch[] = [
    {
      label: languagePack.branchWeb,
      icon: <FaCode className="text-blue-600" aria-hidden="true" />,
      children: [
        { label: languagePack.webReact, icon: <SiReact className="text-cyan-500" aria-hidden="true" /> },
        { label: languagePack.webVue, icon: <FaVuejs className="text-green-500" aria-hidden="true" /> },
        { label: languagePack.webNext, icon: <SiNextdotjs className="text-black dark:text-white" aria-hidden="true" /> },
        { label: languagePack.webBootstrap, icon: <SiBootstrap className="text-purple-600" aria-hidden="true" /> },
        { label: languagePack.webTailwind, icon: <SiTailwindcss className="text-cyan-400" aria-hidden="true" /> },
        { label: languagePack.webNode, icon: <SiNodedotjs className="text-green-600" aria-hidden="true" /> },
        { label: languagePack.webExpress, icon: <SiExpress className="text-gray-800 dark:text-gray-200" aria-hidden="true" /> },
        { label: languagePack.webMongo, icon: <SiMongodb className="text-green-700" aria-hidden="true" /> },
      ],
    },
    {
      label: languagePack.branchAndroid,
      icon: <FaAndroid className="text-green-500" aria-hidden="true" />,
      children: [
        { label: languagePack.androidReactNative, icon: <TbBrandReactNative className="text-cyan-500" aria-hidden="true" /> },
        { label: languagePack.androidJava, icon: <FaJava className="text-red-500" aria-hidden="true" /> },
        { label: languagePack.androidExpo, icon: <TbBrandReactNative className="text-purple-500" aria-hidden="true" /> },
      ],
    },
    {
      label: languagePack.branchDesktop,
      icon: <FaDesktop className="text-indigo-600" aria-hidden="true" />,
      children: [
        { label: languagePack.desktopElectron, icon: <SiElectron className="text-cyan-400" aria-hidden="true" /> },
        { label: languagePack.desktopC, icon: <SiC className="text-blue-500" aria-hidden="true" /> },
        { label: languagePack.desktopCpp, icon: <SiCplusplus className="text-blue-600" aria-hidden="true" /> },
        { label: languagePack.desktopGo, icon: <SiGo className="text-cyan-500" aria-hidden="true" /> },
      ],
    },
    {
      label: languagePack.branchCloud,
      icon: <FaCloud className="text-sky-500" aria-hidden="true" />,
      children: [
        { label: languagePack.cloudFirebase, icon: <SiFirebase className="text-yellow-500" aria-hidden="true" /> },
        { label: languagePack.cloudAzure, icon: <TbBrandAzure className="text-blue-500" aria-hidden="true" /> },
        { label: languagePack.cloudAws, icon: <FaAws className="text-orange-500" aria-hidden="true" /> },
      ],
    },
    {
      label: languagePack.branchData,
      icon: <FaChartBar className="text-yellow-500" aria-hidden="true" />,
      children: [
        { label: languagePack.dataPython, icon: <SiPython className="text-yellow-400" aria-hidden="true" /> },
        { label: languagePack.dataPandas, icon: <SiPandas className="text-blue-600" aria-hidden="true" /> },
        { label: languagePack.dataNumpy, icon: <SiNumpy className="text-orange-600" aria-hidden="true" /> },
        { label: languagePack.dataJupyter, icon: <SiJupyter className="text-orange-400" aria-hidden="true" /> },
        { label: languagePack.dataSklearn, icon: <SiScikitlearn className="text-yellow-900" aria-hidden="true" /> },
        { label: languagePack.dataMatplotlib, icon: <FaChartLine className="text-blue-400" aria-hidden="true" /> },
      ],
    },
  ];

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
            className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-linear-to-r from-blue-700 via-cyan-500 to-purple-600 dark:from-cyan-200 dark:via-blue-400 dark:to-purple-500 text-center"
            variants={fadeInUp}
          >
            {languagePack.title}
          </motion.h2>

          <motion.div
            className="w-20 h-1 rounded-full bg-linear-to-r from-blue-500 via-cyan-400 to-purple-500 mt-2 mb-4"
            variants={scaleLine}
            style={{ originX: 0 }}
            aria-hidden="true"
          />

          <motion.p
            className="max-w-xl text-base sm:text-lg text-gray-700 dark:text-gray-200 text-center mt-2"
            variants={fadeInUp}
          >
            {languagePack.description}
          </motion.p>
        </header>

        <ul
          className="columns-1 md:columns-2 lg:columns-3 gap-6 w-full max-w-6xl mx-auto"
          role="list"
          aria-label={languagePack.categoriesAriaLabel}
        >
          {skillsTree.map((branch) => (
            <SkillBranchComponent
              key={branch.label}
              branch={branch}
              skillsInPrefix={languagePack.skillsInPrefix}
              skillAriaPrefix={languagePack.skillAriaPrefix}
            />
          ))}
        </ul>

        <motion.div
          variants={fadeInUp}
          className="relative mx-auto mt-10 flex w-full max-w-2xl flex-col gap-4 overflow-hidden rounded-2xl border border-gray-200/60 bg-white/60 px-5 py-4 shadow-lg shadow-gray-200/20 backdrop-blur-md transition-all duration-300 dark:border-gray-800/70 dark:bg-[#16213e]/60 dark:shadow-black/20 sm:px-6 sm:py-5 md:flex-row md:items-center md:gap-8"
        >
          {/* Subtle accent */}
          <div
            className="pointer-events-none absolute -left-12 -top-12 h-24 w-24 rounded-full bg-purple-500/10 blur-3xl"
            aria-hidden="true"
          />

          <h3 className="relative flex shrink-0 items-center gap-2.5 text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-500 dark:bg-purple-500/10">
              <FaBookOpen className="text-sm" aria-hidden="true" />
            </span>
            <span>{languagePack.workingOnTitle}</span>
          </h3>

          <ul
            className="relative flex flex-col gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 sm:text-base"
            role="list"
          >
            <li className="flex items-center gap-2.5">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500 ring-3 ring-blue-500/10"
                aria-hidden="true"
              />
              <span>{languagePack.workingOnItem1}</span>
            </li>

            <li className="flex items-center gap-2.5">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500 ring-3 ring-purple-500/10"
                aria-hidden="true"
              />
              <span>{languagePack.workingOnItem2}</span>
            </li>
          </ul>
        </motion.div>
        <motion.p
          className="mt-10 text-sm text-gray-500 dark:text-gray-300 text-center"
          variants={fadeInUp}
        >
          {languagePack.footerText}
        </motion.p>
      </motion.div>
    </section>
  );
});

export default SkillsComponent;
