"use client";
import { useState, useTransition, useCallback } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaCloudUploadAlt, FaImage, FaTimes } from "react-icons/fa";
import { requestImageUploadURL, saveGalleryImage } from "@/actions/gallery/imageManagement";
import googleDriveLogo from "@/assets/google-drive-icon-512x512.png";
import FileDragDrop from "@/components/FileDragDrop";
import { useToast } from "@/components/Toast";
import { GalleryAlbumType } from "@/types/gallery.types";
import getImageMetadata from "@/utils/getImageMetadata";

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
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isPending, startTransition] = useTransition();
    const toast = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        setError,
        clearErrors,
        watch
    } = useForm<UploadFormData>({
        defaultValues: {
            description: "",
            location: "",
            width: 0,
            height: 0,
            timestamp: new Date(),
        }
    });

    const width = watch('width');
    const height = watch('height');
    const timestamp = watch('timestamp');

    const validateImageFile = useCallback((file: File): string | null => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            return 'Only image files are allowed (JPG, PNG, GIF, WebP, or SVG).';
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return 'Image must be 10MB or smaller.';
        }

        return null;
    }, []);

    const handleImageSelect = useCallback(async (file: File) => {
        const validationError = validateImageFile(file);
        if (validationError) {
            setError("image", { type: "manual", message: validationError });
            return;
        }

        clearErrors("image");

        const metadata = await getImageMetadata(file);

        setValue('width', metadata.width ?? 0, { shouldValidate: true, shouldDirty: true });
        setValue('height', metadata.height ?? 0, { shouldValidate: true, shouldDirty: true });
        setValue('timestamp', metadata.timestamp || new Date(), { shouldValidate: true, shouldDirty: true });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        const fileList = dataTransfer.files;
        setValue('image', fileList as unknown as FileList, { shouldValidate: true, shouldDirty: true });

        setImagePreview((prev) => {
            if (prev) {
                URL.revokeObjectURL(prev);
            }
            return URL.createObjectURL(file);
        });
    }, [clearErrors, setError, setValue, validateImageFile]);

    // Clear image preview
    const clearImage = useCallback(() => {
        setImagePreview((prev) => {
            if (prev) {
                URL.revokeObjectURL(prev);
            }
            return null;
        });
        clearErrors("image");
        setValue('image', undefined as unknown as FileList, { shouldValidate: true, shouldDirty: true });
        setValue('width', 0, { shouldValidate: true, shouldDirty: true });
        setValue('height', 0, { shouldValidate: true, shouldDirty: true });
        setValue('timestamp', new Date(), { shouldValidate: true, shouldDirty: true });
    }, [clearErrors, setValue]);

    const onSubmit = (data: UploadFormData) => startTransition(async () => {
        try {
            const file = data.image[0];
            if (!file) {
                toast("Please select an image", "warning");
                return;
            }

            setUploadProgress(0);

            const urlResult = await requestImageUploadURL({
                fileType: file.type,
                fileSize: file.size,
            });

            if (!urlResult.success || !urlResult.imageId || !urlResult.uploadURL) {
                throw new Error(urlResult.message || 'Failed to generate upload URL');
            }

            const xhr = new XMLHttpRequest();

            await new Promise<void>((resolve, reject) => {
                xhr.upload.addEventListener("progress", (event) => {
                    if (event.lengthComputable) {
                        const progress = Math.round((event.loaded / event.total) * 100);
                        setUploadProgress(progress);
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        setUploadProgress(100);
                        resolve();
                    } else {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                });

                xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
                xhr.open('PUT', urlResult.uploadURL!);
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.setRequestHeader('x-goog-content-length-range', `0,${file.size}`);
                xhr.send(file);
            });

            const saveResult = await saveGalleryImage({
                id: urlResult.imageId,
                albumId: data.album,
                title: data.title,
                description: data.description,
                alt: data.alt,
                location: data.location,
                width: data.width,
                height: data.height,
                timestamp: data.timestamp,
            });

            if (!saveResult.success) {
                throw new Error(saveResult.message || 'Failed to save image');
            }

            toast("Image uploaded successfully!", "success");
            reset();
            setImagePreview((prev) => {
                if (prev) {
                    URL.revokeObjectURL(prev);
                }
                return null;
            });
            setUploadProgress(0);
        } catch (error) {
            console.log(error);
            setUploadProgress(0);
            toast("Failed to upload image", "error");
        }
    });

    const handleImportFromDrive = () => {
        toast("Import from Google Drive - Coming soon!", "info");
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
                                <FileDragDrop
                                    onFileSelected={handleImageSelect}
                                    accept="image/*"
                                    disabled={isPending}
                                    className="w-full h-48 mb-0 rounded-lg"
                                    idleClassName="border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 hover:border-blue-400 dark:hover:border-blue-500"
                                    draggingClassName="border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30"
                                    inputAriaLabel="Image upload input"
                                >
                                    {({ isDragging }) => (
                                        <motion.div
                                            className="flex flex-col items-center justify-center pt-4 pb-4"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <FaCloudUploadAlt className={`w-10 h-10 mb-2 transition-colors ${isDragging ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                            <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PNG, JPG, GIF, WebP, SVG up to 10MB
                                            </p>
                                        </motion.div>
                                    )}
                                </FileDragDrop>
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

                        <input
                            type="hidden"
                            {...register("image", { required: "Please select an image" })}
                        />

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
                            {...register("title", {
                                required: "Title is required",
                                validate: (value) => value.trim().length > 0 || "Title is required",
                            })}
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
                    <textarea
                        id="description"
                        {...register("description", {
                            required: "Description is required",
                            minLength: {
                                value: 5,
                                message: "Description must be at least 5 characters",
                            },
                            validate: (value) => value.trim().length > 0 || "Description is required",
                        })}
                        rows={3}
                        placeholder="Add a description for your image..."
                        onInput={(e) => {
                            const el = e.currentTarget;
                            el.style.height = "auto";
                            el.style.height = `${el.scrollHeight}px`;
                        }}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none max-h-40 overflow-y-auto custom-scrollbar"
                    />

                    {/* Width and Height - Side by side */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="width" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Width
                            </label>
                            <input
                                type="text"
                                id="width"
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
                                value={height ? `${height}px` : 'N/A'}
                                readOnly
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <input
                        type="hidden"
                        {...register("width", {
                            required: "Width is required",
                            min: { value: 1, message: "Width must be greater than 0" },
                            valueAsNumber: true,
                        })}
                    />
                    <input
                        type="hidden"
                        {...register("height", {
                            required: "Height is required",
                            min: { value: 1, message: "Height must be greater than 0" },
                            valueAsNumber: true,
                        })}
                    />
                    {(errors.width || errors.height) && (
                        <p className="-mt-1 text-xs text-red-600 dark:text-red-400">
                            {errors.width?.message || errors.height?.message}
                        </p>
                    )}

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
                            {...register("location", {
                                required: "Location is required",
                                minLength: {
                                    value: 2,
                                    message: "Location must be at least 2 characters",
                                },
                                validate: (value) => value.trim().length > 0 || "Location is required",
                            })}
                            placeholder="Where was this taken?"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        {errors.location && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                {errors.location.message}
                            </p>
                        )}
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
                        className="w-full px-5 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-sm rounded-lg shadow-lg disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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

                    {isPending && (
                        <div className="mt-2">
                            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                <div
                                    className="h-full bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-200"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 text-right">
                                {uploadProgress}% uploaded
                            </p>
                        </div>
                    )}
                </motion.div>
            </form>
        </motion.div>
    );
}
