"use client";

import { motion } from "framer-motion";
import { FaImages, FaCloudUploadAlt, FaPhotoVideo } from "react-icons/fa";

export default function PicUploadHeader() {
  const containerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const iconVariants = {
    initial: { rotate: 0, scale: 1 },
    animate: {
      rotate: [0, 10, -10, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "easeInOut" as const
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-600/10 dark:to-purple-600/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-br from-pink-400/20 to-indigo-400/20 dark:from-pink-600/10 dark:to-indigo-600/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        {/* Main header content */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 relative overflow-hidden">
          {/* Top gradient line */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Floating icons decoration */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-20 dark:opacity-10">
            <motion.div variants={floatingVariants} animate="animate">
              <FaPhotoVideo className="text-xl text-blue-500" />
            </motion.div>
            <motion.div
              variants={floatingVariants}
              animate="animate"
              transition={{ delay: 0.5 }}
            >
              <FaImages className="text-xl text-purple-500" />
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Animated icon */}
            <motion.div
              className="relative"
              variants={itemVariants}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.7, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg"
                variants={iconVariants}
                initial="initial"
                animate="animate"
              >
                <FaCloudUploadAlt className="text-3xl sm:text-4xl text-white" />
              </motion.div>
            </motion.div>

            {/* Text content */}
            <div className="flex-1 text-center sm:text-left">
              <motion.div variants={itemVariants}>
                <motion.h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-1"
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
                  Gallery Upload
                </motion.h1>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl"
              >
                Upload and manage your gallery images. Add beautiful photos to your collection.
              </motion.p>

              {/* Stats or badges */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start"
              >
                <div className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold flex items-center gap-1">
                  <FaImages className="text-xs" />
                  <span>Multiple Formats</span>
                </div>
                <div className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold flex items-center gap-1">
                  <FaCloudUploadAlt className="text-xs" />
                  <span>Cloud Storage</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom decorative line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
