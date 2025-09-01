"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGlobeAmericas, FaLaptopCode, FaFeatherAlt } from 'react-icons/fa';

export default function DreamCards() {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const goals = [
        {
            icon: <FaGlobeAmericas className="text-2xl" />,
            title: "Exploring every corner of the earth",
            description:
                "I want to reach every corner of the world and witness the beauty Allah has created for us. I admire nature—from the top of mountains to the bed of the sea.",
            id: "dream-explore",
            color: "from-emerald-400 to-teal-500"
        },
        {
            icon: <FaLaptopCode className="text-2xl" />,
            title: "Be a software engineer",
            description:
                "Coding and developing applications is an addiction to me. I aim to build my career in the software engineering field. I'm already working hard to master web development, but I know the race is long, especially with the rise of AI.",
            id: "dream-engineer",
            color: "from-blue-400 to-indigo-500"
        },
        {
            icon: <FaFeatherAlt className="text-2xl" />,
            title: "Keeping a scratch before I die",
            description:
                "I want to leave a footprint before I leave this earth. People may forget quickly, but I still believe I'll live on through my online presence, my portfolio, my soft behavior, and the people I've helped.",
            id: "dream-legacy",
            color: "from-purple-400 to-pink-500"
        },
    ];

    const headerVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: {
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.7, 
                type: "spring" as const 
            }
        }
    };

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 30 
        },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.6, 
                type: "spring" as const,
                bounce: 0.3
            }
        }
    };

    const iconVariants = {
        hidden: { scale: 0, rotate: -30 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring" as const,
                stiffness: 260,
                damping: 20
            }
        }
    };

    return (
        <section 
            ref={ref} 
            className="container mx-auto py-16 px-4 relative z-10"
            aria-labelledby="dreams-heading"
        >
            <div className="mb-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block mb-4"
                >
                    <div className="relative inline-flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg blur opacity-30 animate-pulse"></div>
                        <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-2 shadow-xl">
                            <motion.h2
                                id="dreams-heading"
                                variants={headerVariants}
                                initial="hidden"
                                animate={inView ? "visible" : "hidden"}
                                className="text-lg sm:text-xl font-bold tracking-wide bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"
                            >
                                My Dreams & Aspirations
                            </motion.h2>
                        </div>
                    </div>
                </motion.div>

                <motion.p 
                    className="text-base font-medium text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    These are the goals that fuel my passion and guide my journey—if Allah wills.
                </motion.p>
            </div>

            <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
            >
                {goals.map((goal, i) => (
                    <motion.article
                        key={i}
                        variants={cardVariants}
                        className="relative overflow-hidden"
                        aria-labelledby={goal.id}
                    >
                        <div className="h-full relative p-5 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${goal.color}`}></div>
                            
                            <motion.div 
                                className="mb-4 flex justify-center"
                                variants={iconVariants}
                            >
                                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${goal.color} flex items-center justify-center text-white shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
                                    {goal.icon}
                                </div>
                            </motion.div>

                            <div className="flex items-center justify-center gap-2 mb-3">
                                <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-300 rounded-full border border-blue-100 dark:border-blue-800">
                                    Personal Goal
                                </span>
                            </div>

                            <h3 
                                id={goal.id}
                                className="text-lg font-bold mb-3 text-center text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                            >
                                {goal.title}
                            </h3>

                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                {goal.description}
                            </p>
                        </div>
                    </motion.article>
                ))}
            </motion.div>
        </section>
    );
};
