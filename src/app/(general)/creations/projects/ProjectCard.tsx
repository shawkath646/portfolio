import { memo, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { FaStar, FaCodeBranch, FaExternalLinkAlt, FaClock, FaGlobe, FaCode } from 'react-icons/fa';
import { SiAndroid } from 'react-icons/si';
import { ProjectType } from "@/types/creations.types";


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

const platformIcons = {
    web: FaGlobe,
    android: SiAndroid,
    default: FaCode,
};

const platformColors = {
    web: "bg-linear-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500",
    android:
        "bg-linear-to-br from-green-500 to-lime-600 dark:from-green-400 dark:to-lime-500",
    default:
        "bg-linear-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500",
};

const ProjectCard = memo(({ project }: { project: ProjectType }) => {
    const langColor = project.language ? languageColors[project.language] : null;

    const ProjectIcon =
        platformIcons[project.platform as keyof typeof platformIcons] ??
        platformIcons.default;

    const iconBg =
        platformColors[project.platform as keyof typeof platformColors] ??
        platformColors.default;

    const visibleTopics = useMemo(
        () => project.topics.slice(0, 4),
        [project.topics]
    );

    const extraTopics = project.topics.length - visibleTopics.length;

    return (
        <motion.article
            variants={cardVariants}
            whileHover={{ y: -8 }}
            initial={false}
            className="group relative"
        >
            {/* Gradient border */}
            <div
                className="absolute inset-0 bg-linear-to-br from-blue-400 via-purple-400 to-pink-400 dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"
                aria-hidden="true"
            />

            <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.name} ${project.platform} repository on GitHub`}
                className="relative block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 group-hover:border-transparent transition-all duration-300 h-full"
            >
                {/* Top accent bar */}
                <div
                    className={`h-1.5 bg-linear-to-r ${langColor?.gradient || "from-gray-400 to-gray-500"
                        }`}
                    aria-hidden="true"
                />

                <div className="p-5">
                    {/* Header */}
                    <header className="flex items-start gap-3 mb-3">
                        <div
                            className={`shrink-0 w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                            <ProjectIcon
                                className="text-white text-lg"
                                aria-hidden="true"
                                title={
                                    project.platform === "web"
                                        ? "Web Application"
                                        : project.platform === "android"
                                            ? "Android App"
                                            : "Code Project"
                                }
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 transition-all duration-300">
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
                                    {project.timeText}
                                </span>
                            </div>
                        </div>

                        <FaExternalLinkAlt
                            className="text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 shrink-0 text-sm group-hover:scale-125 group-hover:rotate-12 transition-all duration-300"
                            aria-hidden="true"
                        />
                    </header>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {project.description || "No description provided"}
                    </p>

                    {/* Topics */}
                    {visibleTopics.length > 0 && (
                        <div className="mb-4 -mx-1">
                            <div
                                className="flex flex-wrap gap-1.5 px-1"
                                role="list"
                                aria-label="Project topics"
                            >
                                {visibleTopics.map((topic) => (
                                    <span
                                        key={topic}
                                        role="listitem"
                                        className="px-2.5 py-1 text-xs font-medium bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow duration-200"
                                    >
                                        #{topic}
                                    </span>
                                ))}

                                {extraTopics > 0 && (
                                    <span className="px-2.5 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                        +{extraTopics} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <footer className="flex items-center justify-between pt-4 border-t-2 border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            {project.language && (
                                <div className="flex items-center gap-1.5">
                                    <span
                                        className={`w-3 h-3 rounded-full ${langColor?.bg || "bg-gray-400"
                                            } ring-2 ring-white dark:ring-gray-800 shadow-sm`}
                                        aria-hidden="true"
                                    />
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                        {project.language}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <div
                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                                title={`${project.stars} stars`}
                            >
                                <FaStar className="text-yellow-500 text-xs" aria-hidden="true" />
                                <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">
                                    {project.stars}
                                </span>
                            </div>

                            <div
                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                title={`${project.forks} forks`}
                            >
                                <FaCodeBranch
                                    className="text-blue-500 text-xs"
                                    aria-hidden="true"
                                />
                                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                                    {project.forks}
                                </span>
                            </div>
                        </div>
                    </footer>
                </div>

                {/* Shine hover effect */}
                <div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"
                    aria-hidden="true"
                />
            </a>
        </motion.article>
    );
});

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;