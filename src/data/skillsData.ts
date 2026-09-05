import { IconType } from "react-icons";
import { FaCode, FaAndroid, FaDesktop, FaCloud, FaChartBar, FaVuejs, FaJava, FaAws } from "react-icons/fa";
import {
    SiReact,
    SiNextdotjs,
    SiBootstrap,
    SiTailwindcss,
    SiNodedotjs,
    SiExpress,
    SiFirebase,
    SiMongodb,
    SiPython,
    SiNumpy,
    SiJupyter,
    SiElectron,
    SiC,
    SiGo,
    SiExpo,
} from "react-icons/si";
import { TbBrandReactNative, TbBrandAzure, TbWaveSine } from "react-icons/tb";

export type SkillBranchSlug =
    | "web-development"
    | "android-development"
    | "desktop-development"
    | "cloud-infrastructure"
    | "data-science";

export interface SkillItemDefinition {
    slug: string;
    name: string;
    nameKey: string;
    descKey: string;
    learnedYear: string;
    branchSlug: SkillBranchSlug;
    branchKey: string;
    icon: IconType;
    color: string;
    bgGlow: string;
}

export interface SkillBranchDefinition {
    slug: SkillBranchSlug;
    nameKey: string;
    icon: IconType;
    color: string;
    skills: SkillItemDefinition[];
}

export const SKILLS_LIST: SkillItemDefinition[] = [
    // Web Development
    {
        slug: "react",
        name: "React.js",
        nameKey: "webReact",
        descKey: "webReactDesc",
        learnedYear: "2020",
        branchSlug: "web-development",
        branchKey: "branchWeb",
        icon: SiReact,
        color: "text-cyan-500",
        bgGlow: "rgba(6, 182, 212, 0.15)",
    },
    {
        slug: "vue",
        name: "Vue.js",
        nameKey: "webVue",
        descKey: "webVueDesc",
        learnedYear: "2025",
        branchSlug: "web-development",
        branchKey: "branchWeb",
        icon: FaVuejs,
        color: "text-green-500",
        bgGlow: "rgba(34, 197, 94, 0.15)",
    },
    {
        slug: "nextjs",
        name: "Next.js",
        nameKey: "webNext",
        descKey: "webNextDesc",
        learnedYear: "2021",
        branchSlug: "web-development",
        branchKey: "branchWeb",
        icon: SiNextdotjs,
        color: "text-black dark:text-white",
        bgGlow: "rgba(100, 116, 139, 0.15)",
    },
    {
        slug: "bootstrap",
        name: "Bootstrap",
        nameKey: "webBootstrap",
        descKey: "webBootstrapDesc",
        learnedYear: "2020",
        branchSlug: "web-development",
        branchKey: "branchWeb",
        icon: SiBootstrap,
        color: "text-purple-600",
        bgGlow: "rgba(147, 51, 234, 0.15)",
    },
    {
        slug: "tailwindcss",
        name: "Tailwind CSS",
        nameKey: "webTailwind",
        descKey: "webTailwindDesc",
        learnedYear: "2021",
        branchSlug: "web-development",
        branchKey: "branchWeb",
        icon: SiTailwindcss,
        color: "text-cyan-400",
        bgGlow: "rgba(56, 189, 248, 0.15)",
    },
    {
        slug: "nodejs",
        name: "Node.js",
        nameKey: "webNode",
        descKey: "webNodeDesc",
        learnedYear: "2021",
        branchSlug: "web-development",
        branchKey: "branchWeb",
        icon: SiNodedotjs,
        color: "text-green-600",
        bgGlow: "rgba(22, 163, 74, 0.15)",
    },
    {
        slug: "express",
        name: "Express.js",
        nameKey: "webExpress",
        descKey: "webExpressDesc",
        learnedYear: "2022",
        branchSlug: "web-development",
        branchKey: "branchWeb",
        icon: SiExpress,
        color: "text-gray-800 dark:text-gray-200",
        bgGlow: "rgba(107, 114, 128, 0.15)",
    },
    {
        slug: "mongodb",
        name: "MongoDB",
        nameKey: "webMongo",
        descKey: "webMongoDesc",
        learnedYear: "2022",
        branchSlug: "web-development",
        branchKey: "branchWeb",
        icon: SiMongodb,
        color: "text-green-700",
        bgGlow: "rgba(21, 128, 61, 0.15)",
    },

    // Android App Development
    {
        slug: "react-native",
        name: "React Native",
        nameKey: "androidReactNative",
        descKey: "androidReactNativeDesc",
        learnedYear: "2022",
        branchSlug: "android-development",
        branchKey: "branchAndroid",
        icon: TbBrandReactNative,
        color: "text-cyan-500",
        bgGlow: "rgba(6, 182, 212, 0.15)",
    },
    {
        slug: "java",
        name: "Java",
        nameKey: "androidJava",
        descKey: "androidJavaDesc",
        learnedYear: "2025",
        branchSlug: "android-development",
        branchKey: "branchAndroid",
        icon: FaJava,
        color: "text-red-500",
        bgGlow: "rgba(239, 68, 68, 0.15)",
    },
    {
        slug: "expo",
        name: "Expo",
        nameKey: "androidExpo",
        descKey: "androidExpoDesc",
        learnedYear: "2022",
        branchSlug: "android-development",
        branchKey: "branchAndroid",
        icon: SiExpo,
        color: "text-purple-500 dark:text-purple-400",
        bgGlow: "rgba(168, 85, 247, 0.15)",
    },

    // Desktop App Development
    {
        slug: "electron",
        name: "ElectronJS",
        nameKey: "desktopElectron",
        descKey: "desktopElectronDesc",
        learnedYear: "2022",
        branchSlug: "desktop-development",
        branchKey: "branchDesktop",
        icon: SiElectron,
        color: "text-cyan-400",
        bgGlow: "rgba(34, 211, 238, 0.15)",
    },
    {
        slug: "c-programming",
        name: "C",
        nameKey: "desktopC",
        descKey: "desktopCDesc",
        learnedYear: "2022",
        branchSlug: "desktop-development",
        branchKey: "branchDesktop",
        icon: SiC,
        color: "text-blue-500",
        bgGlow: "rgba(59, 130, 246, 0.15)",
    },
    {
        slug: "go-programming",
        name: "Go",
        nameKey: "desktopGo",
        descKey: "desktopGoDesc",
        learnedYear: "2026",
        branchSlug: "desktop-development",
        branchKey: "branchDesktop",
        icon: SiGo,
        color: "text-cyan-500",
        bgGlow: "rgba(6, 182, 212, 0.15)",
    },

    // Cloud & Infrastructure
    {
        slug: "firebase",
        name: "Firebase",
        nameKey: "cloudFirebase",
        descKey: "cloudFirebaseDesc",
        learnedYear: "2022",
        branchSlug: "cloud-infrastructure",
        branchKey: "branchCloud",
        icon: SiFirebase,
        color: "text-yellow-500",
        bgGlow: "rgba(234, 179, 8, 0.15)",
    },
    {
        slug: "azure",
        name: "Microsoft Azure",
        nameKey: "cloudAzure",
        descKey: "cloudAzureDesc",
        learnedYear: "2026",
        branchSlug: "cloud-infrastructure",
        branchKey: "branchCloud",
        icon: TbBrandAzure,
        color: "text-blue-500",
        bgGlow: "rgba(59, 130, 246, 0.15)",
    },
    {
        slug: "aws",
        name: "Amazon Web Services",
        nameKey: "cloudAws",
        descKey: "cloudAwsDesc",
        learnedYear: "2026",
        branchSlug: "cloud-infrastructure",
        branchKey: "branchCloud",
        icon: FaAws,
        color: "text-orange-500",
        bgGlow: "rgba(249, 115, 22, 0.15)",
    },

    // Data Analysis
    {
        slug: "python",
        name: "Python",
        nameKey: "dataPython",
        descKey: "dataPythonDesc",
        learnedYear: "2025",
        branchSlug: "data-science",
        branchKey: "branchData",
        icon: SiPython,
        color: "text-yellow-400",
        bgGlow: "rgba(250, 204, 21, 0.15)",
    },
    {
        slug: "numpy",
        name: "NumPy",
        nameKey: "dataNumpy",
        descKey: "dataNumpyDesc",
        learnedYear: "2026",
        branchSlug: "data-science",
        branchKey: "branchData",
        icon: SiNumpy,
        color: "text-orange-600",
        bgGlow: "rgba(234, 88, 12, 0.15)",
    },
    {
        slug: "jupyter",
        name: "Jupyter Notebook",
        nameKey: "dataJupyter",
        descKey: "dataJupyterDesc",
        learnedYear: "2025",
        branchSlug: "data-science",
        branchKey: "branchData",
        icon: SiJupyter,
        color: "text-orange-400",
        bgGlow: "rgba(251, 146, 60, 0.15)",
    },
    {
        slug: "matlab",
        name: "MATLAB",
        nameKey: "dataMatlab",
        descKey: "dataMatlabDesc",
        learnedYear: "2026",
        branchSlug: "data-science",
        branchKey: "branchData",
        icon: TbWaveSine,
        color: "text-rose-500",
        bgGlow: "rgba(244, 63, 94, 0.15)",
    },
];

export const SKILL_BRANCHES: SkillBranchDefinition[] = [
    {
        slug: "web-development",
        nameKey: "branchWeb",
        icon: FaCode,
        color: "text-blue-600",
        skills: SKILLS_LIST.filter((s) => s.branchSlug === "web-development"),
    },
    {
        slug: "android-development",
        nameKey: "branchAndroid",
        icon: FaAndroid,
        color: "text-green-500",
        skills: SKILLS_LIST.filter((s) => s.branchSlug === "android-development"),
    },
    {
        slug: "desktop-development",
        nameKey: "branchDesktop",
        icon: FaDesktop,
        color: "text-indigo-600",
        skills: SKILLS_LIST.filter((s) => s.branchSlug === "desktop-development"),
    },
    {
        slug: "cloud-infrastructure",
        nameKey: "branchCloud",
        icon: FaCloud,
        color: "text-sky-500",
        skills: SKILLS_LIST.filter((s) => s.branchSlug === "cloud-infrastructure"),
    },
    {
        slug: "data-science",
        nameKey: "branchData",
        icon: FaChartBar,
        color: "text-yellow-500",
        skills: SKILLS_LIST.filter((s) => s.branchSlug === "data-science"),
    },
];

export function getSkillBySlug(slug: string): SkillItemDefinition | undefined {
    return SKILLS_LIST.find((s) => s.slug === slug);
}

export function getAllSkillSlugs(): string[] {
    return SKILLS_LIST.map((s) => s.slug);
}

export function getRelatedSkills(skill: SkillItemDefinition, limit = 4): SkillItemDefinition[] {
    const sameBranch = SKILLS_LIST.filter(
        (s) => s.branchSlug === skill.branchSlug && s.slug !== skill.slug
    );
    if (sameBranch.length >= limit) {
        return sameBranch.slice(0, limit);
    }
    const otherSkills = SKILLS_LIST.filter(
        (s) => s.branchSlug !== skill.branchSlug && s.slug !== skill.slug
    );
    return [...sameBranch, ...otherSkills].slice(0, limit);
}
