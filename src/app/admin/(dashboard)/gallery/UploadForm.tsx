"use client";
import { useState, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { FileObject, useEasyDragDrop } from "easy-file-dragdrop";
import { motion } from "framer-motion";
import { FaImage } from "react-icons/fa";
import { requestImageUploadURL, saveGalleryImage } from "@/actions/gallery/imageManagement";
import { useToast } from "@/components/Toast";
import { GalleryAlbumType, GalleryImageItemType } from "@/types/gallery.types";
import runWithConcurrency from "@/utils/runWithConcurrency";

type UploadFormData = {
    title: string;
    description: string;
    location: string;
    alt: string;
    album: string;
    images: FileObject[];
};


const MAX_UPLOAD_FILES = 20;
const MAX_UPLOAD_FILE_SIZE_MB = 10;
const IMAGE_ACCEPT = "image/jpeg,image/png,image/gif,image/webp,image/svg+xml";

export default function UploadForm({ albumList }: { albumList: GalleryAlbumType[] }) {
    const { InputCanvas, PreviewPane } = useEasyDragDrop();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UploadFormData>({
        defaultValues: {
            title: "",
            description: "",
            location: "",
            alt: "",
            album: "",
            images: []
        }
    });

    const uploadFileWithProgress = useCallback(async (
        file: File,
        uploadURL: string,
        onProgress: (loadedBytes: number) => void
    ): Promise<void> => {
        const xhr = new XMLHttpRequest();

        await new Promise<void>((resolve, reject) => {
            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    onProgress(event.loaded);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    onProgress(file.size);
                    resolve();
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            });

            xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
            xhr.open('PUT', uploadURL);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.setRequestHeader('x-goog-content-length-range', `0,${file.size}`);
            xhr.send(file);
        });
    }, []);



    const onSubmit = async (data: UploadFormData) => {
        try {
            const selectedItems = data.images;
            const selectedImages = selectedItems.map((item) => item.file);

            if (selectedImages.length === 0) {
                toast("Please select at least one image", "warning");
                return;
            }

            setIsLoading(true);
            setUploadProgress(0);

            const preparationTasks = selectedItems.map((item) => async () => {
                const urlResult = await requestImageUploadURL({
                    fileType: item.metadata.type,
                    fileSize: item.metadata.size,
                });

                if (!urlResult.success || !urlResult.imageId || !urlResult.uploadURL) {
                    throw new Error(urlResult.message || "Failed to generate upload URL");
                }

                return {
                    imageId: urlResult.imageId,
                    uploadURL: urlResult.uploadURL,
                    width: item.image?.width ?? 0,
                    height: item.image?.height ?? 0,
                    size: item.metadata.size || 0,
                    timestamp: item.metadata.lastModified
                        ? new Date(item.metadata.lastModified)
                        : new Date(item.createdAt)
                };
            });

            const preparedFiles = await runWithConcurrency(preparationTasks, 4);

            const totalBytes = selectedImages.reduce((sum, image) => sum + image.size, 0);
            const perFileLoadedBytes = new Array(selectedImages.length).fill(0);
            let uploadedBytes = 0;
            let isUpdating = false;

            const uploadTasks = selectedImages.map((image, index) => async () => {
                await uploadFileWithProgress(image, preparedFiles[index].uploadURL, (loaded) => {
                    const maxForFile = image.size || 0;
                    const nextLoaded = Math.max(0, Math.min(loaded, maxForFile));
                    const delta = nextLoaded - perFileLoadedBytes[index];

                    if (delta <= 0) return;

                    perFileLoadedBytes[index] = nextLoaded;
                    uploadedBytes += delta;

                    if (!isUpdating) {
                        isUpdating = true;
                        requestAnimationFrame(() => {
                            const progress = totalBytes > 0
                                ? Math.round((uploadedBytes / totalBytes) * 100)
                                : 100;
                            setUploadProgress(Math.min(progress, 100));
                            isUpdating = false;
                        });
                    }
                });
            });

            await runWithConcurrency(uploadTasks, 4);
            setUploadProgress(100);

            const finalImageData: Omit<GalleryImageItemType, "src">[] = preparedFiles.map(file => ({
                id: file.imageId,
                height: file.height,
                width: file.width,
                size: file.size ?? 0,
                timestamp: file.timestamp
            }));

            if (finalImageData.length === 0) {
                throw new Error("No image data found.");
            }

            const saveResult = await saveGalleryImage(
                {
                    albumId: data.album,
                    title: data.title,
                    description: data.description,
                    alt: data.alt,
                    location: data.location,
                },
                finalImageData
            );

            if (!saveResult.success) {
                throw new Error(saveResult.message || 'Failed to save image');
            }

            toast(`${finalImageData.length} image${finalImageData.length > 1 ? 's' : ''} uploaded successfully!`, "success");
            reset();

        } catch (error) {
            console.error("Upload error:", error);
            toast("Failed to upload image", "error");
        } finally {
            setUploadProgress(0);
            setIsLoading(false);
        }
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-10">
                {/* Image Upload Section */}
                <motion.div
                    variants={itemVariants}
                    className="overflow-hidden relative"
                >
                    <Controller
                        name="images"
                        control={control}
                        render={({ field }) => {
                            const fieldProps = {
                                name: field.name,
                                value: field.value,
                                onChange: field.onChange,
                                onBlur: field.onBlur,
                            };

                            return (
                                <>
                                    <InputCanvas
                                        label="Upload Images"
                                        description={`PNG, JPG, GIF, WebP, SVG up to ${MAX_UPLOAD_FILE_SIZE_MB}MB each`}
                                        {...fieldProps}
                                        accept={IMAGE_ACCEPT}
                                        multiple
                                        maxFiles={MAX_UPLOAD_FILES}
                                        maxFileSize={MAX_UPLOAD_FILE_SIZE_MB}
                                        disabled={isLoading}
                                    />
                                    {fieldProps.value.length > 0 && (
                                        <div className="mt-4">
                                            <PreviewPane showPreview />
                                        </div>
                                    )}
                                </>
                            );
                        }}
                    />
                </motion.div>

                {/* Form Fields */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-xl border border-white/60 bg-white/70 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/45"
                >
                    <div className="relative space-y-3">
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
                    </div>
                </motion.div>

                {isLoading && (
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

                {/* Submit Button */}
                <motion.div variants={itemVariants}>
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        className="mt-8 w-full px-5 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-sm rounded-lg shadow-lg disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <FaImage className="text-sm" />
                                <span>Upload Images</span>
                            </>
                        )}
                    </motion.button>
                </motion.div>
            </form>
        </motion.div>
    );
}
