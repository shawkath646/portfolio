import type { Metadata } from 'next';
import ShareFilesSection from '@/components/HomePage/ShareFilesSection';
import appBaseUrl from '@/data/appBaseUrl';
import BuyMeACoffee from "./BuyMeACoffee";
import Connections from "./Connections";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact and Get in Touch",
  description: "Get in touch with Shawkat Hossain Maruf for web development projects, software engineering opportunities, collaborations, or networking. Available through LinkedIn, email, GitHub, and various messaging platforms.",
  keywords: [
    "Contact Shawkat Hossain",
    "Hire Web Developer",
    "Software Engineer Contact",
    "Freelance Developer Contact",
    "Full Stack Developer Contact",
    "Project Collaboration",
    "Developer for Hire",
    "Contact Form",
    "Professional Networking",
    "Web Development Services",
    "Software Development Inquiry",
  ],
  alternates: {
    canonical: new URL('/contact', appBaseUrl)
  }
};

export default async function ContactPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      role="main"
      className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-purple-100 dark:from-[#0a192f] dark:via-[#1e293b] dark:to-[#0f172a] pt-22 pb-10 px-3"
      aria-label="Contact page with various ways to connect and get in touch"
    >
      <div className="container mx-auto space-y-22">
        <Connections />
        <ShareFilesSection />
        <BuyMeACoffee />
        <ContactForm />
      </div>
    </main>
  );
};