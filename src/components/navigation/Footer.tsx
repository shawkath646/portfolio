"use client";
import { usePathname } from "next/navigation";
import { footerDisallowedPaths } from "@/data/pathsConfig";
import Link from "next/link";
import Image from "next/image";

// Quick navigation links
const quickLinks = [
  { name: "Admin Panel", href: "/admin" },
  { name: "Sitemap", href: "/sitemap.xml" },
  { name: "Privacy Policy", href: "#" },
  { name: "Terms of Service", href: "#" },
];

export default function Footer() {
  const currentPath = usePathname();
  
  // Check if footer should be shown
  const shouldShowFooter = !footerDisallowedPaths.some((path) => currentPath.startsWith(path));
  
  if (!shouldShowFooter) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="w-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 dark:from-gray-950 dark:via-blue-950/50 dark:to-gray-950 text-white border-t border-blue-500/20"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Links Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-blue-300 mb-4 text-center sm:text-left">
            Quick Links
          </h3>
          <nav 
            aria-label="Footer navigation"
            className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-3"
          >
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 my-6"></div>

        {/* Notice Section */}
        <div className="mb-6 text-center">
          <p className="text-xs sm:text-sm text-yellow-200/90 font-medium leading-relaxed max-w-4xl mx-auto">
            ⚠️ Do not copy any images or content without proper permission from the author. Doing so will be considered a cyber crime!
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 my-6"></div>

        {/* Bottom Section */}
        <div className="space-y-3 text-center text-xs sm:text-sm text-gray-400">
          <p className="flex flex-wrap items-center justify-center gap-1">
            <span>Website built by</span>
            <a 
              href="https://github.com/shawkath646" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
            >
              shawkath646
            </a>
            <span>&</span>
            <a 
              href="https://cloudburstlab.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center hover:opacity-80 transition-opacity duration-200"
            >
              <Image
                src="https://cloudburstlab.vercel.app/api/branding/logo?variant=transparent"
                alt="CloudBurst Lab"
                width={120}
                height={30}
                className="h-5 w-auto"
              />
            </a>
          </p>
          
          <p className="text-gray-500">
            Copyright © CloudBurst Lab 2025 ~ {currentYear}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}