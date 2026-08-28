import type { Metadata } from "next";
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata: Metadata = {
    title: {
        default: "Admin Panel",
        template: "%s | Admin Panel",
    },
    description: "Admin panel for managing portfolio content and settings.",
    robots: {
        index: false,
        follow: false,
        nocache: true,
        noarchive: true,
        nosnippet: true,
        noimageindex: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
            "max-snippet": 0,
            "max-image-preview": "none",
            "max-video-preview": 0,
        },
    },
    other: {
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
    },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <LayoutWrapper lang='en'>
            {children}
        </LayoutWrapper>
    );
}
