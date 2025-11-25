import { checkPageAccess } from "@/actions/secure/checkPageAccess";
import RestrictedPageLogin from "@/components/RestrictedPageLogin";
import { FiUsers } from "react-icons/fi";

export default async function FriendsCornerContent() {
    const hasAccess = await checkPageAccess("friends-corner");

    if (!hasAccess) {
        return (
            <RestrictedPageLogin
                siteCode="friends-corner"
                title="Friends Corner"
                description="Enter the password to access this special corner"
                icon={<FiUsers className="text-2xl text-white" />}
            />
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <header className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
                        <FiUsers className="text-3xl text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Friends Corner
                    </h1>
                    <p className="text-xl text-gray-300">
                        A special place dedicated to the bonds that shape our lives
                    </p>
                </header>

                {/* Content Section */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            The Power of Friendship
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Friendship is one of life&apos;s greatest treasures. It&apos;s the invisible thread that connects hearts, 
                            the laughter that lightens our darkest days, and the support that helps us reach our highest peaks. 
                            This corner is a celebration of those beautiful souls who have walked alongside me on this incredible journey.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Memories That Matter
                        </h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Every friend brings their own unique color to the canvas of our lives. From late-night conversations 
                            that solve the world&apos;s problems, to spontaneous adventures that become legendary stories, to quiet 
                            moments of understanding that need no words.
                        </p>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                            <p className="text-blue-200 italic">
                                &quot;True friendship isn&apos;t about being inseparable. It&apos;s about being separated and nothing changes.&quot;
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Shared Experiences
                        </h2>
                        <div className="space-y-4 text-gray-300">
                            <div className="flex items-start gap-3">
                                <span className="text-blue-400 text-xl">•</span>
                                <p>Coding marathons fueled by pizza and caffeine</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-blue-400 text-xl">•</span>
                                <p>Road trips with no destination, just good company</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-blue-400 text-xl">•</span>
                                <p>Celebrations of victories, both big and small</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-blue-400 text-xl">•</span>
                                <p>Support through challenges that seemed insurmountable</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            A Note of Gratitude
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            To all my friends - thank you. Thank you for the memories, the growth, the support, and the joy. 
                            Thank you for being yourselves and allowing me to be myself. This corner exists because you exist in my life, 
                            making it infinitely richer and more meaningful.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
