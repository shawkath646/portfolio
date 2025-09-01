"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function AboutHero() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8,
        type: "spring" as const
      }
    }
  };

  return (
    <section 
      ref={ref}
      className="py-28 px-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5 relative overflow-hidden"
      aria-labelledby="about-page-title"
    >
      {/* Decorative elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-300/20 dark:bg-pink-900/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-300/20 dark:bg-indigo-900/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div 
            className="mb-8 relative inline-block"
            initial={{ opacity: 0, y: -50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 blur-xl opacity-30 rounded-full"></div>
            <h1 
              id="about-page-title"
              className="relative text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
            >
              Welcome to My World
            </h1>
          </motion.div>

          <motion.div 
            className="relative inline-block mb-10"
            variants={itemVariants}
          >
            <p className="relative px-4 lg:text-lg text-gray-600 dark:text-gray-300 font-semibold">
              I am very happy that you want to know about me. ☺️
            </p>
          </motion.div>

          <motion.p
            className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto backdrop-blur-sm p-6 rounded-xl bg-white/30 dark:bg-gray-800/30 shadow-sm"
            variants={itemVariants}
          >
            I'm a <span className="font-semibold text-blue-600 dark:text-blue-400">20-year-old</span> soft-minded, 
            introverted soul who always seeks calmness and enjoys life until the last breath. I embrace struggles 
            and find meaning in every challenge. Every obstacle is an opportunity to grow, and every struggle 
            tells a story worth sharing. Keep scrolling to discover my life, journey and dreams...
          </motion.p>
          
          <motion.div 
            className="mt-10 flex justify-center"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
