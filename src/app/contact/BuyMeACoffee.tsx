"use client";
import { motion } from "framer-motion";
import { FaCoffee, FaGift, FaHeart } from "react-icons/fa";

const donationOptions = [
  {
    title: "Buy Me a Coffee",
    icon: <FaCoffee className="text-amber-600 text-3xl" />,
    description: "Fuel my creativity and late-night coding with a virtual coffee! Your gesture keeps my passion alive.",
    btnLabel: "☕ Give a Coffee",
    href: "https://www.buymeacoffee.com/yourusername", // Replace with your Buy Me a Coffee URL
    color: "from-amber-200 via-amber-100 to-white dark:from-amber-900/30 dark:via-yellow-900/20 dark:to-[#181d20]",
  },
  {
    title: "Send a Gift",
    icon: <FaGift className="text-pink-500 text-3xl" />,
    description: "Show your appreciation by sending a small gift. Every bit of support motivates me to create more awesome projects.",
    btnLabel: "🎁 Send a Gift",
    href: "https://www.paypal.me/yourusername", // Replace with your PayPal/other gift link
    color: "from-pink-100 via-pink-50 to-white dark:from-pink-900/30 dark:via-pink-900/20 dark:to-[#1a1d22]",
  },
  {
    title: "Spread Some Love",
    icon: <FaHeart className="text-red-500 text-3xl" />,
    description: "Share a little love if my work helped you. Your support means the world and keeps me going!",
    btnLabel: "❤️ Give Some Love",
    href: "https://ko-fi.com/yourusername", // Replace with your Ko-fi or similar link
    color: "from-red-100 via-red-50 to-white dark:from-red-900/20 dark:via-pink-900/20 dark:to-[#181a1f]",
  },
];

export default function BuyMeACoffee() {
  return (
    <section 
      className="flex flex-col items-center mt-32" 
      aria-labelledby="support-heading"
    >
      <motion.h2
        id="support-heading"
        className="text-3xl sm:text-4xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-pink-600 to-red-500 dark:from-amber-200 dark:via-pink-300 dark:to-red-300"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
      >
        Fancy a Coffee or a Gift?
      </motion.h2>
      <motion.p
        className="text-gray-600 dark:text-gray-200 max-w-2xl text-center mb-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        If you enjoyed my work or found my projects helpful, you can support me with a virtual coffee, a small gift, or simply by sending some love! Every gesture, big or small, inspires me to keep building and sharing. Thank you for your kindness!
      </motion.p>
      <div 
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8"
        role="region"
        aria-label="Support options"
      >
        {donationOptions.map((option, idx) => (
          <motion.div
            key={option.title}
            className={`rounded-2xl shadow-xl border-t-4 border-transparent px-6 py-8 flex flex-col items-center bg-gradient-to-br ${option.color} backdrop-blur transition-all`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1, type: "spring" }}
            whileHover={{ scale: 1.04, y: -5 }}
            aria-labelledby={`donation-heading-${idx}`}
          >
            <div className="mb-2" aria-hidden="true">{option.icon}</div>
            <h3 
              id={`donation-heading-${idx}`}
              className="text-lg font-semibold mb-2 text-center"
            >
              {option.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-200 text-center text-sm mb-6">{option.description}</p>
            <a
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-amber-400 via-pink-400 to-red-400 hover:from-amber-500 hover:via-pink-500 hover:to-red-500 text-white font-semibold px-6 py-2 rounded-full shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
              aria-label={`${option.btnLabel} - ${option.description}`}
            >
              {option.btnLabel}
            </a>
          </motion.div>
        ))}
      </div>
      <motion.p
        className="mt-12 text-sm text-gray-500 dark:text-gray-300 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Your support keeps me energized and motivated. Thank you so much!
      </motion.p>
    </section>
  );
}