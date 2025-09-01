"use client";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

interface ContactFormValues {
    fullName: string;
    email: string;
    subject: string;
    message: string;
}

export default function ContactForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm<ContactFormValues>();

    const onSubmit = async (data: ContactFormValues) => {
        // You can integrate your email/send logic here.
        // For demo, just reset after 1.5s
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                reset();
                resolve();
            }, 1500);
        });
    };

    return (
        <motion.section
            className="w-full space-y-6 mt-32 px-4 md:px-0 container mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            aria-labelledby="contact-form-heading"
            role="region"
        >
            <form
                className="max-w-3xl mx-auto"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                aria-label="Contact form"
            >
                <motion.h2
                    id="contact-form-heading"
                    className="text-2xl font-semibold text-center text-blue-700 dark:text-cyan-200 mb-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    Contact Me
                </motion.h2>
                <motion.div
                    className="grid grid-cols-1 gap-5"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.08 } },
                    }}
                >
                    {/* Full Name */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 },
                        }}
                    >
                        <label 
                            htmlFor="fullName" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                        >
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            className={`w-full px-4 py-2 rounded-lg border ${errors.fullName
                                ? "border-red-400"
                                : "border-gray-300 dark:border-gray-600"
                                } bg-white dark:bg-[#1a243a] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                            placeholder="Enter your full name"
                            aria-required="true"
                            aria-invalid={errors.fullName ? "true" : "false"}
                            {...register("fullName", {
                                required: "Full name is required",
                                minLength: { value: 3, message: "At least 3 characters" },
                            })}
                            disabled={isSubmitting}
                        />
                        {errors.fullName && (
                            <span className="text-xs text-red-500" role="alert">{errors.fullName.message}</span>
                        )}
                    </motion.div>
                    {/* Email */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 },
                        }}
                    >
                        <label 
                            htmlFor="email" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={`w-full px-4 py-2 rounded-lg border ${errors.email ? "border-red-400" : "border-gray-300 dark:border-gray-600"
                                } bg-white dark:bg-[#1a243a] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                            placeholder="your@email.com"
                            aria-required="true"
                            aria-invalid={errors.email ? "true" : "false"}
                            aria-describedby={errors.email ? "email-error" : undefined}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                    message: "Invalid email address",
                                },
                            })}
                            disabled={isSubmitting}
                        />
                        {errors.email && (
                            <span id="email-error" className="text-xs text-red-500" role="alert">{errors.email.message}</span>
                        )}
                    </motion.div>
                    {/* Subject */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 },
                        }}
                    >
                        <label 
                            htmlFor="subject" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                        >
                            Subject
                        </label>
                        <input
                            id="subject"
                            type="text"
                            className={`w-full px-4 py-2 rounded-lg border ${errors.subject
                                ? "border-red-400"
                                : "border-gray-300 dark:border-gray-600"
                                } bg-white dark:bg-[#1a243a] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                            placeholder="Subject"
                            aria-required="true"
                            aria-invalid={errors.subject ? "true" : "false"}
                            aria-describedby={errors.subject ? "subject-error" : undefined}
                            {...register("subject", {
                                required: "Subject is required",
                                minLength: { value: 3, message: "At least 3 characters" },
                            })}
                            disabled={isSubmitting}
                        />
                        {errors.subject && (
                            <span id="subject-error" className="text-xs text-red-500" role="alert">{errors.subject.message}</span>
                        )}
                    </motion.div>
                    {/* Message */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 },
                        }}
                    >
                        <label 
                            htmlFor="message" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            className={`w-full px-4 py-2 rounded-lg border min-h-[100px] resize-y ${errors.message
                                ? "border-red-400"
                                : "border-gray-300 dark:border-gray-600"
                                } bg-white dark:bg-[#1a243a] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                            placeholder="Your message"
                            aria-required="true"
                            aria-invalid={errors.message ? "true" : "false"}
                            aria-describedby={errors.message ? "message-error" : undefined}
                            {...register("message", {
                                required: "Message is required",
                                minLength: { value: 10, message: "At least 10 characters" },
                                maxLength: { value: 2000, message: "Too long!" },
                            })}
                            disabled={isSubmitting}
                        />
                        {errors.message && (
                            <span id="message-error" className="text-xs text-red-500" role="alert">{errors.message.message}</span>
                        )}
                    </motion.div>
                </motion.div>
                <motion.div
                    className="flex justify-end"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <button
                        type="submit"
                        className="mt-10 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-2 rounded-full shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                </motion.div>
                {isSubmitSuccessful && (
                    <motion.div
                        className="mt-2 text-green-600 text-center font-semibold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        role="status"
                        aria-live="polite"
                    >
                        Thank you! Your message has been sent.
                    </motion.div>
                )}
            </form>
        </motion.section>
    );
}