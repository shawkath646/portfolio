"use client";
import { motion } from "framer-motion";
import {
    FaLinkedin,
    FaGithub,
    FaEnvelope,
    FaFacebook,
    FaFacebookMessenger,
    FaTelegramPlane,
    FaWhatsapp,
    FaInstagram,
    FaYoutube,
    FaTiktok,
    FaCommentDots,
    FaUserTie,
    FaGlobeAmericas
} from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";


const contactSections = [
    {
        title: "Professional Connection",
        icon: <FaUserTie className="text-blue-600 text-2xl" />,
        description: "Let's connect professionally for new opportunities, collaborations, or networking.",
        items: [
            {
                name: "LinkedIn",
                icon: <FaLinkedin className="text-blue-700" />,
                href: "https://www.linkedin.com/in/shawkath645",
                text: "Connect with me on LinkedIn",
            },
            {
                name: "GitHub",
                icon: <FaGithub className="text-gray-800 dark:text-white" />,
                href: "https://github.com/shawkath646",
                text: "Explore my code and projects",
            },
            {
                name: "Email",
                icon: <FaEnvelope className="text-red-500" />,
                href: "mailto:shawkath646@email.com",
                text: "Send me an email",
            },
        ],
    },
    {
        title: "Messaging",
        icon: <FaCommentDots className="text-cyan-600 text-2xl" />,
        description: "Reach out for a quick chat, project discussion, or just to say hi!",
        items: [
            {
                name: "Facebook",
                icon: <FaFacebook className="text-blue-600" />,
                href: "https://facebook.com/shawkath646",
                text: "Message me on Facebook",
            },
            {
                name: "Messenger",
                icon: <FaFacebookMessenger className="text-blue-500" />,
                href: "https://m.me/shawkath646",
                text: "Chat via Messenger",
            },
            {
                name: "KakaoTalk",
                icon: <RiKakaoTalkFill className="text-yellow-400" />,
                href: "http://qr.kakao.com/talk/lhQ8wtB0hDo1NTSLIbPJ.RzAPIw-",
                text: "Connect on KakaoTalk",
            },
            {
                name: "Telegram",
                icon: <FaTelegramPlane className="text-blue-400" />,
                href: "https://t.me/shawkath646",
                text: "Ping me on Telegram",
            },
            {
                name: "WhatsApp",
                icon: <FaWhatsapp className="text-green-500" />,
                href: "https://wa.me/+821048376284",
                text: "Message me on WhatsApp",
            },
        ],
    },
    {
        title: "Social Media",
        icon: <FaGlobeAmericas className="text-pink-400 text-2xl" />,
        description: "Follow for updates, vlogs, and creative content.",
        items: [
            {
                name: "Facebook",
                icon: <FaFacebook className="text-blue-600" />,
                href: "https://facebook.com/shawkath646",
                text: "See my posts & stories",
            },
            {
                name: "YouTube",
                icon: <FaYoutube className="text-red-600" />,
                href: "https://youtube.com/@shawkath646",
                text: "Watch tutorials & vlogs",
            },
            {
                name: "Instagram",
                icon: <FaInstagram className="text-pink-500" />,
                href: "https://instagram.com/shawkath646",
                text: "See travel photos & reels",
            },
            {
                name: "TikTok",
                icon: <FaTiktok className="text-black dark:text-white" />,
                href: "https://tiktok.com/@shawkath646",
                text: "Watch mind relaxing short video of exploring myself",
            },
        ],
    },
];

// Component for connections and contact methods
export default function Connections() {
    return (
        <section 
            className="flex flex-col items-center" 
            aria-labelledby="connections-heading"
        >
            <motion.h1
                id="connections-heading"
                className="text-3xl sm:text-4xl font-bold text-center mb-4 text-blue-900 dark:text-cyan-200"
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            >
                Get In Touch
            </motion.h1>
            <motion.p
                className="text-gray-600 dark:text-gray-300 max-w-2xl text-center mb-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                Whether you want to discuss a project, collaborate professionally, or just connect on social — pick your favorite way to reach out!
            </motion.p>
            <div 
                className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                role="region"
                aria-label="Contact methods by category"
            >
                {contactSections.map((section, idx) => (
                    <motion.div
                        key={section.title}
                        className="rounded-2xl shadow-xl bg-white/70 dark:bg-[#16213e]/80 backdrop-blur px-6 py-8 flex flex-col items-center transition-all border-t-4"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + idx * 0.1, type: "spring" }}
                        style={{
                            borderTopColor:
                                idx === 0
                                    ? "#2563eb" // blue-600
                                    : idx === 1
                                        ? "#06b6d4" // cyan-400
                                        : "#ec4899", // pink-500
                        }}
                        aria-labelledby={`section-heading-${idx}`}
                    >
                        <div className="mb-2" aria-hidden="true">{section.icon}</div>
                        <h2
                            id={`section-heading-${idx}`}
                            className={`text-xl font-semibold mb-1 ${idx === 0
                                    ? "text-blue-700"
                                    : idx === 1
                                        ? "text-cyan-700"
                                        : "text-pink-500"
                                }`}
                        >
                            {section.title}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-200 text-center text-sm mb-5">{section.description}</p>
                        <ul 
                            className="w-full flex flex-col gap-4"
                            aria-label={`${section.title} contact methods`}
                        >
                            {section.items.map((item) => (
                                <motion.li
                                    key={item.name}
                                    whileHover={{ scale: 1.04, y: -3 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-3 bg-white dark:bg-[#15233c] px-3 py-2 rounded-lg shadow border hover:shadow-lg transition-all group"
                                >
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 w-full"
                                        aria-label={`${item.name}: ${item.text}`}
                                    >
                                        <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                                        <span className="flex-1">
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</span>
                                            <span className="block text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-900 group-hover:dark:text-cyan-200 transition">{item.text}</span>
                                        </span>
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
            <motion.div
                className="mt-12 text-sm text-gray-500 dark:text-gray-300 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                Always happy to connect &amp; collaborate — drop a hi anytime!
            </motion.div>
        </section>
    );
}