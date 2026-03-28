"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { formatDateTime } from "@/utils/dateTime";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
};

const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

interface Channel {
    icon: string;
    title: string;
}

interface Video {
    videoId: string;
    thumbnail: string;
    title: string;
    publishedAt: string;
}

interface YoutubeGridProps {
    channel: Channel;
    videos: Video[];
}

export default function YoutubeGrid({ channel, videos }: YoutubeGridProps) {
    return (
        <motion.section
            className="container mx-auto py-8 my-20"
            aria-labelledby="youtube-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
        >
            <div className="mb-12" data-nosnippet>
                <motion.h2
                    id="youtube-title"
                    className="text-3xl font-bold mb-2 text-center"
                    variants={fadeUp}
                >
                    🎥 Explore My YouTube Channel
                </motion.h2>

                <motion.p
                    className="text-center text-gray-600 dark:text-gray-300"
                    variants={fadeUp}
                >
                    Curious about what I do in my leisure time? I share tutorials, dev logs, and cool experiments.
                    Visit & subscribe to stay updated!
                </motion.p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start">
                {/* Channel Info Card */}
                <motion.aside
                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 shrink-0 w-full md:w-80 text-center"
                    variants={fadeUp}
                    aria-label="YouTube channel information"
                >
                    <Image
                        src={channel.icon}
                        alt={`${channel.title} channel logo`}
                        width={100}
                        height={100}
                        className="rounded-full mx-auto mb-4"
                    />
                    <h3 className="text-2xl font-semibold mb-2">{channel.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        @shawkath646
                    </p>
                    <Link
                        href="https://www.youtube.com/@shawkath646?sub_confirmation=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition"
                        aria-label="Subscribe to the YouTube channel"
                    >
                        🔔 Subscribe
                    </Link>
                </motion.aside>

                {/* Horizontal Scrollable Video List */}
                <motion.div
                    className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar px-2"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    role="list"
                    aria-label="Recent YouTube videos"
                >
                    <motion.div className="flex gap-4 min-w-max">
                        {videos.map((video: Video) => (
                            <motion.article
                                key={video.videoId}
                                variants={fadeUp}
                                whileHover={{ scale: 1.05 }}
                                className="w-75 h-68"
                                role="listitem"
                            >
                                <Link
                                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-lg transition duration-200 overflow-hidden"
                                    aria-label={`Watch ${video.title}`}
                                >
                                    <Image
                                        src={video.thumbnail}
                                        alt={`Thumbnail for ${video.title}`}
                                        width={300}
                                        height={169}
                                        className="w-full h-auto"
                                    />
                                    <div className="py-3 px-3">
                                        <h4 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2">
                                            {video.title}
                                        </h4>
                                        <time 
                                            className="text-xs text-gray-500 dark:text-gray-400 mt-2 block"
                                            dateTime={video.publishedAt}
                                        >
                                            {formatDateTime(new Date(video.publishedAt))}
                                        </time>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
}
