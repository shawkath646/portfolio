import { Metadata } from "next";
import LoveCornerContent from "./LoveCornerContent";

export const metadata: Metadata = {
    title: 'Love Corner',
    description: 'A heartfelt space celebrating love, romance, and the beautiful moments that define meaningful relationships.',
    keywords: ['love', 'romance', 'relationship', 'heart', 'personal'],
    openGraph: {
        title: 'Love Corner - Shawkat Hossain Maruf',
        description: 'A heartfelt space celebrating love, romance, and the beautiful moments that define meaningful relationships.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Love Corner - Shawkat Hossain Maruf',
        description: 'A heartfelt space celebrating love, romance, and the beautiful moments that define meaningful relationships.',
    },
};

export default function LoveCornerPage() {
    return <LoveCornerContent />;
}
