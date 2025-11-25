import { Metadata } from "next";
import PersonalLifeContent from "./PersonalLifeContent";

export const metadata: Metadata = {
    title: 'Personal Life',
    description: 'An intimate glimpse into my personal journey, daily life, thoughts, and the experiences that shape who I am.',
    keywords: ['personal life', 'journey', 'experiences', 'lifestyle', 'personal'],
    openGraph: {
        title: 'Personal Life - Shawkat Hossain Maruf',
        description: 'An intimate glimpse into my personal journey, daily life, thoughts, and the experiences that shape who I am.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Personal Life - Shawkat Hossain Maruf',
        description: 'An intimate glimpse into my personal journey, daily life, thoughts, and the experiences that shape who I am.',
    },
};

export default function PersonalLifePage() {
    return <PersonalLifeContent />;
}
