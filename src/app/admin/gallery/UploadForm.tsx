"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaCloudUploadAlt, FaImage, FaTimes } from "react-icons/fa";
import googleDriveLogo from "@/assets/google-drive-icon-512x512.png";

type UploadFormData = {
  title: string;
  description: string;
  location: string;
  album: string;
  image: FileList;
};

const albums = [
  "Travel",
  "Personal",
  "Events",
  "Nature",
  "Technology",
  "Food",
  "Architecture",
  "Other"
];

export default function UploadForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<UploadFormData>();

  const imageFile = watch("image");

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear image preview
  const clearImage = () => {
    setImagePreview(null);
    reset({ image: undefined as any });
  };

  // Handle form submission
  const onSubmit = async (data: UploadFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement upload logic
      console.log("Upload data:", data);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload
      alert("Image uploaded successfully!");
      reset();
      setImagePreview(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle import from Google Drive
  const handleImportFromDrive = () => {
    // TODO: Implement Google Drive import
    alert("Import from Google Drive - Coming soon!");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Upload Area */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Upload Image
              </label>
              
              {!imagePreview ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image", { required: "Please select an image" })}
                    onChange={(e) => {
                      register("image").onChange(e);
                      handleImageChange(e);
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group"
                  >
                    <motion.div
                      className="flex flex-col items-center justify-center pt-5 pb-6"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FaCloudUploadAlt className="w-12 h-12 mb-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </motion.div>
                  </label>
                </div>
              ) : (
                <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 group">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
              
              {errors.image && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Import from Drive Button */}
            <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
              <motion.button
                type="button"
                onClick={handleImportFromDrive}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all group sm:flex-col sm:h-64 sm:w-32"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  src={googleDriveLogo}
                  alt="Google Drive"
                  width={40}
                  height={40}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 sm:text-center">
                  Import from Drive
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Form Fields */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4"
        >
          {/* Album Selection */}
          <div>
            <label htmlFor="album" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Album *
            </label>
            <select
              id="album"
              {...register("album", { required: "Please select an album" })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Choose an album...</option>
              {albums.map((album) => (
                <option key={album} value={album}>
                  {album}
                </option>
              ))}
            </select>
            {errors.album && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.album.message}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter image title..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={4}
              placeholder="Add a description for your image..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              {...register("location")}
              placeholder="Where was this taken?"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl shadow-lg disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <FaImage />
                <span>Upload Image</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}
