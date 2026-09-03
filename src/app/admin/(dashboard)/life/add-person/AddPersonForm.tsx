"use client";

import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Switch, RadioGroup, Radio } from "@headlessui/react";
import { FileObject, useEasyDragDrop } from "easy-file-dragdrop";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserPlus, FaUser, FaCheck, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaFileAlt, FaGlobe } from "react-icons/fa";
import { useToast } from "@/components/Toast";
import { PersonCategory, PersonObject, GenderType } from "@/types/person.types";
import { requestProfilePicUploadURL, requestMdxUploadURL, savePersonAction } from "@/actions/person/personManagement";

const formatDateToInput = (date?: Date | null): string => {
    if (!date) return "";
    try {
        return date.toISOString().split("T")[0];
    } catch {
        return "";
    }
};

interface AddPersonFormData {
    name: string;
    category: PersonCategory;
    gender: GenderType;
    addToTimeline: boolean;
    priority?: boolean;
    profilePic: FileObject[];
    mdxFile: FileObject[];
    startOn?: string;
    endOn?: string;
    dob?: string;
    phoneNumbers: { value: string }[];
    address?: string;
    info?: string;
    email?: string;
}

interface AddPersonFormProps {
    personData?: PersonObject | null;
}

export default function AddPersonForm({ personData }: AddPersonFormProps) {
    const { InputCanvas: PicInput, PreviewPane: PicPreview } = useEasyDragDrop();
    const { InputCanvas: MdxInput, PreviewPane: MdxPreview } = useEasyDragDrop();
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<AddPersonFormData>({
        defaultValues: {
            name: personData?.name || "",
            category: personData?.category || "friends",
            gender: personData?.gender || "male",
            addToTimeline: personData?.addToTimeline || false,
            priority: personData?.priority || false,
            profilePic: [],
            mdxFile: [],
            startOn: formatDateToInput(personData?.startOn),
            endOn: formatDateToInput(personData?.endOn),
            dob: formatDateToInput(personData?.dob),
            phoneNumbers: (() => {
                if (!personData?.phone) return [{ value: "" }];
                if (Array.isArray(personData.phone)) {
                    return personData.phone.map(p => ({ value: p }));
                }
                return [{ value: personData.phone }];
            })(),
            address: personData?.address || "",
            info: personData?.info || "",
            email: personData?.email || "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "phoneNumbers",
    });

    const category = watch("category");
    const addToTimeline = watch("addToTimeline");

    const parseDateString = (str?: string): Date | null => {
        if (!str || str.trim().length === 0) return null;
        const d = new Date(str);
        return isNaN(d.getTime()) ? null : d;
    };

    const onSubmit = async (data: AddPersonFormData) => {
        setIsLoading(true);
        try {
            let profilePicUrl = personData?.profilePic;
            let mdxUrl = personData?.mdxUrl;

            // 1. Handle profile picture upload if selected
            if (data.profilePic.length > 0) {
                const fileItem = data.profilePic[0];
                const uploadRes = await requestProfilePicUploadURL(
                    fileItem.metadata.type,
                    fileItem.metadata.size
                );

                if (!uploadRes.success || !uploadRes.uploadURL || !uploadRes.profilePicUrl) {
                    throw new Error(uploadRes.message || "Failed to get profile pic upload URL");
                }

                const xhr = new XMLHttpRequest();
                await new Promise<void>((resolve, reject) => {
                    xhr.open("PUT", uploadRes.uploadURL!);
                    xhr.setRequestHeader("Content-Type", fileItem.metadata.type);
                    xhr.setRequestHeader("x-goog-content-length-range", `0,${fileItem.metadata.size}`);
                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) resolve();
                        else reject(new Error("Failed to upload profile picture to cloud storage"));
                    };
                    xhr.onerror = () => reject(new Error("Network error during profile pic upload"));
                    xhr.send(fileItem.file);
                });

                profilePicUrl = uploadRes.profilePicUrl;
            }

            // 2. Handle MDX file upload if selected
            if (data.mdxFile.length > 0) {
                const fileItem = data.mdxFile[0];
                const uploadRes = await requestMdxUploadURL(
                    fileItem.metadata.type,
                    fileItem.metadata.size
                );

                if (!uploadRes.success || !uploadRes.uploadURL || !uploadRes.mdxUrl) {
                    throw new Error(uploadRes.message || "Failed to get MDX upload URL");
                }

                const xhr = new XMLHttpRequest();
                await new Promise<void>((resolve, reject) => {
                    xhr.open("PUT", uploadRes.uploadURL!);
                    xhr.setRequestHeader("Content-Type", fileItem.metadata.type);
                    xhr.setRequestHeader("x-goog-content-length-range", `0,${fileItem.metadata.size}`);
                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) resolve();
                        else reject(new Error("Failed to upload MDX file to cloud storage"));
                    };
                    xhr.onerror = () => reject(new Error("Network error during MDX upload"));
                    xhr.send(fileItem.file);
                });

                mdxUrl = uploadRes.mdxUrl;
            }

            const phoneArray = data.phoneNumbers
                .map((p) => p.value.trim())
                .filter((val) => val.length > 0);

            const payload = {
                id: personData?.id,
                name: data.name,
                category: data.category,
                gender: data.gender,
                addToTimeline: data.category === "love corner" ? data.addToTimeline : false,
                priority: data.category === "love corner" && data.addToTimeline ? data.priority : null,
                profilePic: profilePicUrl || null,
                mdxUrl: mdxUrl || null,
                startOn: parseDateString(data.startOn),
                endOn: parseDateString(data.endOn),
                dob: parseDateString(data.dob),
                phone: phoneArray.length > 0 ? phoneArray : null,
                address: data.address || null,
                info: data.info || null,
                email: data.email || null,
            };

            const result = await savePersonAction(payload);

            if (!result.success) {
                throw new Error(result.message);
            }

            toast(
                personData
                    ? `Successfully updated ${data.name}!`
                    : `Successfully added ${data.name} to ${data.category}!`,
                "success"
            );
            
            if (!personData) {
                reset();
            }
        } catch (error: unknown) {
            console.error("Submission error:", error);
            const errorMessage = error instanceof Error ? error.message : "An error occurred during submission.";
            toast(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.08,
            },
        },
    } as const;

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 },
        },
    } as const;

    return (
        <motion.div
            className="w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* 2-Column Responsive Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Sidebar Column - Files & Core Details */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Profile Pic Upload Section */}
                        <motion.div variants={itemVariants} className="rounded-2xl border border-white/60 bg-white/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/45 shadow-md space-y-4">
                            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 pb-2 flex items-center gap-2">
                                <FaUser className="text-blue-500" />
                                <span>Profile Picture</span>
                            </h2>

                            {personData?.profilePic && (
                                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200/50 dark:border-gray-800/50">
                                    <span className="block text-[10px] text-gray-500 dark:text-gray-400 font-semibold mb-2 uppercase tracking-wide">
                                        Current Avatar
                                    </span>
                                    <div className="relative h-24 w-24 rounded-full overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm">
                                        <img
                                            src={personData.profilePic}
                                            alt={personData.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            <Controller
                                name="profilePic"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <PicInput
                                            label={personData?.profilePic ? "Change Picture" : "Upload Picture"}
                                            description="PNG, JPG, WebP up to 5MB"
                                            name={field.name}
                                            value={field.value}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            accept="image/jpeg,image/png,image/webp"
                                            maxFiles={1}
                                            maxFileSize={5}
                                            disabled={isLoading}
                                        />
                                        {field.value.length > 0 && (
                                            <div className="mt-4">
                                                <PicPreview showPreview />
                                            </div>
                                        )}
                                    </>
                                )}
                            />
                        </motion.div>

                        {/* MDX File Upload Section */}
                        <motion.div variants={itemVariants} className="rounded-2xl border border-white/60 bg-white/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/45 shadow-md space-y-4">
                            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 pb-2 flex items-center gap-2">
                                <FaFileAlt className="text-emerald-500" />
                                <span>MDX Content File</span>
                            </h2>

                            {personData?.mdxUrl && (
                                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200/50 dark:border-gray-800/50 text-xs">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900 dark:text-white">Current MDX Link</span>
                                        <a href={personData.mdxUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all mt-0.5">
                                            View uploaded MDX
                                        </a>
                                    </div>
                                </div>
                            )}

                            <Controller
                                name="mdxFile"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <MdxInput
                                            label={personData?.mdxUrl ? "Change MDX File" : "Upload MDX File"}
                                            description="MDX text document up to 5MB"
                                            name={field.name}
                                            value={field.value}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            accept=".mdx,text/plain"
                                            maxFiles={1}
                                            maxFileSize={5}
                                            disabled={isLoading}
                                        />
                                        {field.value.length > 0 && (
                                            <div className="mt-4">
                                                <MdxPreview showPreview />
                                            </div>
                                        )}
                                    </>
                                )}
                            />
                        </motion.div>

                        </div>

                    {/* Right Main Column - Timelines, Contacts & Notes */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Core Personal Details */}
                        <motion.div
                            variants={itemVariants}
                            className="rounded-2xl border border-white/60 bg-white/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/45 shadow-md space-y-4"
                        >
                            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 pb-2 flex items-center gap-2">
                                <FaUser className="text-blue-500" />
                                <span>Personal Details</span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                {/* Name */}
                                <div className="flex flex-col">
                                    <label htmlFor="name" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        {...register("name", {
                                            required: "Name is required",
                                            validate: (val) => val.trim().length > 0 || "Name is required",
                                        })}
                                        placeholder="Enter full name..."
                                        disabled={isLoading}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Gender */}
                                <div className="flex flex-col">
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                                        Gender *
                                    </label>
                                    <Controller
                                        name="gender"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="grid grid-cols-2 gap-2 h-9">
                                                <button
                                                    type="button"
                                                    disabled={isLoading}
                                                    onClick={() => field.onChange("male")}
                                                    className={`px-3 h-full text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                                                        field.value === "male"
                                                            ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                            : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
                                                    }`}
                                                >
                                                    Male
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isLoading}
                                                    onClick={() => field.onChange("female")}
                                                    className={`px-3 h-full text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                                                        field.value === "female"
                                                            ? "border-pink-500 bg-pink-500/10 text-pink-600 dark:text-pink-400"
                                                            : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
                                                    }`}
                                                >
                                                    Female
                                                </button>
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div className="flex flex-col">
                                    <label htmlFor="dob" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        id="dob"
                                        {...register("dob")}
                                        disabled={isLoading}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Categorization & Relationship Fields */}
                        <motion.div
                            variants={itemVariants}
                            className="rounded-2xl border border-white/60 bg-white/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/45 shadow-md space-y-4"
                        >
                            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 pb-2 flex items-center gap-2">
                                <FaCalendarAlt className="text-purple-500" />
                                <span>Categorization & Timeline</span>
                            </h2>

                            <div className="space-y-4">
                                {/* Category Selector */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                                        Category *
                                    </label>
                                    <Controller
                                        name="category"
                                        control={control}
                                        render={({ field }) => (
                                            <RadioGroup
                                                value={field.value}
                                                onChange={field.onChange}
                                                disabled={isLoading}
                                                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                            >
                                                <Radio
                                                    value="friends"
                                                    className={({ checked }) =>
                                                        `relative flex cursor-pointer rounded-xl border p-3.5 shadow-xs focus:outline-hidden transition-all ${
                                                            checked
                                                                ? "border-blue-500 bg-blue-500/10 dark:bg-blue-500/20 text-blue-900 dark:text-blue-100"
                                                                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
                                                        }`
                                                    }
                                                >
                                                    {({ checked }) => (
                                                        <div className="flex w-full items-center justify-between">
                                                            <div className="text-sm font-semibold">Friends</div>
                                                            {checked && <FaCheck className="h-4 w-4 text-blue-500" />}
                                                        </div>
                                                    )}
                                                </Radio>
                                                <Radio
                                                    value="love corner"
                                                    className={({ checked }) =>
                                                        `relative flex cursor-pointer rounded-xl border p-3.5 shadow-xs focus:outline-hidden transition-all ${
                                                            checked
                                                                ? "border-pink-500 bg-pink-500/10 dark:bg-pink-500/20 text-pink-900 dark:text-pink-100"
                                                                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
                                                        }`
                                                    }
                                                >
                                                    {({ checked }) => (
                                                        <div className="flex w-full items-center justify-between">
                                                            <div className="text-sm font-semibold">Love Corner</div>
                                                            {checked && <FaCheck className="h-4 w-4 text-pink-500" />}
                                                        </div>
                                                    )}
                                                </Radio>
                                            </RadioGroup>
                                        )}
                                    />
                                </div>

                                {/* Love Corner Sub-Fields */}
                                <AnimatePresence>
                                    {category === "love corner" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden space-y-4 pt-2 border-t border-gray-100 dark:border-gray-800"
                                        >
                                            {/* Add to Timeline Toggle */}
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200/50 dark:border-gray-800">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Add to timeline</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Display this person on the public love timeline</span>
                                                </div>
                                                <Controller
                                                    name="addToTimeline"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Switch
                                                            checked={field.value}
                                                            onChange={field.onChange}
                                                            disabled={isLoading}
                                                            className={`${
                                                                field.value ? "bg-pink-500" : "bg-gray-200 dark:bg-gray-700"
                                                            } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-pink-500 focus:ring-offset-2`}
                                                        >
                                                            <span
                                                                className={`${
                                                                    field.value ? "translate-x-5" : "translate-x-0"
                                                                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out`}
                                                            />
                                                        </Switch>
                                                    )}
                                                />
                                            </div>

                                            {/* Priority Toggle */}
                                            <AnimatePresence>
                                                {addToTimeline && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200/50 dark:border-gray-800"
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">Priority *</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">Mark this timeline event as high priority</span>
                                                        </div>
                                                        <Controller
                                                            name="priority"
                                                            control={control}
                                                            rules={{
                                                                validate: (value) => 
                                                                    value !== undefined || "Priority selection is required when added to timeline"
                                                            }}
                                                            render={({ field }) => (
                                                                <Switch
                                                                    checked={field.value ?? false}
                                                                    onChange={field.onChange}
                                                                    disabled={isLoading}
                                                                    className={`${
                                                                        field.value ? "bg-red-500" : "bg-gray-200 dark:bg-gray-700"
                                                                    } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                                                                >
                                                                    <span
                                                                        className={`${
                                                                            field.value ? "translate-x-5" : "translate-x-0"
                                                                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out`}
                                                                    />
                                                                </Switch>
                                                            )}
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Start On & End On dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="startOn" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                                            Start On
                                        </label>
                                        <input
                                            type="date"
                                            id="startOn"
                                            {...register("startOn")}
                                            disabled={isLoading}
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="endOn" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                                            End On
                                        </label>
                                        <input
                                            type="date"
                                            id="endOn"
                                            {...register("endOn")}
                                            disabled={isLoading}
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Info & Notes Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Contact Information */}
                            <motion.div
                                variants={itemVariants}
                                className="rounded-2xl border border-white/60 bg-white/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/45 shadow-md space-y-4"
                            >
                                <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 pb-2 flex items-center gap-2">
                                    <FaPhone className="text-green-500" />
                                    <span>Contact Info</span>
                                </h2>

                                <div className="space-y-4">
                                    {/* Email Address */}
                                    <div className="flex flex-col">
                                        <label htmlFor="email" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            {...register("email")}
                                            placeholder="Enter email address..."
                                            disabled={isLoading}
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* Phone Numbers Array */}
                                    <div className="flex flex-col space-y-2">
                                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Phone Numbers
                                        </label>
                                        
                                        <div className="space-y-2">
                                            {fields.map((field, index) => (
                                                <div key={field.id} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder={`Phone #${index + 1}`}
                                                        disabled={isLoading}
                                                        {...register(`phoneNumbers.${index}.value` as const)}
                                                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    />
                                                    {fields.length > 1 && (
                                                        <button
                                                            type="button"
                                                            disabled={isLoading}
                                                            onClick={() => remove(index)}
                                                            className="px-2 py-2 text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors cursor-pointer"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            disabled={isLoading}
                                            onClick={() => append({ value: "" })}
                                            className="self-start text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                                        >
                                            + Add Phone Number
                                        </button>
                                    </div>

                                    {/* Address */}
                                    <div className="flex flex-col">
                                        <label htmlFor="address" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                                            Address
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500 text-sm">
                                                <FaMapMarkerAlt />
                                            </span>
                                            <input
                                                type="text"
                                                id="address"
                                                {...register("address")}
                                                placeholder="Enter address..."
                                                disabled={isLoading}
                                                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Additional Information */}
                            <motion.div
                                variants={itemVariants}
                                className="rounded-2xl border border-white/60 bg-white/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/45 shadow-md space-y-4"
                            >
                                <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 pb-2 flex items-center gap-2">
                                    <FaFileAlt className="text-orange-500" />
                                    <span>Notes</span>
                                </h2>

                                <div className="flex flex-col h-[calc(100%-2.5rem)]">
                                    <label htmlFor="info" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                                        Information / Notes
                                    </label>
                                    <textarea
                                        id="info"
                                        {...register("info")}
                                        placeholder="Add any additional details or thoughts..."
                                        rows={4}
                                        disabled={isLoading}
                                        className="w-full flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none overflow-y-auto custom-scrollbar min-h-24"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <motion.div variants={itemVariants} className="flex justify-end gap-3 border-t border-gray-200/40 dark:border-gray-800/40 pt-4">
                    <button
                        type="button"
                        onClick={() => reset()}
                        disabled={isLoading}
                        className="px-6 py-2.5 text-sm font-bold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-all cursor-pointer"
                    >
                        Reset Form
                    </button>
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                        className="px-6 py-2.5 text-sm font-bold bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-md disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <FaUserPlus />
                                <span>{personData ? "Update Person" : "Add Person"}</span>
                            </>
                        )}
                    </motion.button>
                </motion.div>

            </form>
        </motion.div>
    );
}
