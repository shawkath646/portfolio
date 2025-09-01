"use client";
import { usePathname } from "next/navigation";
import { memo, useMemo } from "react";
import { footerDisallowedPaths } from "@/data/pathsConfig";
import { FaGithub, FaLinkedin, FaTelegramPlane, FaEnvelope, FaYoutube, FaFacebook, FaInstagram } from "react-icons/fa";
import { FaUpwork } from "react-icons/fa6";
import { SiFiverr } from "react-icons/si";

// Social media configuration with proper SEO data
const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/shawkath646",
    icon: FaGithub,
    color: "text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white",
    ariaLabel: "Visit Shawkat's GitHub profile"
  },
  {
    name: "LinkedIn", 
    href: "https://linkedin.com/in/shawkath645",
    icon: FaLinkedin,
    color: "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200",
    ariaLabel: "Connect on LinkedIn"
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@shawkath646", 
    icon: FaYoutube,
    color: "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200",
    ariaLabel: "Subscribe to YouTube channel"
  },
  {
    name: "Telegram",
    href: "https://t.me/shawkath646",
    icon: FaTelegramPlane,
    color: "text-blue-400 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200",
    ariaLabel: "Contact via Telegram"
  },
  {
    name: "Email",
    href: "mailto:shawkath646@gmail.com",
    icon: FaEnvelope,
    color: "text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200",
    ariaLabel: "Send an email"
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/shawkath646",
    icon: FaFacebook, 
    color: "text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200",
    ariaLabel: "Follow on Facebook"
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/shawkath646",
    icon: FaInstagram,
    color: "text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-200", 
    ariaLabel: "Follow on Instagram"
  },
  {
    name: "Fiverr",
    href: "https://www.fiverr.com/shawkath646",
    icon: SiFiverr,
    color: "text-green-500 hover:text-green-700 dark:text-green-300 dark:hover:text-green-200",
    ariaLabel: "Hire on Fiverr"
  },
  {
    name: "Upwork", 
    href: "https://www.upwork.com/freelancers/~shawkath646",
    icon: FaUpwork,
    color: "text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200",
    ariaLabel: "Hire on Upwork"
  },
];

// Memoized Social Link Component
const SocialLink = memo<{
  link: typeof socialLinks[0];
}>(({ link }) => {
  const Icon = link.icon;
  
  return (
    <a
      href={link.href}
      target={link.href.startsWith('mailto') ? undefined : "_blank"}
      rel={link.href.startsWith('mailto') ? undefined : "noopener noreferrer"}
      className={`${link.color} transition-colors duration-200 hover:scale-110 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 rounded-full p-1`}
      aria-label={link.ariaLabel}
      title={link.name}
    >
      <Icon className="text-2xl" />
    </a>
  );
});

SocialLink.displayName = 'SocialLink';

export default function Footer() {
  const currentPath = usePathname();
  
  // Memoize path check for performance
  const shouldShowFooter = useMemo(
    () => !footerDisallowedPaths.some((path) => currentPath.startsWith(path)),
    [currentPath]
  );
  
  if (!shouldShowFooter) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="w-full pt-16 bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 dark:from-[#17223b] dark:via-[#172a39] dark:to-[#1a1e2d] shadow-inner transition-colors duration-300"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-8">
          {/* Brand Information */}
          <div className="flex flex-col items-center md:items-start">
            <div className="text-center md:text-left">
              <h2 className="text-xl font-extrabold text-blue-900 dark:text-cyan-200 tracking-widest mb-2">
                Shawkat Hossain Maruf
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 max-w-xs">
                Full-stack Developer & Tech Enthusiast
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                © {currentYear} All rights reserved.
              </p>
            </div>
          </div>
          
          {/* Social Media Links */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Connect With Me
            </h3>
            <nav 
              aria-label="Social media links"
              className="flex flex-wrap justify-center gap-4"
            >
              {socialLinks.map((link) => (
                <SocialLink key={link.name} link={link} />
              ))}
            </nav>
          </div>
        </div>
        
        {/* Additional Links */}
        <div className="mt-8 pt-6 border-t border-gray-200/30 dark:border-gray-700/30">
          <nav 
            aria-label="Footer navigation"
            className="flex flex-wrap justify-center gap-6 text-sm"
          >
            <a 
              href="/privacy" 
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-cyan-300 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms" 
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-cyan-300 transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a 
              href="/sitemap.xml" 
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-cyan-300 transition-colors duration-200"
            >
              Sitemap
            </a>
          </nav>
        </div>
      </div>
      
      {/* Bottom Attribution */}
      <div className="text-center text-xs text-gray-400 dark:text-gray-600 pb-4 pt-2 border-t border-gray-200/20 dark:border-gray-700/20 bg-gray-50/50 dark:bg-gray-900/20">
        <p>
          Built with ❤️ using{' '}
          <a 
            href="https://nextjs.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors duration-200"
          >
            Next.js
          </a>
          {' & '}
          <a 
            href="https://tailwindcss.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-cyan-500 transition-colors duration-200"
          >
            Tailwind CSS
          </a>
        </p>
      </div>
    </footer>
  );
}