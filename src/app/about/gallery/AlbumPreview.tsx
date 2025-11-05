"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaFolder } from "react-icons/fa";
import { getAlbumImages } from "@/actions/gallery/getAlbumImages";

interface AlbumPreviewProps {
  albumId: string;
}

export default function AlbumPreview({ albumId }: AlbumPreviewProps) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const { images } = await getAlbumImages(albumId, 3);
        setPreviewImages(images.slice(0, 3).map((img) => img.src));
      } catch (error) {
        console.error("Error fetching album preview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [albumId]);

  if (loading) {
    return (
      <div className="aspect-square w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
    );
  }

  if (previewImages.length === 0) {
    return (
      <div className="aspect-square w-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center">
        <FaFolder className="text-6xl text-blue-400 dark:text-blue-600" />
      </div>
    );
  }

  return (
    <div className="aspect-square w-full relative overflow-visible p-4">
      {/* Stacked Images with rotation */}
      <div className="relative w-full h-full">
        {previewImages.map((src, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            style={{
              zIndex: previewImages.length - index,
              transformOrigin: "center center",
            }}
            initial={{
              rotate: (index - 1) * -6,
              x: (index - 1) * 8,
              y: (index - 1) * 8,
            }}
            whileHover={{
              rotate: (index - 1) * -8,
              x: (index - 1) * 12,
              y: (index - 1) * 12,
              transition: { duration: 0.3 },
            }}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg border-4 border-white dark:border-gray-700 bg-white dark:bg-gray-800">
              <Image
                src={src}
                alt={`Preview ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
