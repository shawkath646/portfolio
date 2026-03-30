import { Metadata } from "next";
import { FiHeart } from "react-icons/fi";
import { getGenericAuthSession } from "@/actions/genericAuth/authActions";
import RestrictedPageLogin from "@/components/RestrictedPageLogin";
import appBaseUrl from "@/data/appBaseUrl";

export const metadata: Metadata = {
    title: 'Love Corner',
    description: 'A private space for reflections on love, commitment, and the gentle work of choosing care every day.',
    keywords: ['love corner', 'love', 'commitment', 'relationships', 'emotional growth'],
    alternates: {
        canonical: new URL("/about/love-corner", appBaseUrl),
    },
    openGraph: {
        title: 'Love Corner - Shawkat Hossain Maruf',
        description: 'A private space for reflections on love, commitment, and the gentle work of choosing care every day.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Love Corner - Shawkat Hossain Maruf',
        description: 'A private space for reflections on love, commitment, and the gentle work of choosing care every day.',
    },
};

export default async function LoveCornerPage() {

    const genericSession = await getGenericAuthSession("love_corner");
    if (!genericSession) {
        return (
            <RestrictedPageLogin
                accessScope="love_corner"
                title="Love Corner"
                description="Enter the password to view private reflections on love"
                icon={<FiHeart className="text-2xl text-white" />}
            />
        );
    }

    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            aria-label="Love corner page content"
            className="min-h-screen bg-linear-to-br from-rose-900 via-red-900 to-orange-900 py-20 px-4"
        >
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <header className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-rose-500 to-red-500 rounded-full mb-6">
                        <FiHeart className="text-3xl text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Love Corner
                    </h1>
                    <p className="text-xl text-gray-300">
                        Care, courage, and the quiet language of the heart
                    </p>
                </header>

                {/* Content Section */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            What Love Means To Me
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Love is not only emotion. It is consistency. It is choosing patience over ego, listening before
                            reacting, and protecting the dignity of the person you care about even in disagreement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            How I Practice Love
                        </h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Meaningful relationships are built in ordinary moments. The details matter: the way we speak,
                            the promises we keep, and the effort we bring even on difficult days.
                        </p>
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-6">
                            <h3 className="font-semibold text-white mb-3">Everyday Acts That Matter</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li>Listening carefully instead of waiting to reply</li>
                                <li>Giving reassurance when words are hard to find</li>
                                <li>Respecting space without withdrawing affection</li>
                                <li>Choosing honesty even when it feels uncomfortable</li>
                                <li>Showing up with steadiness, not just intensity</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Love And Growth
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Love reveals who we are under pressure. It teaches accountability, emotional maturity, and the
                            strength to repair rather than run. The goal is not perfection, but a deeper and kinder way of
                            being with each other.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Promises I Try To Keep
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-lg p-5">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    Presence
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Being fully there, especially during difficult moments.
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-5">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    Patience
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Giving time for feelings to be expressed and understood.
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-5">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    Trust
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Protecting confidence and never weaponizing vulnerability.
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-5">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    Growth
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Continuing to become better for love, not just in love.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Love Philosophy
                        </h2>
                        <div className="bg-linear-to-r from-rose-500/20 to-red-500/20 border border-rose-500/30 rounded-lg p-6">
                            <p className="text-gray-200 text-lg leading-relaxed italic">
                                &quot;Love is not proven by grand gestures alone. It is proven by daily kindness, repaired mistakes,
                                and the decision to choose each other again and again.&quot;
                            </p>
                        </div>
                    </section>

                    <section className="pt-4">
                        <p className="text-center text-gray-400 text-sm">
                            This page holds reflections that remind me love is both feeling and responsibility.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
