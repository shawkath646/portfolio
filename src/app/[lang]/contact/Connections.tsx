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

type ContactItemText = {
    name: string;
    text: string;
};

type ConnectionsLanguagePack = {
    heading: string;
    subtitle: string;
    categoriesAriaLabel: string;
    footerText: string;
    professional: {
        title: string;
        description: string;
        linkedIn: ContactItemText;
        github: ContactItemText;
        email: ContactItemText;
    };
    messaging: {
        title: string;
        description: string;
        facebook: ContactItemText;
        messenger: ContactItemText;
        kakaoTalk: ContactItemText;
        telegram: ContactItemText;
        whatsapp: ContactItemText;
    };
    social: {
        title: string;
        description: string;
        facebook: ContactItemText;
        youtube: ContactItemText;
        instagram: ContactItemText;
        tiktok: ContactItemText;
    };
};

// Component for connections and contact methods
export default function Connections({ languagePack }: { languagePack: ConnectionsLanguagePack }) {
    const contactSections = [
        {
            title: languagePack.professional.title,
            icon: <FaUserTie className="text-blue-600 text-2xl" />,
            description: languagePack.professional.description,
            items: [
                {
                    name: languagePack.professional.linkedIn.name,
                    icon: <FaLinkedin className="text-blue-700" />,
                    href: "https://www.linkedin.com/in/shawkath645",
                    text: languagePack.professional.linkedIn.text,
                },
                {
                    name: languagePack.professional.github.name,
                    icon: <FaGithub className="text-gray-800 dark:text-white" />,
                    href: "https://github.com/shawkath646",
                    text: languagePack.professional.github.text,
                },
                {
                    name: languagePack.professional.email.name,
                    icon: <FaEnvelope className="text-red-500" />,
                    href: "mailto:shawkath646@email.com",
                    text: languagePack.professional.email.text,
                },
            ],
        },
        {
            title: languagePack.messaging.title,
            icon: <FaCommentDots className="text-cyan-600 text-2xl" />,
            description: languagePack.messaging.description,
            items: [
                {
                    name: languagePack.messaging.facebook.name,
                    icon: <FaFacebook className="text-blue-600" />,
                    href: "https://facebook.com/shawkath646",
                    text: languagePack.messaging.facebook.text,
                },
                {
                    name: languagePack.messaging.messenger.name,
                    icon: <FaFacebookMessenger className="text-blue-500" />,
                    href: "https://m.me/shawkath646",
                    text: languagePack.messaging.messenger.text,
                },
                {
                    name: languagePack.messaging.kakaoTalk.name,
                    icon: <RiKakaoTalkFill className="text-yellow-400" />,
                    href: "http://qr.kakao.com/talk/lhQ8wtB0hDo1NTSLIbPJ.RzAPIw-",
                    text: languagePack.messaging.kakaoTalk.text,
                },
                {
                    name: languagePack.messaging.telegram.name,
                    icon: <FaTelegramPlane className="text-blue-400" />,
                    href: "https://t.me/shawkath646",
                    text: languagePack.messaging.telegram.text,
                },
                {
                    name: languagePack.messaging.whatsapp.name,
                    icon: <FaWhatsapp className="text-green-500" />,
                    href: "https://wa.me/+821048376284",
                    text: languagePack.messaging.whatsapp.text,
                },
            ],
        },
        {
            title: languagePack.social.title,
            icon: <FaGlobeAmericas className="text-pink-400 text-2xl" />,
            description: languagePack.social.description,
            items: [
                {
                    name: languagePack.social.facebook.name,
                    icon: <FaFacebook className="text-blue-600" />,
                    href: "https://facebook.com/shawkath646",
                    text: languagePack.social.facebook.text,
                },
                {
                    name: languagePack.social.youtube.name,
                    icon: <FaYoutube className="text-red-600" />,
                    href: "https://youtube.com/@shawkath646",
                    text: languagePack.social.youtube.text,
                },
                {
                    name: languagePack.social.instagram.name,
                    icon: <FaInstagram className="text-pink-500" />,
                    href: "https://instagram.com/shawkath646",
                    text: languagePack.social.instagram.text,
                },
                {
                    name: languagePack.social.tiktok.name,
                    icon: <FaTiktok className="text-black dark:text-white" />,
                    href: "https://tiktok.com/@shawkath646",
                    text: languagePack.social.tiktok.text,
                },
            ],
        },
    ];

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
                {languagePack.heading}
            </motion.h1>
            <motion.p
                className="text-gray-600 dark:text-gray-300 max-w-2xl text-center mb-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                {languagePack.subtitle}
            </motion.p>
            <div 
                className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                role="region"
                aria-label={languagePack.categoriesAriaLabel}
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
                {languagePack.footerText}
            </motion.div>
        </section>
    );
}