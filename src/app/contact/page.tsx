import type { Metadata } from 'next';
import BuyMeACoffee from "./BuyMeACoffee";
import Connections from "./Connections";
import ContactForm from "./ContactForm";

// Enhanced metadata specifically for the contact page
export const metadata: Metadata = {
  title: "Contact Shawkat Hossain Maruf - Get in Touch for Projects & Collaborations",
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
    canonical: "https://shawkath646.pro/contact"
  },
  openGraph: {
    title: "Contact Shawkat Hossain Maruf - Get in Touch for Projects & Collaborations",
    description: "Connect with me through various platforms or send a direct message. I'm always open to new opportunities, collaborations, and professional networking!",
    url: "https://shawkath646.pro/contact",
    siteName: "Shawkat Hossain Maruf Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://shawkath646.pro/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Shawkat Hossain Maruf",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@shawkath646",
    creator: "@shawkath646",
    title: "Contact Shawkat Hossain Maruf - Get in Touch",
    description: "Connect with me for web development projects, collaborations, or networking. Multiple contact options available.",
    images: ["https://shawkath646.pro/profile.jpg"],
  },
};

export default async function ContactPage() {
    return (
        <main 
            className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-100 dark:from-[#0a192f] dark:via-[#1e293b] dark:to-[#0f172a] pt-22 pb-10 px-3"
            id="contact-page"
            aria-label="Contact page with various ways to connect and get in touch"
        >
            <div className="container mx-auto">
                <Connections />
                <BuyMeACoffee />
                <ContactForm />
            </div>
        </main>
    );
};