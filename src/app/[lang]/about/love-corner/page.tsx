import { Metadata } from "next";
import { FiHeart } from "react-icons/fi";
import getAdminData from "@/actions/admin/getAdminData";
import { getAuthSession } from "@/actions/authentication/authActions";
import { getGenericAuthSession } from "@/actions/genericAuth/authActions";
import RestrictedPageLogin from "@/components/RestrictedPageLogin";
import appBaseUrl from "@/data/appBaseUrl";
import CharacterTimeline from "./CharacterTimeline";
import LoveCornerHeader from "./LoveCornerHeader";
import SideCharacters from "./SideCharacters";

const relationships = [
    {
        id: 1,
        name: "Nadia Islam Mim",
        start: "2015-01-1",
        end: "2015-12-31",
    },
    {
        id: 2,
        name: "Prapti Saha",
        start: "2017-03-1",
        end: "2020-02-28",
    },
    {
        id: 3,
        name: "Sanjida Jahan Mridula",
        start: "2020-04-01",
        end: "2025-12-31",
    }
];

export const metadata: Metadata = {
    title: 'Love Corner | Love and Its Impact on My Life',
    description: 'Discover how love shaped the life of Shawkat Hossain Maruf (shawkath646), including relationship milestones, emotional growth, resilience, and personal transformation over time.',
    keywords: [
        'love corner',
        'shawkath646 love life',
        'love and life impact',
        'relationship timeline',
        'emotional growth journey',
        'personal transformation',
        'shawkat hossain maruf',
        'love lessons',
        'commitment and growth'
    ],
    alternates: {
        canonical: new URL("/about/love-corner", appBaseUrl),
    },
    openGraph: {
        title: 'Love Corner - Love and Its Impact on Shawkat Hossain Maruf',
        description: 'A personal look at how love influenced shawkath646\'s life through relationships, emotional growth, and meaningful life lessons.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Love Corner - Love and Its Impact on My Life',
        description: 'How love shaped shawkath646\'s life: relationship journey, growth, resilience, and lessons that changed me.',
    },
};

export default async function LoveCornerPage() {

    const [adminSession, genericSession] = await Promise.all([
        getAuthSession(),
        getGenericAuthSession("love_corner")
    ]);

    if (!adminSession && !genericSession) {
        return (
            <RestrictedPageLogin
                accessScope="love_corner"
                title="Love Corner"
                description="Enter the password to view my love life"
                icon={<FiHeart className="text-2xl text-white" />}
            />
        );
    };

    const adminData = await getAdminData();

    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            aria-label="Love corner page content"
            className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 py-20"
        >
            <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
                <div className="absolute -top-16 -left-10 h-72 w-72 rounded-full bg-rose-300/25 blur-3xl dark:bg-rose-700/15 animate-pulse-fade" style={{ animationDuration: "9s" }}></div>
                <div className="absolute top-1/3 -right-16 h-80 w-80 rounded-full bg-pink-300/20 blur-3xl dark:bg-pink-700/15 animate-pulse-fade" style={{ animationDelay: "1.8s", animationDuration: "11s" }}></div>
                <div className="absolute bottom-8 left-1/4 h-64 w-64 rounded-full bg-red-200/20 blur-3xl dark:bg-red-800/10 animate-float" style={{ animationDelay: "1.2s", animationDuration: "16s" }}></div>

                <div className="absolute top-[16%] left-[14%] text-rose-400/50 dark:text-rose-300/35 animate-float" style={{ animationDuration: "13s" }}>
                    <FiHeart className="h-8 w-8" />
                </div>
                <div className="absolute top-[42%] right-[12%] text-pink-400/45 dark:text-pink-300/30 animate-float-reverse" style={{ animationDelay: "0.6s", animationDuration: "17s" }}>
                    <FiHeart className="h-10 w-10" />
                </div>
                <div className="absolute bottom-[14%] left-[65%] text-rose-500/40 dark:text-rose-200/30 animate-float" style={{ animationDelay: "2.1s", animationDuration: "15s" }}>
                    <FiHeart className="h-6 w-6" />
                </div>

                <div className="absolute top-1/4 right-1/3 h-28 w-28 rounded-full border border-rose-300/40 dark:border-rose-500/25 animate-spin-slow" style={{ animationDuration: "28s" }}></div>
                <div className="absolute bottom-1/3 left-1/3 h-20 w-20 rounded-full border border-pink-300/35 dark:border-pink-500/20 animate-float-reverse" style={{ animationDelay: "1.2s", animationDuration: "14s" }}></div>
            </div>

            <div className="container relative z-10 mx-auto space-y-10">
                <LoveCornerHeader />
                <CharacterTimeline
                    dateOfBirth={adminData.dateOfBirth}
                    relationships={relationships}
                />
                <SideCharacters />
            </div>
        </main>
    );
}
