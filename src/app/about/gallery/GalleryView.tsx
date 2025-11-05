"use client";
import { motion } from "framer-motion";
import AlbumsList from "./AlbumsList";
import { GalleryAlbumType } from "@/actions/gallery/albumManagement";
import { FiCamera } from "react-icons/fi";

interface GalleryViewProps {
  albumList: GalleryAlbumType[];
}

export default function GalleryView({ albumList }: GalleryViewProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.header variants={headerVariants} className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl" aria-hidden="true">
            <FiCamera className="text-3xl text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            My Gallery
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
          Explore my collection of captured moments and creative photography organized in albums
        </p>
      </motion.header>

      {/* Albums Grid */}
      <section aria-label="Photo albums collection">
        <AlbumsList albumList={albumList} />
      </section>
    </motion.div>
  );
}
