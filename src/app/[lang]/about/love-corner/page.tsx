import { Metadata } from "next";
import { unauthorized } from "next/navigation";
import { FiHeart } from "react-icons/fi";
import getAdminData from "@/actions/admin/getAdminData";
import { getAuthSession } from "@/actions/authentication/authSession";
import { getGenericAuthSession } from "@/actions/genericAuth/authSession";
import RestrictedPageLogin from "@/components/RestrictedPageLogin";
import appBaseUrl from "@/data/appBaseUrl";
import { locales, resolveLocale, getLanguagePack, defaultLocale } from "@/lib/locale";
import CharacterTimeline from "./CharacterTimeline";
import LoveCornerHeader from "./LoveCornerHeader";
import SideCharacters from "./SideCharacters";
import RandomThought from "./RandomThought";
import HealingHeart from "./HealingHeart";
import { getAllPersons } from "@/actions/person/getPersonData";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const lang = await params.then((p) => p.lang);
    const resolvedLocale = resolveLocale(lang);
    const dict = await getLanguagePack(resolvedLocale, "about-love-corner-page");

    const languages: Record<string, string> = {};
    for (const l of locales) {
        languages[l] = new URL(`/${l}/about/love-corner`, appBaseUrl).toString();
    }
    languages["x-default"] = new URL(`/${defaultLocale}/about/love-corner`, appBaseUrl).toString();

    return {
        title: dict.metadata?.title,
        description: dict.metadata?.description,
        keywords: dict.metadata?.keywords,
        alternates: {
            canonical: new URL(`/${resolvedLocale}/about/love-corner`, appBaseUrl),
            languages,
        },
        openGraph: {
            title: dict.metadata?.openGraph?.title,
            description: dict.metadata?.openGraph?.description,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: dict.metadata?.twitter?.title,
            description: dict.metadata?.twitter?.description,
        },
    };
}

export default async function LoveCornerPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const lang = await params.then((p) => p.lang);
    const resolvedLocale = resolveLocale(lang);
    const [headerDict, timelineDict, sideCharDict, pageDict] = await Promise.all([
        getLanguagePack(resolvedLocale, "about-love-corner-header-component"),
        getLanguagePack(resolvedLocale, "about-character-timeline-component"),
        getLanguagePack(resolvedLocale, "about-side-characters-component"),
        getLanguagePack(resolvedLocale, "about-love-corner-page"),
    ]);

    const [adminSession, genericSession] = await Promise.all([
        getAuthSession(),
        getGenericAuthSession()
    ]);

    if (!adminSession) {
        if (!genericSession) {
            return (
                <RestrictedPageLogin
                    accessScope="/about/love-corner"
                    title="Love Corner"
                    description="Enter the password to view my love life"
                    icon={<FiHeart className="text-2xl text-white" />}
                />
            );
        }

        if (!genericSession.allowedRoutes.includes("/about/love-corner")) {
            unauthorized();
        }
    }

    const [adminData, loveCornerPersons] = await Promise.all([
        getAdminData(),
        getAllPersons("love corner"),
    ]);

    const relationships = loveCornerPersons
        .filter((person) => person.addToTimeline)
        .map((person) => ({
            id: person.id,
            name: person.name,
            start: person.startOn ? person.startOn.toISOString().split("T")[0] : "",
            end: person.endOn ? person.endOn.toISOString().split("T")[0] : null,
            secondary: !person.priority,
        }));

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
                <LoveCornerHeader languagePack={headerDict} />
                <CharacterTimeline
                    dateOfBirth={adminData.dateOfBirth}
                    relationships={relationships}
                    languagePack={timelineDict}
                />
                <SideCharacters languagePack={sideCharDict} />
                <RandomThought title={pageDict.randomThoughtsTitle} thoughts={pageDict.randomThoughts || []} />
                <HealingHeart title={pageDict.healingHeartTitle} text={pageDict.healingHeartText} />
            </div>
        </main>
    );
}
