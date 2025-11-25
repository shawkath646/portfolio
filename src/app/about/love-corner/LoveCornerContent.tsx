import { checkPageAccess } from "@/actions/secure/checkPageAccess";
import RestrictedPageLogin from "@/components/RestrictedPageLogin";
import { FiHeart } from "react-icons/fi";

export default async function LoveCornerContent() {
    const hasAccess = await checkPageAccess("love-corner");

    if (!hasAccess) {
        return (
            <RestrictedPageLogin
                siteCode="love-corner"
                title="Love Corner"
                description="Enter the password to access this heartfelt space"
                icon={<FiHeart className="text-2xl text-white" />}
            />
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <header className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mb-6 animate-pulse">
                        <FiHeart className="text-3xl text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Love Corner
                    </h1>
                    <p className="text-xl text-gray-300">
                        Where the heart speaks its truth
                    </p>
                </header>

                {/* Content Section */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            The Language of the Heart
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Love is the most profound emotion we can experience. It transcends words, defies logic, 
                            and paints the world in colors we never knew existed. This corner is a sanctuary for those 
                            feelings that make life worth living - the butterflies, the warmth, the sense of home in another person.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Moments Frozen in Time
                        </h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Every love story is unique, written in shared glances, tender touches, and words that linger in the air. 
                            It&apos;s in the small gestures - a cup of coffee made just right, a text that says &quot;thinking of you,&quot; 
                            or silence that speaks volumes.
                        </p>
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-6">
                            <p className="text-rose-200 italic text-center">
                                &quot;Love is not about how many days, months, or years you&apos;ve been together. 
                                It&apos;s about how much you love each other every day.&quot;
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            What Love Means
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                            <div className="bg-white/5 rounded-lg p-4">
                                <h3 className="font-semibold text-white mb-2">Support</h3>
                                <p className="text-sm">Being each other&apos;s biggest cheerleader</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4">
                                <h3 className="font-semibold text-white mb-2">Growth</h3>
                                <p className="text-sm">Becoming better versions of ourselves together</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4">
                                <h3 className="font-semibold text-white mb-2">Trust</h3>
                                <p className="text-sm">Building a foundation of unwavering faith</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4">
                                <h3 className="font-semibold text-white mb-2">Joy</h3>
                                <p className="text-sm">Finding happiness in the simplest moments</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Dreams We Share
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Love is also about the future we build together - the dreams we nurture, the goals we chase, 
                            and the life we imagine. It&apos;s about knowing that whatever comes, we face it hand in hand, 
                            heart to heart.
                        </p>
                    </section>

                    <section className="text-center pt-4">
                        <div className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-full">
                            <p className="font-semibold">Forever grateful for this journey 💕</p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
