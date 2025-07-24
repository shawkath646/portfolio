"use client";
import { motion } from "framer-motion";
import DreamCards from "./DreamCards";
import EducationFlowChart from "./EducationFlowChart";


export default function About() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
            {/* Hero Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5">

                <div className="container mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1 className="pt-10 text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Welcome to SH World
                        </h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="lg:text-lg text-gray-600 dark:text-gray-300 mb-8 font-semibold"
                        >
                            I am very happy that you want to know about me. ☺️
                        </motion.p>

                        <motion.p>
                            I'm a <span className="font-semibold text-blue-600 dark:text-blue-400">20-year-old</span> soft-minded, introverted soul who always seeks calmness and enjoys life until the last breath. I embrace struggles and find meaning in every challenge. Every obstacle is an opportunity to grow, and every struggle tells a story worth sharing. Keep scrolling to discover my life, journey and dreams...
                        </motion.p>
                    </motion.div>
                </div>
            </section>
            <DreamCards />
            <EducationFlowChart />
        </main>
    );
}
