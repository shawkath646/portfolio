import { checkPageAccess } from "@/actions/secure/checkPageAccess";
import RestrictedPageLogin from "@/components/RestrictedPageLogin";
import { FiBook } from "react-icons/fi";

export default async function PersonalLifeContent() {
    const hasAccess = await checkPageAccess("personal-life");

    if (!hasAccess) {
        return (
            <RestrictedPageLogin
                siteCode="personal-life"
                title="Personal Life"
                description="Enter the password to view this personal space"
                icon={<FiBook className="text-2xl text-white" />}
            />
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <header className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6">
                        <FiBook className="text-3xl text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Personal Life
                    </h1>
                    <p className="text-xl text-gray-300">
                        An intimate glimpse into my journey
                    </p>
                </header>

                {/* Content Section */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            The Person Behind the Code
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Beyond the projects, the code, and the professional achievements lies a life filled with its own 
                            unique story. This space is an invitation to see the human behind the developer - the dreams, 
                            the struggles, the little victories, and the everyday moments that shape who I am.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Daily Rhythms
                        </h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Life is a beautiful tapestry woven from daily rituals and spontaneous moments. From morning coffee 
                            that kickstarts the day, to evening walks that clear the mind, to midnight coding sessions when 
                            inspiration strikes unexpectedly.
                        </p>
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6">
                            <h3 className="font-semibold text-white mb-3">Things I Cherish</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li>☕ A perfect cup of coffee and contemplation</li>
                                <li>🌅 Quiet mornings with unlimited possibilities</li>
                                <li>📚 Getting lost in a good book or article</li>
                                <li>🎵 Music that speaks to the soul</li>
                                <li>🌙 Stargazing and philosophical conversations</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Reflections & Growth
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Personal growth is a never-ending journey. Each day brings new lessons, new perspectives, 
                            and new opportunities to become a better version of myself. It&apos;s about embracing challenges, 
                            learning from mistakes, and celebrating small wins along the way.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Values That Guide Me
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-lg p-5">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    🎯 Authenticity
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Being true to myself and others, no matter the circumstance
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-5">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    💡 Curiosity
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Never stop learning, questioning, and exploring
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-5">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    🤝 Empathy
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Understanding and connecting with others deeply
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-5">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    ⚡ Resilience
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Rising stronger after every setback
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Life Philosophy
                        </h2>
                        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-lg p-6">
                            <p className="text-gray-200 text-lg leading-relaxed italic">
                                &quot;Life is not measured by the number of breaths we take, but by the moments that take our breath away. 
                                It&apos;s about finding beauty in ordinary days, strength in difficult times, and joy in simple pleasures.&quot;
                            </p>
                        </div>
                    </section>

                    <section className="pt-4">
                        <p className="text-center text-gray-400 text-sm">
                            This is just a glimpse into my personal world. The real magic happens in the moments between these words.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
