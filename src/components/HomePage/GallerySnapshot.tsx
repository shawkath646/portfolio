"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { GalleryImageType } from "@/actions/gallery/uploadImage";
import { FiArrowRight, FiCamera } from "react-icons/fi";

interface GallerySnapshotProps {
  images: GalleryImageType[];
}

export default function GallerySnapshot({ images }: GallerySnapshotProps) {
  const displayImages = images.slice(0, 14);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  if (displayImages.length === 0) {
    return null;
  }

  return (
    <section
      className="container mx-auto px-4 py-20"
      aria-labelledby="gallery-snapshot-title"
    >
      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={headerVariants}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl" aria-hidden="true">
            <FiCamera className="text-2xl text-purple-600 dark:text-purple-400" />
          </div>
          <h2
            id="gallery-snapshot-title"
            className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white"
          >
            Gallery Highlights
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A glimpse into my captured moments and creative photography
        </p>
      </motion.header>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
        role="list"
      >
        {displayImages.map((image, index) => (
          <motion.li
            key={image.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            className="group relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 bg-gray-200 dark:bg-gray-700"
          >
            <article className="w-full h-full">
              <Link
                href="/about/gallery"
                className="block w-full h-full"
                aria-label={`View ${image.title} in gallery`}
              >
                <figure className="relative w-full h-full">
                  <Image
                    src={image.src}
                    alt={image.alt || image.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                  
                  {/* Image title on hover */}
                  <figcaption className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs sm:text-sm font-semibold line-clamp-2">
                      {image.title}
                    </p>
                    {image.location && (
                      <p className="text-white/80 text-xs line-clamp-1 mt-1">
                        📍 {image.location}
                      </p>
                    )}
                  </figcaption>
                </figure>
              </Link>
            </article>
          </motion.li>
        ))}

        {/* View All Button as Grid Item */}
        <motion.li
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          className="group relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"
        >
          <Link
            href="/about/gallery"
            className="flex flex-col items-center justify-center w-full h-full p-4"
            aria-label="View all gallery images"
          >
            {/* Circular Arrow Background */}
            <div className="relative mb-3" aria-hidden="true">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 dark:group-hover:bg-white/20 transition-all duration-300">
                <FiArrowRight className="text-3xl sm:text-4xl text-white group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
            
            {/* Text */}
            <span className="text-white font-semibold text-sm sm:text-base text-center">
              View All
            </span>
          </Link>
        </motion.li>
      </motion.ul>
    </section>
  );
}
