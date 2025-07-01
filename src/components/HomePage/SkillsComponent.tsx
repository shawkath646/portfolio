"use client";
import { motion, Variants } from "framer-motion";
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


// Variants
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const scaleLine: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.5, delay: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: 0.05 * i },
  }),
};

export default function SkillsComponent() {
  return (
    <motion.section
      className="flex flex-col items-center justify-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="mb-10 flex flex-col items-center">
        <motion.h2
          className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-cyan-500 to-purple-600 dark:from-cyan-200 dark:via-blue-400 dark:to-purple-500 text-center"
          variants={fadeInUp}
        >
          Skills That Power My Work
        </motion.h2>

        <motion.div
          className="w-20 h-1 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 mt-2 mb-4"
          variants={scaleLine}
          style={{ originX: 0 }}
        />

        <motion.p
          className="max-w-xl text-base sm:text-lg text-gray-700 dark:text-gray-200 text-center mt-2"
          variants={fadeInUp}
        >
          Learned deeply from scratch to make your project robust, scalable, and innovative — blending strong fundamentals with hands-on expertise.
        </motion.p>
      </div>

      <div className="grid gap-6 w-full max-w-6xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {skillsTree.map((branch, idx) => (
          <motion.div
            key={branch.label}
            variants={fadeInUp}
            className="bg-white/70 dark:bg-[#16213e]/70 rounded-2xl shadow-xl px-6 py-5 flex flex-col"
          >
            <div className="flex items-center text-lg sm:text-xl font-bold gap-3 mb-2">
              <span className="flex items-center gap-2">
                {branch.icon}
                {branch.label}
              </span>
            </div>

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
            >
              {branch.children.map((leaf, lidx) => (
                <motion.li
                  key={leaf.label}
                  className="flex items-center gap-3 text-base sm:text-lg text-gray-800 dark:text-gray-200 font-medium py-1"
                  variants={itemVariants}
                  custom={lidx}
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
        variants={fadeInUp}
      >
        Explore my tech stack!
      </motion.p>
    </motion.section>
  );
}
