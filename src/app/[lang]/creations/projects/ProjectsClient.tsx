"use client";
import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { FaUser, FaBriefcase, FaBook, FaHeart, FaRocket, FaFolder, FaCode } from 'react-icons/fa';
import { ProjectType } from '@/types/creations.types';
import ProjectCard from './ProjectCard';


const categoryConfig = {
  Personal: {
    icon: FaUser,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    borderColor: "border-pink-200 dark:border-pink-800",
    textColor: "text-pink-600 dark:text-pink-400",
  },
  Assignments: {
    icon: FaBook,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  Voluntary: {
    icon: FaHeart,
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    textColor: "text-red-600 dark:text-red-400",
  },
  "Client Work": {
    icon: FaBriefcase,
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  "Public Release": {
    icon: FaRocket,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  Uncategorized: {
    icon: FaFolder,
    color: "from-gray-500 to-slate-500",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    borderColor: "border-gray-200 dark:border-gray-800",
    textColor: "text-gray-600 dark:text-gray-400",
  },
} as const;

type CategoryKey = keyof typeof categoryConfig;

type CategorizedProjects = {
  [key in CategoryKey]: ProjectType[];
};

type CategorizedProject = ProjectType;

function categorizeProjects(projects: ProjectType[]): CategorizedProjects {
  return projects.reduce<CategorizedProjects>(
    (accumulator, project) => {
      const category = project.category as CategoryKey;

      if (Object.prototype.hasOwnProperty.call(accumulator, category)) {
        accumulator[category].push(project);
      } else {
        accumulator.Uncategorized.push(project);
      }

      return accumulator;
    },
    {
      Personal: [],
      Assignments: [],
      Voluntary: [],
      "Client Work": [],
      "Public Release": [],
      Uncategorized: [],
    }
  );
}



const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};



export default function ProjectsClient({
  projects,
  totalProjects,
  currentPage,
}: {
  projects: ProjectType[];
  totalProjects: number;
  currentPage: number;
}) {
  const projectsData = categorizeProjects(projects);
  const [selectedCategory, setSelectedCategory] = useState<keyof CategorizedProjects | 'All'>('All');

  const currentPageProjects = Object.values(projectsData).reduce((sum, categoryProjects) => sum + categoryProjects.length, 0);

  const filteredProjects = selectedCategory === 'All'
    ? Object.entries(projectsData).flatMap(([category, projects]) =>
      projects.map((project: CategorizedProject) => ({ ...project, category }))
    )
    : projectsData[selectedCategory].map((project: CategorizedProject) => ({ ...project, category: selectedCategory }));

  const categories = ['All', 'Public Release', 'Personal', 'Client Work', 'Voluntary', 'Assignments', 'Uncategorized'] as const;

  return (
    <div className="container mx-auto z-10">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 px-6 py-10 text-center md:px-10"
      >

        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 via-indigo-500 to-cyan-500 shadow-lg shadow-blue-500/30 ring-4 ring-blue-100 dark:ring-blue-900/60" aria-hidden="true">
            <FaCode className="text-3xl text-white" />
          </div>

          <h1 className="mb-3 text-2xl font-black leading-tight text-transparent bg-clip-text bg-linear-to-r from-blue-700 via-indigo-600 to-cyan-600 dark:from-blue-300 dark:via-indigo-300 dark:to-cyan-300 md:text-3xl lg:text-4xl">
            Shawkat Hossain Maruf&apos;s Projects
          </h1>

          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-gray-700 dark:text-gray-300 md:text-base">
            Explore <strong>{totalProjects} open-source repositories</strong> on GitHub by <strong>shawkath646</strong> -
            Full-stack developer specializing in React, Next.js, TypeScript, and mobile development
          </p>
        </div>
      </motion.header>

      {/* Category Filter */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
        aria-label="Project categories filter"
      >
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => {
            const config = category === 'All'
              ? { icon: FaFolder, color: 'from-blue-500 to-purple-500', textColor: 'text-gray-700 dark:text-gray-300' }
              : categoryConfig[category as keyof typeof categoryConfig];

            const Icon = config.icon;
            const count = category === 'All'
              ? currentPageProjects
              : projectsData[category as keyof CategorizedProjects].length;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as keyof CategorizedProjects | 'All')}
                className={`
                    px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-md
                    ${selectedCategory === category
                    ? `bg-linear-to-r ${config.color} text-white shadow-lg scale-105`
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-lg hover:scale-105'
                  }
                  `}
                aria-pressed={selectedCategory === category}
                aria-label={`Filter by ${category} projects (${count} projects)`}
              >
                <Icon className="text-base" aria-hidden="true" />
                <span>{category}</span>
                <span className={`
                    px-1.5 py-0.5 rounded-full text-xs font-bold
                    ${selectedCategory === category
                    ? 'bg-white/30 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }
                  `}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </motion.nav>

      {/* Projects Grid with staggered layout */}
      <motion.section
        key={`${selectedCategory}-${currentPage}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto"
        aria-label={`${selectedCategory} projects`}
        style={{ gridAutoFlow: 'dense' }}
      >
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project: CategorizedProject & { category: string }) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <motion.div
            variants={itemVariants}
            className="col-span-full text-center py-16"
            role="status"
          >
            <FaFolder className="text-5xl text-gray-400 mx-auto mb-3" aria-hidden="true" />
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No projects found in this category
            </p>
          </motion.div>
        )}
      </motion.section>
    </div>
  );
}
