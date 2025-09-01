import type { Metadata } from 'next';
import BuyMeACoffee from "./BuyMeACoffee";
import Connections from "./Connections";
import ContactForm from "./ContactForm";

// Enhanced metadata specifically for the contact page
export const metadata: Metadata = {
  title: "Contact Me",
  description: "Get in touch with Shawkat Hossain Maruf for web development projects, collaborations, or just to say hello. Multiple contact options including professional connections, messaging platforms, and social media.",
  keywords: [
    "contact Shawkat Hossain", 
    "hire web developer", 
    "freelance developer contact",
    "full-stack developer contact", 
    "project collaboration", 
    "developer for hire",
    "contact form",
    "professional networking"
  ],
  alternates: {
    canonical: "https://shawkath646.pro/contact"
  },
  openGraph: {
    title: "Contact Shawkat Hossain Maruf",
    description: "Connect with me through various platforms or send a direct message. I'm always open to new opportunities and collaborations!",
    url: "https://shawkath646.pro/contact",
    siteName: "Shawkat Hossain Maruf Portfolio",
    locale: "en_US",
    type: "website",
  }
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