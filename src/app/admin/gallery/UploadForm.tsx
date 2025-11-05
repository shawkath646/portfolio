"use client";
import Image from "next/image";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { GalleryAlbumType } from "@/actions/gallery/albumManagement";
import uploadImage, { GalleryImageType } from "@/actions/gallery/uploadImage";
import { getImageMetadata } from "@/utils/imageNameToDate";
import { PartialBy } from "@/types";
import { FaCloudUploadAlt, FaImage, FaTimes } from "react-icons/fa";
import googleDriveLogo from "@/assets/google-drive-icon-512x512.png";

type UploadFormData = {
    title: string;
    description: string;
    location: string;
    alt: string;
    album: string;
    image: FileList;
    width: number;
    height: number;
    timestamp: Date;
};

export default function UploadForm({ albumList }: { albumList: GalleryAlbumType[] }) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<UploadFormData>({
        defaultValues: {
            width: 0,
            height: 0,
        }
    });

    // Watch metadata fields
    const width = watch('width');
    const height = watch('height');
    const timestamp = watch('timestamp');

    // Validate if file is an image
    const validateImageFile = (file: File): boolean => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            alert('Only image files are allowed! Please upload a valid image (JPG, PNG, GIF, WebP, or SVG).');
            return false;
        }
        return true;
    };

    // Handle image preview
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!validateImageFile(file)) {
                e.target.value = '';
                return;
            }
            
            // Get image metadata
            const metadata = await getImageMetadata(file);
            
            // Set metadata in form fields (use 0 if null)
            setValue('width', metadata.width ?? 0);
            setValue('height', metadata.height ?? 0);
            setValue('timestamp', metadata.timestamp || new Date());
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle file drop
    const handleFileDrop = async (file: File) => {
        if (!validateImageFile(file)) {
            return;
        }

        // Get image metadata
        const metadata = await getImageMetadata(file);
        
        // Set metadata in form fields (use 0 if null)
        setValue('width', metadata.width ?? 0);
        setValue('height', metadata.height ?? 0);
        setValue('timestamp', metadata.timestamp || new Date());

        // Create a DataTransfer object to set the file input value
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        // Set the file in the form
        const fileList = dataTransfer.files;
        setValue('image', fileList as any, { shouldValidate: true });

        // Preview the image
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Drag and drop handlers
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileDrop(files[0]);
        }
    };

    // Clear image preview
    const clearImage = () => {
        setImagePreview(null);
        reset({
            image: undefined as any,
            width: 0,
            height: 0,
            timestamp: new Date()
        });
    };

    const onSubmit = (data: UploadFormData) => startTransition(async () => {
        try {
            // Get the selected file
            const file = data.image[0];
            if (!file) {
                alert("Please select an image");
                return;
            }

            // Convert file to base64
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
            const base64 = await base64Promise;

            // Prepare image data for upload
            const imageData: PartialBy<GalleryImageType, "id"> = {
                title: data.title,
                description: data.description,
                location: data.location,
                alt: data.alt,
                src: base64,
                width: data.width,
                height: data.height,
                timestamp: data.timestamp
            };

            await uploadImage(data.album, imageData);
            alert("Image uploaded successfully!");
            reset();
            setImagePreview(null);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload image");
        }
    });

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
            className="w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Image Upload Section */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Upload Image
                    </label>

                    <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                        {/* Upload Area */}
                        <div className="flex-1">
                            {!imagePreview ? (
                                <div
                                    className="relative h-full"
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
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
                                        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors group ${isDragging
                                                ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                                                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900'
                                            }`}
                                    >
                                        <motion.div
                                            className="flex flex-col items-center justify-center pt-4 pb-4 pointer-events-none"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <FaCloudUploadAlt className={`w-10 h-10 mb-2 transition-colors ${isDragging ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'
                                                }`} />
                                            <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PNG, JPG, GIF, WebP, SVG up to 10MB
                                            </p>
                                        </motion.div>
                                    </label>
                                </div>
                            ) : (
                                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 group">
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        fill
                                        className="object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={clearImage}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FaTimes className="text-sm" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Import from Drive Button */}
                        <motion.button
                            type="button"
                            onClick={handleImportFromDrive}
                            className="flex flex-row sm:flex-col items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all group sm:w-24 h-48"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Image
                                src={googleDriveLogo}
                                alt="Google Drive"
                                width={32}
                                height={32}
                                className="group-hover:scale-110 transition-transform"
                            />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 sm:text-center">
                                Import from Drive
                            </span>
                        </motion.button>
                    </div>

                    {errors.image && (
                        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                            {errors.image.message}
                        </p>
                    )}
                </motion.div>

                {/* Form Fields */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 space-y-3"
                >
                    {/* Album Selection */}
                    <div>
                        <label htmlFor="album" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Select Album *
                        </label>
                        <select
                            id="album"
                            {...register("album", { required: "Please select an album" })}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Choose an album...</option>
                            {albumList.map((album) => (
                                <option key={album.id} value={album.id}>
                                    {album.name}
                                </option>
                            ))}
                        </select>
                        {errors.album && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                {errors.album.message}
                            </p>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...register("title", { required: "Title is required" })}
                            placeholder="Enter image title..."
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        {errors.title && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Description
                        </label>
                        <textarea
                            id="description"
                            {...register("description")}
                            rows={3}
                            placeholder="Add a description for your image..."
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Width and Height - Side by side */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="width" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Width
                            </label>
                            <input
                                type="text"
                                id="width"
                                {...register("width")}
                                value={width ? `${width}px` : 'N/A'}
                                readOnly
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label htmlFor="height" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Height
                            </label>
                            <input
                                type="text"
                                id="height"
                                {...register("height")}
                                value={height ? `${height}px` : 'N/A'}
                                readOnly
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Timestamp */}
                    <div>
                        <label htmlFor="timestamp" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Timestamp
                        </label>
                        <input
                            type="text"
                            id="timestamp"
                            value={timestamp ? timestamp.toLocaleString() : 'N/A'}
                            readOnly
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label htmlFor="location" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            {...register("location")}
                            placeholder="Where was this taken?"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Alt Text */}
                    <div>
                        <label htmlFor="alt" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Alt Text *
                        </label>
                        <input
                            type="text"
                            id="alt"
                            {...register("alt", { required: "Alt text is required for accessibility" })}
                            placeholder="Describe the image for accessibility..."
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        {errors.alt && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                {errors.alt.message}
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants}>
                    <motion.button
                        type="submit"
                        disabled={isPending}
                        className="w-full px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-sm rounded-lg shadow-lg disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        whileHover={!isPending ? { scale: 1.02 } : {}}
                        whileTap={!isPending ? { scale: 0.98 } : {}}
                    >
                        {isPending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <FaImage className="text-sm" />
                                <span>Upload Image</span>
                            </>
                        )}
                    </motion.button>
                </motion.div>
            </form>
        </motion.div>
    );
}
