import { Metadata } from "next";
import { FiBook } from "react-icons/fi";
import { getGenericAuthSession } from "@/actions/genericAuth/authActions";
import RestrictedPageLogin from "@/components/RestrictedPageLogin";
import appBaseUrl from "@/data/appBaseUrl";

export const metadata: Metadata = {
    title: 'Personal Life',
    description: 'A private window into my routines, mindset, and the everyday choices that shape my life beyond code.',
    keywords: ['personal life', 'daily routine', 'self growth', 'mindset', 'life reflections'],
    alternates: {
        canonical: new URL("/about/personal-life", appBaseUrl),
    },
    openGraph: {
        title: 'Personal Life - Shawkat Hossain Maruf',
        description: 'A private window into my routines, mindset, and the everyday choices that shape my life beyond code.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Personal Life - Shawkat Hossain Maruf',
        description: 'A private window into my routines, mindset, and the everyday choices that shape my life beyond code.',
    },
};

export default async function PersonalLifePage() {

    const genericSession = await getGenericAuthSession("personal_life");
    if (!genericSession) {
        return (
            <RestrictedPageLogin
                accessScope="personal_life"
                title="Personal Life"
                description="Enter the password to view my private reflections"
                icon={<FiBook className="text-2xl text-white" />}
            />
        );
    }

    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            aria-label="Personal life page content"
            className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 py-20 px-4"
        >
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <header className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full mb-6">
                        <FiBook className="text-3xl text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Personal Life
                    </h1>
                    <p className="text-xl text-gray-300">
                        The daily rhythm behind who I am
                    </p>
                </header>

                {/* Content Section */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Beyond The Screen
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Outside projects and deadlines, life is made of habits, relationships, and perspective. This page
                            shares the quieter side of my journey: how I reset, what keeps me grounded, and the mindset I try
                            to carry through both progress and setbacks.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Everyday Rhythm
                        </h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Most real progress comes from consistent days, not dramatic moments. The little choices I make in
                            morning, work blocks, rest, and reflection create the foundation for everything bigger.
                        </p>
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6">
                            <h3 className="font-semibold text-white mb-3">Small Anchors I Value</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li>Quiet mornings before the world gets noisy</li>
                                <li>Focused work sessions with minimal distractions</li>
                                <li>Short walks that reset mental clarity</li>
                                <li>Reading that expands how I think</li>
                                <li>Honest conversations that keep me grounded</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Reflection And Growth
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Growth, for me, means staying teachable. Some lessons come from success, but the strongest ones
                            come from mistakes I take responsibility for. I try to improve through consistency, not pressure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Principles I Try To Live By
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-lg p-5">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    Authenticity
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Staying honest with myself even when truth is uncomfortable.
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-5">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    Curiosity
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Continuing to learn, question, and adapt over time.
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-5">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    Empathy
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Listening with intention before making assumptions.
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-5">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    Resilience
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Recovering from setbacks without losing direction.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Personal Philosophy
                        </h2>
                        <div className="bg-linear-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-lg p-6">
                            <p className="text-gray-200 text-lg leading-relaxed italic">
                                &quot;A meaningful life is built quietly: one disciplined day, one repaired mistake, and one kind
                                decision at a time.&quot;
                            </p>
                        </div>
                    </section>

                    <section className="pt-4">
                        <p className="text-center text-gray-400 text-sm">
                            This corner is a reminder that who we become is shaped by what we do repeatedly.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
