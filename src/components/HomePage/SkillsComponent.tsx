"use client";

import Link from "next/link";
import React, { memo, useEffect, useRef, useMemo } from "react";
import { motion, Variants, useAnimation, useInView } from "framer-motion";
import { FaCode, FaAndroid, FaChartBar, FaVuejs, FaJava, FaDesktop, FaCloud, FaAws, FaBookOpen } from "react-icons/fa";
import { SiReact, SiNextdotjs, SiBootstrap, SiTailwindcss, SiNodedotjs, SiExpress, SiFirebase, SiMongodb, SiPython, SiNumpy, SiJupyter, SiElectron, SiC, SiGo, SiExpo } from "react-icons/si";
import { TbBrandReactNative, TbBrandAzure, TbWaveSine } from "react-icons/tb";
import useReducedMotion from "@/hooks/useReducedMotion";
import type { Dictionary } from "@/types/dictionary.types";
import { Locale } from "@/lib/locale";

// --- Types ---
type SkillLeaf = {
  label: string;
  slug: string;
  learnedYear: string;
  description: string;
  icon: React.ReactNode;
};

type SkillBranch = {
  label: string;
  slug: string;
  icon: React.ReactNode;
  children: SkillLeaf[];
};

// --- Data Factory ---
// Safely injects the languagePack into the data array to prevent out-of-scope crashes
const getSkillsTree = (languagePack: Dictionary<"homepage-skills-component">): SkillBranch[] => [
  {
    label: languagePack.branchWeb,
    slug: "web-development",
    icon: <FaCode className="text-blue-600" aria-hidden="true" />,
    children: [
      { label: languagePack.webReact, slug: "react", learnedYear: "2020", description: languagePack.webReactDesc, icon: <SiReact className="text-cyan-500" aria-hidden="true" /> },
      { label: languagePack.webVue, slug: "vue", learnedYear: "2025", description: languagePack.webVueDesc, icon: <FaVuejs className="text-green-500" aria-hidden="true" /> },
      { label: languagePack.webNext, slug: "nextjs", learnedYear: "2021", description: languagePack.webNextDesc, icon: <SiNextdotjs className="text-black dark:text-white" aria-hidden="true" /> },
      { label: languagePack.webBootstrap, slug: "bootstrap", learnedYear: "2020", description: languagePack.webBootstrapDesc, icon: <SiBootstrap className="text-purple-600" aria-hidden="true" /> },
      { label: languagePack.webTailwind, slug: "tailwindcss", learnedYear: "2021", description: languagePack.webTailwindDesc, icon: <SiTailwindcss className="text-cyan-400" aria-hidden="true" /> },
      { label: languagePack.webNode, slug: "nodejs", learnedYear: "2021", description: languagePack.webNodeDesc, icon: <SiNodedotjs className="text-green-600" aria-hidden="true" /> },
      { label: languagePack.webExpress, slug: "express", learnedYear: "2022", description: languagePack.webExpressDesc, icon: <SiExpress className="text-gray-800 dark:text-gray-200" aria-hidden="true" /> },
      { label: languagePack.webMongo, slug: "mongodb", learnedYear: "2022", description: languagePack.webMongoDesc, icon: <SiMongodb className="text-green-700" aria-hidden="true" /> },
    ],
  },
  {
    label: languagePack.branchAndroid,
    slug: "android-development",
    icon: <FaAndroid className="text-green-500" aria-hidden="true" />,
    children: [
      { label: languagePack.androidReactNative, slug: "react-native", learnedYear: "2022", description: languagePack.androidReactNativeDesc, icon: <TbBrandReactNative className="text-cyan-500" aria-hidden="true" /> },
      { label: languagePack.androidJava, slug: "java", learnedYear: "2025", description: languagePack.androidJavaDesc, icon: <FaJava className="text-red-500" aria-hidden="true" /> },
      { label: languagePack.androidExpo, slug: "expo", learnedYear: "2022", description: languagePack.androidExpoDesc, icon: <SiExpo className="text-purple-500" aria-hidden="true" /> },
    ],
  },
  {
    label: languagePack.branchDesktop,
    slug: "desktop-development",
    icon: <FaDesktop className="text-indigo-600" aria-hidden="true" />,
    children: [
      { label: languagePack.desktopElectron, slug: "electron", learnedYear: "2022", description: languagePack.desktopElectronDesc, icon: <SiElectron className="text-cyan-400" aria-hidden="true" /> },
      { label: languagePack.desktopC, slug: "c-programming", learnedYear: "2022", description: languagePack.desktopCDesc, icon: <SiC className="text-blue-500" aria-hidden="true" /> },
      { label: languagePack.desktopGo, slug: "go-programming", learnedYear: "2026", description: languagePack.desktopGoDesc, icon: <SiGo className="text-cyan-500" aria-hidden="true" /> },
    ],
  },
  {
    label: languagePack.branchCloud,
    slug: "cloud-infrastructure",
    icon: <FaCloud className="text-sky-500" aria-hidden="true" />,
    children: [
      { label: languagePack.cloudFirebase, slug: "firebase", learnedYear: "2022", description: languagePack.cloudFirebaseDesc, icon: <SiFirebase className="text-yellow-500" aria-hidden="true" /> },
      { label: languagePack.cloudAzure, slug: "azure", learnedYear: "2026", description: languagePack.cloudAzureDesc, icon: <TbBrandAzure className="text-blue-500" aria-hidden="true" /> },
      { label: languagePack.cloudAws, slug: "aws", learnedYear: "2026", description: languagePack.cloudAwsDesc, icon: <FaAws className="text-orange-500" aria-hidden="true" /> },
    ],
  },
  {
    label: languagePack.branchData,
    slug: "data-science",
    icon: <FaChartBar className="text-yellow-500" aria-hidden="true" />,
    children: [
      { label: languagePack.dataPython, slug: "python", learnedYear: "2025", description: languagePack.dataPythonDesc, icon: <SiPython className="text-yellow-400" aria-hidden="true" /> },
      { label: languagePack.dataNumpy, slug: "numpy", learnedYear: "2026", description: languagePack.dataNumpyDesc, icon: <SiNumpy className="text-orange-600" aria-hidden="true" /> },
      { label: languagePack.dataJupyter, slug: "jupyter", learnedYear: "2025", description: languagePack.dataJupyterDesc, icon: <SiJupyter className="text-orange-400" aria-hidden="true" /> },
      { label: languagePack.dataMatlab, slug: "matlab", learnedYear: "2026", description: languagePack.dataMatlabDesc, icon: <TbWaveSine className="text-rose-500" aria-hidden="true" /> },
    ],
  },
];

// --- Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1, when: "beforeChildren" },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const scaleLine: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.5, delay: 0.2, ease: "easeOut" } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -15, transition: { duration: 0.2 } },
  visible: (i: number) => ({
    opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.05 * i, ease: "easeOut" },
  }),
};

// --- Sub-components ---
const SkillItem = memo(({ leaf, index, skillAriaPrefix, locale }: { leaf: SkillLeaf; index: number; skillAriaPrefix: string; locale: Locale }) => (
  <motion.li variants={itemVariants} custom={index} aria-label={`${skillAriaPrefix}: ${leaf.label}`}>
    {/* Fixed: Using slug for URL routing rather than localized label text */}
    <Link href={`/${locale}/about/skills/${leaf.slug}`} className="flex items-center gap-3 text-base sm:text-lg text-gray-800 dark:text-gray-200 py-1 font-light group">
      <span className="text-lg sm:text-xl flex items-center justify-center group-hover:scale-110 transition-transform" aria-hidden="true">
        {leaf.icon}
      </span>
      <span className="group-hover:text-blue-500 transition-colors">{leaf.label}</span>
    </Link>
  </motion.li>
));
SkillItem.displayName = 'SkillItem';

const SkillBranchComponent = memo(({ branch, skillsInPrefix, skillAriaPrefix, locale }: {
  branch: SkillBranch; skillsInPrefix: string; skillAriaPrefix: string; locale: Locale;
}) => (
  <motion.li
    variants={fadeInUp}
    className="bg-white/70 dark:bg-[#16213e]/70 rounded-2xl shadow-xl px-6 py-5 flex flex-col focus-within:ring-2 focus-within:ring-blue-400 focus-within:outline-none transition-all duration-300 break-inside-avoid mb-6"
    tabIndex={0}
  >
    <h3 className="flex items-center text-lg sm:text-xl font-bold gap-3 mb-2">
      <span className="flex items-center justify-center" aria-hidden="true">{branch.icon}</span>
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
        <SkillItem key={leaf.slug} leaf={leaf} index={lidx} skillAriaPrefix={skillAriaPrefix} locale={locale} />
      ))}
    </motion.ul>
  </motion.li>
));
SkillBranchComponent.displayName = 'SkillBranchComponent';

// --- Main Component ---
const SkillsComponent = memo(function SkillsComponent({ languagePack, locale }: { languagePack: Dictionary<"homepage-skills-component">; locale: Locale }) {
  const controls = useAnimation();
  const ref = useRef(null);
  
  const inView = useInView(ref, {
    once: true,
    amount: 0.2,
    margin: "50px 0px",
  });

  const prefersReducedMotion = useReducedMotion(controls);
  
  const skillsTree = useMemo(() => getSkillsTree(languagePack), [languagePack]);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        controls.start("visible");
      }, prefersReducedMotion ? 0 : 100);

      return () => clearTimeout(timer);
    }
  }, [controls, inView, prefersReducedMotion]);

  return (
    <section aria-labelledby="skills-title" className="flex flex-col items-center justify-center my-20">
      <motion.div ref={ref} className="w-full" initial="hidden" animate={controls} variants={containerVariants}>
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

          <motion.p className="max-w-xl text-base sm:text-lg text-gray-700 dark:text-gray-200 text-center mt-2" variants={fadeInUp}>
            {languagePack.description}
          </motion.p>
        </header>

        <ul className="columns-1 md:columns-2 lg:columns-3 gap-6 w-full max-w-6xl mx-auto" role="list" aria-label={languagePack.categoriesAriaLabel}>
          {skillsTree.map((branch) => (
            <SkillBranchComponent
              key={branch.slug}
              branch={branch}
              skillsInPrefix={languagePack.skillsInPrefix}
              skillAriaPrefix={languagePack.skillAriaPrefix}
              locale={locale}
            />
          ))}
        </ul>

        {/* Currently Working On Banner */}
        <motion.div
          variants={fadeInUp}
          className="relative mx-auto mt-10 flex w-full max-w-2xl flex-col gap-4 overflow-hidden rounded-2xl border border-gray-200/60 bg-white/60 px-5 py-4 shadow-lg shadow-gray-200/20 backdrop-blur-md transition-all duration-300 dark:border-gray-800/70 dark:bg-[#16213e]/60 dark:shadow-black/20 sm:px-6 sm:py-5 md:flex-row md:items-center md:gap-8"
        >
          <div className="pointer-events-none absolute -left-12 -top-12 h-24 w-24 rounded-full bg-purple-500/10 blur-3xl" aria-hidden="true" />

          <h3 className="relative flex shrink-0 items-center gap-2.5 text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-500 dark:bg-purple-500/10">
              <FaBookOpen className="text-sm" aria-hidden="true" />
            </span>
            <span>{languagePack.workingOnTitle}</span>
          </h3>

          <ul className="relative flex flex-col gap-2 text-sm font-light text-gray-600 dark:text-gray-300 sm:text-base" role="list">
            <li className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500 ring-3 ring-blue-500/10" aria-hidden="true" />
              <span>{languagePack.workingOnItem1}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500 ring-3 ring-purple-500/10" aria-hidden="true" />
              <span>{languagePack.workingOnItem2}</span>
            </li>
          </ul>
        </motion.div>
        
        <motion.p className="mt-10 text-sm text-gray-500 dark:text-gray-300 text-center" variants={fadeInUp}>
          {languagePack.footerText}
        </motion.p>
      </motion.div>
    </section>
  );
});

export default SkillsComponent;