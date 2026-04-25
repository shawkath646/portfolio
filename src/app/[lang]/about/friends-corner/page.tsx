import { Metadata } from "next";
import { FiUsers } from "react-icons/fi";
import { getAuthSession } from "@/actions/authentication/authActions";
import { getGenericAuthSession } from "@/actions/genericAuth/authActions";
import RestrictedPageLogin from "@/components/RestrictedPageLogin";
import appBaseUrl from "@/data/appBaseUrl";

export const metadata: Metadata = {
    title: 'Friends Corner',
    description: 'Memories, gratitude, and lessons from the friendships that helped shape my life and character.',
    keywords: ['friends corner', 'friendship', 'memories', 'gratitude', 'relationships'],
    alternates: {
        canonical: new URL('/about/friends-corner', appBaseUrl),
    },
    openGraph: {
        title: 'Friends Corner - Shawkat Hossain Maruf',
        description: 'Memories, gratitude, and lessons from the friendships that helped shape my life and character.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Friends Corner - Shawkat Hossain Maruf',
        description: 'Memories, gratitude, and lessons from the friendships that helped shape my life and character.',
    },
};

export default async function FriendsCornerPage() {

    const [adminSession, genericSession] = await Promise.all([
        getAuthSession(),
        getGenericAuthSession("friends_corner")
    ])

    if (!adminSession && !genericSession) {
        return (
            <RestrictedPageLogin
                accessScope="friends_corner"
                title="Friends Corner"
                description="Enter the password to view my friendship stories"
                icon={<FiUsers className="text-2xl text-white" />}
            />
        );
    }

    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            aria-label="Friends corner page content"
            className="min-h-screen bg-linear-to-br from-sky-900 via-blue-900 to-cyan-900 py-20 px-4"
        >
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <header className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-sky-500 to-cyan-500 rounded-full mb-6">
                        <FiUsers className="text-3xl text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Friends Corner
                    </h1>
                    <p className="text-xl text-gray-300">
                        Loyalty, laughter, and the people who stood by me
                    </p>
                </header>

                {/* Content Section */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            The Circle That Built Me
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Behind every milestone in my life, there are friends who offered perspective, challenged me with
                            honesty, and celebrated wins as if they were their own. This space is my quiet tribute to those
                            bonds that made difficult seasons lighter and good seasons unforgettable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            What Friendship Looks Like Here
                        </h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Real friendship is not loud all the time. Sometimes it is a short check-in message, a shared meal,
                            a late call after a rough day, or someone reminding you of your strength when you forget it.
                        </p>
                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-6">
                            <h3 className="font-semibold text-white mb-3">Moments I Cherish Most</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li>Unfiltered conversations with no need to pretend</li>
                                <li>Friends who show up without being asked</li>
                                <li>Laughing over stories we have told a hundred times</li>
                                <li>Hard feedback given with care and respect</li>
                                <li>The comfort of being understood in silence</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Lessons I Learned Through Friends
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Friendship taught me that growth is not a solo project. The right people reflect your blind spots,
                            protect your dignity when you are vulnerable, and remind you that progress matters more than
                            perfection.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Values I Try To Bring Into Every Friendship
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-lg p-5">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    Reliability
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Being available in both calm days and crisis moments.
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-5">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    Respect
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Protecting differences in opinion, pace, and personality.
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-5">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    Honesty
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Saying what matters with empathy instead of silence.
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-5">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    Gratitude
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Never treating meaningful people as ordinary.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Friendship Philosophy
                        </h2>
                        <div className="bg-linear-to-r from-sky-500/20 to-cyan-500/20 border border-sky-500/30 rounded-lg p-6">
                            <p className="text-gray-200 text-lg leading-relaxed italic">
                                &quot;A good friend does not walk ahead or behind. They walk beside you, long enough for you to
                                become the strongest version of yourself.&quot;
                            </p>
                        </div>
                    </section>

                    <section className="pt-4">
                        <p className="text-center text-gray-400 text-sm">
                            Every memory here is a thank you to the people who made life richer than I could have planned.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
