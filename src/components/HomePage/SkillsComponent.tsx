"use client";
import { motion } from "framer-motion";
import { FaCode, FaAndroid, FaChartBar, FaVuejs, FaJava } from "react-icons/fa";
import { SiReact, SiNextdotjs, SiBootstrap, SiTailwindcss, SiNodedotjs, SiExpress, SiFirebase, SiMongodb, SiPython, SiPandas, SiNumpy, SiJupyter, SiScikitlearn } from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";


const skillsTree = [
    {
        label: "Full Stack Web Development",
        icon: <FaCode className="text-blue-600" />,
        children: [
            { label: "React.js", icon: <SiReact className="text-cyan-500" /> },
            { label: "Vue.js", icon: <FaVuejs className="text-green-500" /> },
            { label: "Next.js", icon: <SiNextdotjs className="text-black dark:text-white" /> },
            { label: "Bootstrap", icon: <SiBootstrap className="text-purple-600" /> },
            { label: "TailwindCSS", icon: <SiTailwindcss className="text-cyan-400" /> },
            { label: "Node.js", icon: <SiNodedotjs className="text-green-600" /> },
            { label: "Express.js", icon: <SiExpress className="text-gray-800 dark:text-gray-200" /> },
            { label: "Firebase", icon: <SiFirebase className="text-yellow-500" /> },
            { label: "MongoDB", icon: <SiMongodb className="text-green-700" /> },
        ],
    },
    {
        label: "Android App Development",
        icon: <FaAndroid className="text-green-500" />,
        children: [
            { label: "React Native", icon: <TbBrandReactNative className="text-cyan-500" /> },
            { label: "Java", icon: <FaJava className="text-red-500" /> },
            { label: "Expo", icon: <TbBrandReactNative className="text-purple-500" /> },
            { label: "Firebase", icon: <SiFirebase className="text-yellow-500" /> },
        ],
    },
    {
        label: "Data Analysis",
        icon: <FaChartBar className="text-yellow-500" />,
        children: [
            { label: "Python", icon: <SiPython className="text-yellow-400" /> },
            { label: "Pandas", icon: <SiPandas className="text-blue-600" /> },
            { label: "NumPy", icon: <SiNumpy className="text-orange-600" /> },
            { label: "Jupyter Notebook", icon: <SiJupyter className="text-orange-400" /> },
            { label: "scikit-learn", icon: <SiScikitlearn className="text-yellow-900" /> },
            { label: "Matplotlib", icon: <SiPython className="text-blue-400" /> },
        ],
    },
];

export default function SkillsPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-100 dark:from-[#0a192f] dark:via-[#1e293b] dark:to-[#0f172a] transition-all duration-700 py-10">
            <div className="mb-10 flex flex-col items-center">
                <motion.h2
                    className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-cyan-500 to-purple-600 dark:from-cyan-200 dark:via-blue-400 dark:to-purple-500 text-center"
                    initial={{ y: -24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 110, delay: 0.1 }}
                >
                    Skills That Power My Work
                </motion.h2>
                <motion.div
                    className="w-20 h-1 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 mt-2 mb-4"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{ originX: 0 }}
                />
                <motion.p
                    className="max-w-xl text-base sm:text-lg text-gray-700 dark:text-gray-200 text-center mt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    Learned deeply from scratch to make your project robust, scalable, and innovative — blending strong fundamentals with hands-on expertise.
                </motion.p>
            </div>
            <div className="grid gap-6 w-full max-w-6xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {skillsTree.map((branch, idx) => (
                    <motion.div
                        key={branch.label}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + 0.1 * idx }}
                        className="bg-white/70 dark:bg-[#16213e]/70 rounded-2xl shadow-xl px-6 py-5 flex flex-col"
                    >
                        <div className="flex items-center text-lg sm:text-xl font-bold gap-3 mb-2">
                            <span className="flex items-center gap-2">
                                {branch.icon}
                                {branch.label}
                            </span>
                        </div>
                        <motion.ul
                            initial="collapsed"
                            animate="open"
                            exit="collapsed"
                            variants={{
                                open: { opacity: 1, height: "auto" },
                                collapsed: { opacity: 0, height: 0 },
                            }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="pl-4 mt-2 space-y-2 overflow-hidden"
                        >
                            {branch.children.map((leaf, lidx) => (
                                <motion.li
                                    key={leaf.label}
                                    className="flex items-center gap-3 text-base sm:text-lg text-gray-800 dark:text-gray-200 font-medium py-1"
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 + lidx * 0.04 }}
                                >
                                    {leaf.icon}
                                    {leaf.label}
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>
                ))}
            </div>
            <motion.p
                className="mt-10 text-sm text-gray-500 dark:text-gray-300 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                Explore my tech stack!
            </motion.p>
        </div>
    );
}