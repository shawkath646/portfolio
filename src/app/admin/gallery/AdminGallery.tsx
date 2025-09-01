"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { FiUpload, FiImage, FiTrash2, FiEdit3 } from "react-icons/fi";
import googleDriveIcon from "@/assets/google-drive-icon-512x512.png";

interface ImageData {
    id: string;
    altText: string;
    description: string;
    file: File | null;
    preview: string;
}

export default function AdminGallery() {
    const [formData, setFormData] = useState({
        imageAltText: "",
        imageDescription: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [uploadedImages, setUploadedImages] = useState<ImageData[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleFileSelect(file);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!selectedFile || !formData.imageAltText || !formData.imageDescription) {
            alert("Please fill in all fields and select an image");
            return;
        }

        setIsUploading(true);
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const newImage: ImageData = {
            id: Date.now().toString(),
            altText: formData.imageAltText,
            description: formData.imageDescription,
            file: selectedFile,
            preview: previewUrl
        };
        
        setUploadedImages(prev => [...prev, newImage]);
        
        // Reset form
        setFormData({ imageAltText: "", imageDescription: "" });
        setSelectedFile(null);
        setPreviewUrl("");
        setIsUploading(false);
    };

    const removeImage = (id: string) => {
        setUploadedImages(prev => prev.filter(img => img.id !== id));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                        Admin Gallery
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Manage your gallery images with descriptions and alt text.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-end mb-6"
                >
                    <Link
                        href="#"
                        className="inline-flex items-center gap-2 border border-blue-500 text-blue-600 dark:text-blue-400 px-5 py-2 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors duration-200 shadow-sm"
                    >
                        <Image src={googleDriveIcon} alt="Google Drive Icon" className="w-5 h-5" />
                        Login to Google Drive
                    </Link>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Upload Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                            <FiUpload className="text-blue-500" />
                            Upload New Image
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* File Upload Area */}
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                                    dragActive
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                        : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    id="imageUpload"
                                    name="imageUpload"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                
                                {previewUrl ? (
                                    <div className="space-y-4">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
                                        />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Click to change image or drag a new one
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <FiImage className="mx-auto text-4xl text-gray-400" />
                                        <div>
                                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                                Drag & drop an image here
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                or click to browse files
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Alt Text Input */}
                            <div className="space-y-2">
                                <label htmlFor="imageAltText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Image Alt Text *
                                </label>
                                <input
                                    type="text"
                                    id="imageAltText"
                                    name="imageAltText"
                                    value={formData.imageAltText}
                                    onChange={handleInputChange}
                                    placeholder="Brief description for accessibility"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                    required
                                />
                            </div>

                            {/* Description Input */}
                            <div className="space-y-2">
                                <label htmlFor="imageDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Image Description *
                                </label>
                                <textarea
                                    id="imageDescription"
                                    name="imageDescription"
                                    value={formData.imageDescription}
                                    onChange={handleInputChange}
                                    placeholder="Detailed description of the image"
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors resize-none"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={!selectedFile || !formData.imageAltText || !formData.imageDescription || isUploading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <FiUpload />
                                        Upload Image
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Gallery Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                            <FiImage className="text-green-500" />
                            Gallery ({uploadedImages.length})
                        </h2>

                        {uploadedImages.length === 0 ? (
                            <div className="text-center py-12">
                                <FiImage className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    No images uploaded yet. Upload your first image to get started!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                                {uploadedImages.map((image, index) => (
                                    <motion.div
                                        key={image.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow group"
                                    >
                                        <img
                                            src={image.preview}
                                            alt={image.altText}
                                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-800 dark:text-white truncate">
                                                {image.altText}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                                {image.description}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <FiEdit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() => removeImage(image.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
