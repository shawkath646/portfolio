import type { Metadata } from "next";

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
    alternates: {
        canonical: null,
    },
    other: {
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
    },
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
