"use client";
import { useState, memo } from 'react';
import { motion, Variants } from 'framer-motion';
import { FaGithub, FaStar, FaCodeBranch, FaExternalLinkAlt, FaUser, FaBriefcase, FaBook, FaHeart, FaRocket, FaFolder, FaClock, FaGlobe, FaMobile, FaCode } from 'react-icons/fa';
import { SiAndroid } from 'react-icons/si';

interface CategorizedProject {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  topics: string[];
  stars: number;
  forks: number;
  language: string | null;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  archived: boolean;
}

interface CategorizedProjects {
  Personal: CategorizedProject[];
  Assignments: CategorizedProject[];
  Voluntary: CategorizedProject[];
  "Client Work": CategorizedProject[];
  "Public Release": CategorizedProject[];
  Uncategorized: CategorizedProject[];
}

interface ProjectsClientProps {
  projectsData: CategorizedProjects;
}

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

const languageColors: Record<string, { bg: string; text: string; gradient: string }> = {
  JavaScript: { bg: "bg-yellow-400", text: "text-yellow-900", gradient: "from-yellow-400 to-yellow-500" },
  TypeScript: { bg: "bg-blue-600", text: "text-blue-100", gradient: "from-blue-500 to-blue-700" },
  Python: { bg: "bg-blue-500", text: "text-blue-100", gradient: "from-blue-400 to-blue-600" },
  Java: { bg: "bg-red-500", text: "text-red-100", gradient: "from-red-400 to-red-600" },
  HTML: { bg: "bg-orange-500", text: "text-orange-100", gradient: "from-orange-400 to-orange-600" },
  CSS: { bg: "bg-blue-400", text: "text-blue-100", gradient: "from-blue-300 to-blue-500" },
  Vue: { bg: "bg-green-500", text: "text-green-100", gradient: "from-green-400 to-green-600" },
  PHP: { bg: "bg-indigo-500", text: "text-indigo-100", gradient: "from-indigo-400 to-indigo-600" },
  Ruby: { bg: "bg-red-600", text: "text-red-100", gradient: "from-red-500 to-red-700" },
  Go: { bg: "bg-cyan-500", text: "text-cyan-100", gradient: "from-cyan-400 to-cyan-600" },
  Rust: { bg: "bg-orange-600", text: "text-orange-100", gradient: "from-orange-500 to-orange-700" },
  C: { bg: "bg-gray-600", text: "text-gray-100", gradient: "from-gray-500 to-gray-700" },
  "C++": { bg: "bg-pink-600", text: "text-pink-100", gradient: "from-pink-500 to-pink-700" },
  "C#": { bg: "bg-purple-600", text: "text-purple-100", gradient: "from-purple-500 to-purple-700" },
  Kotlin: { bg: "bg-purple-500", text: "text-purple-100", gradient: "from-purple-400 to-purple-600" },
  Swift: { bg: "bg-orange-400", text: "text-orange-100", gradient: "from-orange-300 to-orange-500" },
  Dart: { bg: "bg-blue-500", text: "text-blue-100", gradient: "from-blue-400 to-blue-600" },
  Shell: { bg: "bg-green-600", text: "text-green-100", gradient: "from-green-500 to-green-700" },
};

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

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Function to detect project type based on topics and language
const detectProjectType = (project: CategorizedProject): 'web' | 'android' | 'other' => {
  const topicsLower = project.topics.map(t => t.toLowerCase());
  const desc = (project.description || '').toLowerCase();
  const name = project.name.toLowerCase();
  
  // Check for Android app indicators
  if (
    topicsLower.some(t => 
      t.includes('android') || 
      t.includes('mobile') || 
      t.includes('react-native') ||
      t.includes('expo') ||
      t.includes('flutter')
    ) ||
    desc.includes('android') ||
    desc.includes('mobile app') ||
    project.language === 'Kotlin' ||
    project.language === 'Java' && (desc.includes('app') || name.includes('app'))
  ) {
    return 'android';
  }
  
  // Check for web project indicators
  if (
    topicsLower.some(t => 
      t.includes('website') || 
      t.includes('web') || 
      t.includes('nextjs') ||
      t.includes('react') ||
      t.includes('vue') ||
      t.includes('frontend') ||
      t.includes('backend') ||
      t.includes('fullstack')
    ) ||
    desc.includes('website') ||
    desc.includes('web app') ||
    desc.includes('web application') ||
    project.language === 'TypeScript' ||
    project.language === 'JavaScript' ||
    project.language === 'HTML' ||
    project.language === 'Vue'
  ) {
    return 'web';
  }
  
  return 'other';
};

const ProjectCard = memo(({ project }: { project: CategorizedProject }) => {
  const langColor = project.language ? languageColors[project.language] : null;
  const lastUpdated = new Date(project.updatedAt);
  const now = new Date();
  const daysAgo = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
  const timeText = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`;
  
  const projectType = detectProjectType(project);
  const ProjectIcon = projectType === 'web' ? FaGlobe : projectType === 'android' ? SiAndroid : FaCode;

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" aria-hidden="true" />
      
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 group-hover:border-transparent transition-all duration-300 h-full"
        aria-label={`View ${project.name} repository on GitHub`}
      >
        {/* Top accent bar with gradient */}
        <div className={`h-1.5 bg-gradient-to-r ${langColor?.gradient || 'from-gray-400 to-gray-500'}`} aria-hidden="true" />
        
        <div className="p-5">
          {/* Header with dynamic icon based on project type */}
          <header className="flex items-start gap-3 mb-3">
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${
              projectType === 'web' 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500' 
                : projectType === 'android'
                ? 'bg-gradient-to-br from-green-500 to-lime-600 dark:from-green-400 dark:to-lime-500'
                : 'bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500'
            } flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <ProjectIcon className="text-white text-lg" aria-hidden="true" title={`${projectType === 'web' ? 'Web Application' : projectType === 'android' ? 'Android App' : 'Code Project'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 transition-all duration-300">
                {project.name}
              </h3>
              <div className="flex items-center gap-2">
                {project.archived && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full">
                    📦 Archived
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <FaClock className="text-[10px]" aria-hidden="true" />
                  {timeText}
                </span>
              </div>
            </div>
            <FaExternalLinkAlt className="text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 flex-shrink-0 text-sm group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" aria-hidden="true" />
          </header>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
            {project.description || "No description provided"}
          </p>

          {/* Topics with scrollable container */}
          {project.topics.length > 0 && (
            <div className="mb-4 -mx-1">
              <div className="flex flex-wrap gap-1.5 px-1" role="list" aria-label="Project topics">
                {project.topics.slice(0, 4).map((topic) => (
                  <span
                    key={topic}
                    role="listitem"
                    className="px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow duration-200"
                  >
                    #{topic}
                  </span>
                ))}
                {project.topics.length > 4 && (
                  <span className="px-2.5 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    +{project.topics.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Stats bar */}
          <footer className="flex items-center justify-between pt-4 border-t-2 border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {project.language && (
                <div className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded-full ${langColor?.bg || "bg-gray-400"} ring-2 ring-white dark:ring-gray-800 shadow-sm`} aria-hidden="true" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{project.language}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors" title={`${project.stars} stars`}>
                <FaStar className="text-yellow-500 text-xs" aria-hidden="true" />
                <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">{project.stars}</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors" title={`${project.forks} forks`}>
                <FaCodeBranch className="text-blue-500 text-xs" aria-hidden="true" />
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">{project.forks}</span>
              </div>
            </div>
          </footer>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" aria-hidden="true" />
      </a>
    </motion.article>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default function ProjectsClient({ projectsData }: ProjectsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<keyof CategorizedProjects | 'All'>('All');

  // React Compiler will automatically memoize these
  const totalProjects = Object.values(projectsData).reduce((sum, projects) => sum + projects.length, 0);

  const filteredProjects = selectedCategory === 'All'
    ? Object.entries(projectsData).flatMap(([category, projects]) =>
        projects.map((project: CategorizedProject) => ({ ...project, category }))
      )
    : projectsData[selectedCategory].map((project: CategorizedProject) => ({ ...project, category: selectedCategory }));

  // Reorganized categories with Public Release earlier
  const categories = ['All', 'Public Release', 'Personal', 'Client Work', 'Voluntary', 'Assignments', 'Uncategorized'] as const;

  return (
    <main
      id="main-content"
      className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-100 dark:from-[#0a192f] dark:via-[#1e293b] dark:to-[#0f172a] transition-all duration-700 py-16 px-4 md:px-6"
      role="main"
      aria-label="Projects Portfolio"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl opacity-40 animate-pulse-fade"></div>
        <div className="absolute top-1/4 -right-8 w-96 h-96 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl opacity-30 animate-pulse-fade" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-cyan-200 dark:bg-cyan-900/30 rounded-full blur-3xl opacity-35 animate-pulse-fade" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-3" aria-hidden="true">
            <FaGithub className="text-4xl text-gray-900 dark:text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
            Shawkat Hossain Maruf's Projects
          </h1>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Explore <strong>{totalProjects} open-source repositories</strong> on GitHub by <strong>shawkath646</strong> - 
            Full-stack developer specializing in React, Next.js, TypeScript, and mobile development
          </p>
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
                ? totalProjects 
                : projectsData[category as keyof CategorizedProjects].length;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category as any)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-md
                    ${selectedCategory === category
                      ? `bg-gradient-to-r ${config.color} text-white shadow-lg scale-105`
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
          key={selectedCategory}
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
    </main>
  );
}
