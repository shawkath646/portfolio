"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect, useRef } from "react";

export default function AboutHero() {
  const sectionRef = useRef(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [isScrolled, setIsScrolled] = useState(false);

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8,
        type: "spring" as const,
        bounce: 0.4
      }
    }
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 1, opacity: 0.5 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center py-20 sm:py-28 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-blue-900/30 relative overflow-hidden"
      aria-labelledby="about-page-title"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating orbs */}
        <motion.div 
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-purple-400/30 dark:from-pink-600/20 dark:to-purple-600/20 rounded-full blur-3xl"
          variants={floatingVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div 
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-blue-400/30 dark:from-indigo-600/20 dark:to-blue-600/20 rounded-full blur-3xl"
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div 
          className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 dark:from-cyan-600/15 dark:to-teal-600/15 rounded-full blur-3xl"
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 2 }}
        />

        {/* Animated rings */}
        <motion.div 
          className="absolute top-20 right-20 w-64 h-64 border-2 border-purple-300/30 dark:border-purple-500/20 rounded-full"
          variants={pulseVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div 
          className="absolute bottom-32 left-32 w-48 h-48 border-2 border-blue-300/30 dark:border-blue-500/20 rounded-full"
          variants={pulseVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 1.5 }}
        />

        {/* Floating shapes */}
        <motion.div
          className="absolute top-1/4 right-1/3 w-16 h-16 bg-gradient-to-br from-pink-400/40 to-purple-400/40 dark:from-pink-500/30 dark:to-purple-500/30 rounded-2xl rotate-12"
          animate={{
            y: [0, -20, 0],
            rotate: [12, 25, 12],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-gradient-to-br from-blue-400/40 to-cyan-400/40 dark:from-blue-500/30 dark:to-cyan-500/30 rounded-full"
          animate={{
            y: [0, 15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        {/* Sparkle effects */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-white to-purple-200 dark:from-purple-300 dark:to-blue-300 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="container mx-auto relative z-10"
        style={{ y, opacity }}
      >
        <motion.div
          ref={ref}
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Main title with enhanced animations */}
          <motion.div 
            className="mb-8 relative inline-block"
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: -50 }}
            transition={{ duration: 1, type: "spring", bounce: 0.5 }}
          >
            {/* Glow effect */}
            <motion.div 
              className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-2xl opacity-30 rounded-full"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Title */}
            <motion.h1 
              id="about-page-title"
              className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent px-4"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: "200% 200%"
              }}
            >
              Welcome to My World
            </motion.h1>

            {/* Decorative lines */}
            <motion.div
              className="absolute -left-8 top-1/2 w-6 h-0.5 bg-gradient-to-r from-transparent to-purple-500"
              initial={{ width: 0 }}
              animate={inView ? { width: 24 } : { width: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
            <motion.div
              className="absolute -right-8 top-1/2 w-6 h-0.5 bg-gradient-to-l from-transparent to-purple-500"
              initial={{ width: 0 }}
              animate={inView ? { width: 24 } : { width: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
          </motion.div>

          {/* Subtitle with wave animation */}
          <motion.div 
            className="relative inline-block mb-10"
            variants={itemVariants}
          >
            <motion.p 
              className="relative px-4 text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 font-semibold"
              animate={{
                y: [0, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              I am very happy that you want to know about me. 
              <motion.span
                className="inline-block ml-2"
                animate={{
                  rotate: [0, 14, -8, 14, -4, 10, 0],
                  scale: [1, 1.2, 1.1, 1.2, 1.1, 1.2, 1]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut"
                }}
              >
                ☺️
              </motion.span>
            </motion.p>
          </motion.div>

          {/* Description with enhanced card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative group">
              {/* Card glow on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
              
              <motion.div
                className="relative text-gray-700 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto backdrop-blur-md p-6 sm:p-8 rounded-2xl bg-white/60 dark:bg-gray-800/60 shadow-xl border border-white/20 dark:border-gray-700/20"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                I'm a <motion.span 
                  className="font-bold text-blue-600 dark:text-blue-400"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  20-year-old
                </motion.span> soft-minded, 
                introverted soul who always seeks calmness and enjoys life until the last breath. I embrace struggles 
                and find meaning in every challenge. Every obstacle is an opportunity to grow, and every struggle 
                tells a story worth sharing. Keep scrolling to discover my life, journey and dreams...
              </motion.div>
            </div>
          </motion.div>
          
          {/* Scroll indicator with enhanced animation */}
          <motion.div 
            className="mt-12 sm:mt-16 flex flex-col items-center gap-3"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={isScrolled ? { opacity: 0, y: 20 } : (inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 })}
            transition={{ delay: 0.8 }}
          >
            <motion.p 
              className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium"
              animate={{
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Scroll to explore
            </motion.p>
            <motion.div
              className="relative"
              animate={{
                y: [0, 10, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div 
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 shadow-lg relative overflow-hidden group cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ["-100%", "200%"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut"
                  }}
                />
                
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>
              
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-purple-500 dark:border-purple-400"
                animate={{
                  scale: [1, 1.5, 1.5],
                  opacity: [1, 0, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
