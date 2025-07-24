"use client";

import { motion } from "framer-motion";

const timeline = [
    {
        name: "Sejong University",
        address: "Gwanjin-gu, Seoul, South Korea",
        subject: "Computer Science and Engineering",
        period: "03 March 2025 – Present",
        result: "Ongoing",
        type: "University"
    },
    {
        name: "Narsingdi Model College",
        address: "West Brahmondi, Narsingdi Sadar, Narsingdi, Bangladesh",
        subject: "Science",
        period: "02 March 2022 – 16 November 2023",
        result: "GPA 4.25 out of 5.00",
        type: "High School"
    },
    {
        name: "Monohardi Govt. Pilot Model High School",
        address: "Monohardi, Narsingdi, Bangladesh",
        subject: "Science",
        period: "01 January 2016 – 30 December 2021",
        result: "GPA 5.00 out of 5.00",
        type: "Secondary School"
    },
    {
        name: "Narandi Jahanara Govt. Primary School",
        address: "Narandi, Monohardi, Narsingdi, Bangladesh",
        subject: "Science",
        period: "05 April 2014 – 30 December 2015",
        result: "GPA 5.00 out of 5.00",
        type: "Elementary School"
    },
];

export default function EducationFlowChart() {
    return (
        <section className="max-w-4xl mx-auto px-6 py-20 text-gray-900 dark:text-gray-100">
            <div className="mb-14 bg-gradient-to-r from-pink-500 to-indigo-500 px-2 shadow-lg max-w-xl mx-auto transform -skew-x-6">
                <motion.h2
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-xl sm:text-2xl font-bold text-black dark:text-white py-2.5 px-4 bg-white dark:bg-gray-800 tracking-wide transform skew-x-6 text-center"
                >
                    MY Academic Journey
                </motion.h2>
            </div>


            <div className="relative border-l-4 border-indigo-500 dark:border-indigo-400 pl-6 space-y-12">
                {timeline.map((edu, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.15 }}
                        className="relative"
                    >
                        <div className="absolute -left-[26px] top-1.5 w-5 h-5 rounded-full bg-indigo-500 dark:bg-indigo-400 border-4 border-white dark:border-gray-900 shadow-md"></div>

                        <div className="absolute -left-[26px] top-1.5 w-5 h-5 rounded-full bg-indigo-500 dark:bg-indigo-400 border-4 border-white dark:border-gray-900 shadow-md"></div>

                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md space-y-2">
                            <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{edu.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{edu.address}</p>
                            <p className="text-base font-medium text-gray-800 dark:text-gray-200 pt-1">{edu.subject}, {edu.type}</p>

                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">🎓 Result:</span> {edu.result}
                            </p>

                            <p className="text-sm text-gray-500 dark:text-gray-400">{edu.period}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section >
    );
}
