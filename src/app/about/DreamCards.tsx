import { motion } from 'framer-motion';

export default function DreamCards() {

    const goals = [
        {
            title: "🌍 Exploring every corner of the earth",
            description:
                "I want to reach every corner of the world and witness the beauty Allah has created for us. I admire nature—from the top of mountains to the bed of the sea.",
        },
        {
            title: "💻 Be a software engineer",
            description:
                "Coding and developing applications is an addiction to me. I aim to build my career in the software engineering field. I'm already working hard to master web development, but I know the race is long, especially with the rise of AI.",
        },
        {
            title: "🕊️ Keeping a scratch before I die",
            description:
                "I want to leave a footprint before I leave this earth. People may forget quickly, but I still believe I’ll live on through my online presence, my portfolio, my soft behavior, and the people I've helped.",
        },
    ];


    return (
        <section className="container mx-auto py-16 px-4">
            <div className="mb-14 text-center">
                <div className="mb-5 bg-gradient-to-r from-pink-500 to-indigo-500 px-2 shadow-lg max-w-xl mx-auto transform -skew-x-6">
                    <motion.h2
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-xl sm:text-2xl font-bold text-black dark:text-white py-2.5 px-4 bg-white dark:bg-gray-800 tracking-wide transform skew-x-6"
                    >
                        My Dreams & Aspirations
                    </motion.h2>
                </div>

                <p className="text-lg font-medium text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    These are the goals that fuel my passion and guide my journey—if Allah wills.
                </p>
            </div>

            <div className="space-y-8 max-w-5xl mx-auto">
                {goals.map((goal, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: i * 0.2, duration: 0.8 }}
                        className={`flex flex-col lg:flex-row items-center gap-8 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                    >
                        <div className="flex-1">
                            <div className="relative p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-700">
                                        Personal Growth
                                    </span>
                                </div>

                                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {goal.title}
                                </h3>

                                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {goal.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-3xl shadow-lg hover:scale-110 transition-transform duration-300">
                                {goal.title.split(' ')[0]}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};