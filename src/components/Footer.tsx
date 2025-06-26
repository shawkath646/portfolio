import { FaGithub, FaLinkedin, FaTelegramPlane, FaEnvelope } from "react-icons/fa";
import { FaUpwork } from "react-icons/fa6";
import { SiFiverr } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="w-full pt-16 bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 dark:from-[#17223b] dark:via-[#172a39] dark:to-[#1a1e2d] border-t dark:border-gray-800 shadow-inner">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row md:justify-between items-center gap-6">
        {/* Brand / Name */}
        <div className="flex flex-col items-center md:items-start">
          <span className="text-xl font-extrabold text-blue-900 dark:text-cyan-200 tracking-widest">
            Shawkath646
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>
        {/* Navigation Links */}
        <nav className="flex flex-wrap gap-x-8 gap-y-2 items-center text-gray-700 dark:text-gray-300 text-sm font-medium">
          <a href="/" className="hover:text-blue-500 transition">Home</a>
          <a href="/about" className="hover:text-blue-500 transition">About</a>
          <a href="/projects" className="hover:text-blue-500 transition">Projects</a>
          <a href="/blog" className="hover:text-blue-500 transition">Blog</a>
          <a href="/contact" className="hover:text-blue-500 transition">Contact</a>
        </nav>
        {/* Social Icons and Platforms */}
        <div className="flex gap-4 items-center">
          <a
            href="https://github.com/shawkath646"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
            aria-label="GitHub"
          >
            <FaGithub className="text-2xl" />
          </a>
          <a
            href="https://www.linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="text-2xl" />
          </a>
          <a
            href="https://t.me/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200 transition"
            aria-label="Telegram"
          >
            <FaTelegramPlane className="text-2xl" />
          </a>
          <a
            href="mailto:your@email.com"
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 transition"
            aria-label="Email"
          >
            <FaEnvelope className="text-2xl" />
          </a>
          <a
            href="https://www.fiverr.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-700 dark:text-green-300 dark:hover:text-green-200 transition"
            aria-label="Fiverr"
          >
            <SiFiverr className="text-2xl" />
          </a>
          <a
            href="https://www.upwork.com/freelancers/~yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 transition"
            aria-label="Upwork"
          >
            <FaUpwork className="text-2xl" />
          </a>
        </div>
      </div>
      {/* Subtle bottom line */}
      <div className="text-center text-xs text-gray-400 dark:text-gray-600 pb-3 pt-2">
        Built with ❤️ by Shawkath646
      </div>
    </footer>
  );
}