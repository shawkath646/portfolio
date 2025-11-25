"use client";

import { motion } from "framer-motion";
import { FaUserAstronaut, FaBook, FaCamera, FaMusic, FaMountain } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

export default function PersonalLifeSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
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
        damping: 20,
        delay: 0.2
      }
    }
  };

  // Background icons animation
  const icons = [
    { icon: <FaCamera className="text-3xl" />, top: "15%", left: "10%", delay: 0.2 },
    { icon: <FaMusic className="text-3xl" />, top: "20%", right: "15%", delay: 0.3 },
    { icon: <FaBook className="text-3xl" />, bottom: "20%", left: "15%", delay: 0.4 },
    { icon: <FaMountain className="text-3xl" />, bottom: "30%", right: "10%", delay: 0.5 },
  ];

  return (
    <section 
      ref={ref} 
      className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
      aria-labelledby="personal-life-heading"
    >
      {/* Background icons */}
      {icons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-blue-300/30 dark:text-blue-400/20"
          style={{ 
            top: item.top || "auto", 
            left: item.left || "auto", 
            right: item.right || "auto", 
            bottom: item.bottom || "auto" 
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ delay: item.delay, duration: 0.8 }}
        >
          {item.icon}
        </motion.div>
      ))}

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div 
            className="flex items-center justify-center mb-6"
            variants={iconVariants}
          >
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white shadow-lg">
              <FaUserAstronaut className="text-3xl" />
            </div>
          </motion.div>

          <motion.h2 
            id="personal-life-heading"
            className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Want to know about my personal life?
          </motion.h2>

          <motion.p 
            className="text-lg text-center text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Beyond coding and academics, I'm a passionate individual with interests in photography, music, 
            reading, and exploring nature. My life is a collection of meaningful experiences and moments 
            that have shaped who I am today.
          </motion.p>

          <motion.div 
            className="flex justify-center"
            variants={itemVariants}
          >
            <Link 
              href="/about/personal-life"
              className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium transition-all bg-gradient-to-br from-blue-500 to-purple-600 rounded-full hover:scale-105 transform text-white shadow-lg hover:shadow-xl active:scale-95"
              aria-label="Visit my life page to learn more about my personal journey"
            >
              <span className="relative flex items-center gap-2">
                Visit My Life 
                <motion.span 
                  initial={{ x: -5 }} 
                  animate={{ x: 0 }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 0.6 
                  }}
                >
                  →
                </motion.span>
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
