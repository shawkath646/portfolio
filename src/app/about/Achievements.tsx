"use client";

import { motion, useAnimation, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { 
    FaTrophy, 
    FaMedal, 
    FaStar, 
    FaAward, 
    FaCertificate,
    FaGraduationCap,
    FaCode,
    FaRocket
} from "react-icons/fa";
import { IconType } from "react-icons";

interface Achievement {
    id: string;
    title: string;
    description: string;
    date: string;
    icon: IconType;
    color: string;
    category: "academic" | "professional" | "certification" | "project";
}

// Achievement data
const achievements: Achievement[] = [
    {
        id: "1",
        title: "Sejong University Admission",
        description: "Admitted to Computer Science and Engineering program at Sejong University, Seoul",
        date: "2023",
        icon: FaGraduationCap,
        color: "from-blue-500 to-cyan-500",
        category: "academic"
    },
    {
        id: "2",
        title: "4+ Years of Development",
        description: "Successfully completed numerous real-world projects spanning web and mobile development",
        date: "2020 - Present",
        icon: FaCode,
        color: "from-purple-500 to-pink-500",
        category: "professional"
    },
    {
        id: "3",
        title: "10+ Real-Life Projects",
        description: "Designed and deployed production-ready applications serving real users",
        date: "2020 - 2024",
        icon: FaRocket,
        color: "from-orange-500 to-red-500",
        category: "project"
    },
    {
        id: "4",
        title: "Full Stack Mastery",
        description: "Proficient in modern web technologies including Next.js, React, TypeScript, and Firebase",
        date: "2022",
        icon: FaStar,
        color: "from-green-500 to-emerald-500",
        category: "professional"
    },
    {
        id: "5",
        title: "Android Development",
        description: "Built native Android applications with Kotlin and modern Android architecture",
        date: "2021",
        icon: FaMedal,
        color: "from-indigo-500 to-blue-500",
        category: "professional"
    },
    {
        id: "6",
        title: "Academic Excellence",
        description: "Maintaining strong academic performance while building practical software solutions",
        date: "2023 - Present",
        icon: FaTrophy,
        color: "from-yellow-500 to-amber-500",
        category: "academic"
    }
];

// Animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const cardVariants: Variants = {
    hidden: { 
        opacity: 0, 
        y: 50,
        scale: 0.9
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.6
        }
    }
};

const iconVariants: Variants = {
    hidden: { 
        scale: 0,
        rotate: -180
    },
    visible: {
        scale: 1,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 10
        }
    }
};

const shineVariants: Variants = {
    initial: { x: "-100%" },
    animate: {
        x: "200%",
        transition: {
            repeat: Infinity,
            duration: 3,
            ease: "linear",
            repeatDelay: 5
        }
    }
};

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
    const Icon = achievement.icon;

    return (
        <motion.div
            variants={cardVariants}
            custom={index}
            whileHover={{ 
                scale: 1.002,
                transition: { duration: 0.2 }
            }}
            className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
        >
            {/* Shine effect */}
            <motion.div
                variants={shineVariants}
                initial="initial"
                animate="animate"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent pointer-events-none"
                style={{ width: "50%" }}
            />

            {/* Category badge */}
            <div className="absolute top-3 right-3">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 capitalize">
                    {achievement.category}
                </span>
            </div>

            {/* Icon with gradient background */}
            <motion.div
                variants={iconVariants}
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${achievement.color} p-2.5 mb-3 shadow-md group-hover:shadow-lg transition-shadow duration-300`}
            >
                <Icon className="w-full h-full text-white" />
            </motion.div>

            {/* Content */}
            <div className="space-y-1.5">
                <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {achievement.title}
                </h3>
                
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {achievement.description}
                </p>

                <div className="flex items-center gap-2 pt-1.5">
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600 dark:to-transparent" />
                    <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                        {achievement.date}
                    </span>
                </div>
            </div>

            {/* Hover glow effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${achievement.color} rounded-2xl transition-opacity duration-300 pointer-events-none`} />
        </motion.div>
    );
}

export default function Achievements() {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    return (
        <section 
            ref={ref}
            className="relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
            aria-labelledby="achievements-title"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={controls}
                    variants={{
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.6 }
                        }
                    }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 mb-3">
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                            }}
                        >
                            <FaAward className="text-3xl text-yellow-500 dark:text-yellow-400" />
                        </motion.div>
                    </div>
                    
                    <h2 
                        id="achievements-title"
                        className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3"
                    >
                        Achievements & 
                        <span className="block mt-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            Milestones
                        </span>
                    </h2>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Key accomplishments and milestones in my journey as a developer and student
                    </p>

                    {/* Decorative line */}
                    <motion.div 
                        className="mt-4 h-0.5 w-20 mx-auto rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                        initial={{ scaleX: 0 }}
                        animate={controls}
                        variants={{
                            visible: {
                                scaleX: 1,
                                transition: { duration: 0.8, delay: 0.3 }
                            }
                        }}
                    />
                </motion.div>

                {/* Achievements Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
                >
                    {achievements.map((achievement, index) => (
                        <AchievementCard 
                            key={achievement.id} 
                            achievement={achievement} 
                            index={index}
                        />
                    ))}
                </motion.div>

                {/* Bottom decoration */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={controls}
                    variants={{
                        visible: {
                            opacity: 1,
                            scale: 1,
                            transition: { duration: 0.6, delay: 1 }
                        }
                    }}
                    className="mt-10 text-center"
                >
                    <div className="inline-flex items-center gap-2 mt-10 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full">
                        <FaCertificate className="text-sm text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                            More achievements coming soon...
                        </span>
                        <FaStar className="text-yellow-500 dark:text-yellow-400" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
