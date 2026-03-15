import { FaCloud } from "react-icons/fa";

export default function Loading() {
    return (
        <main className="fixed inset-0 z-100 flex flex-col items-center justify-between bg-slate-50 dark:bg-[#050B14] overflow-hidden selection:bg-cyan-500/30">

            {/* Ambient Backgrounds (Matches LandingComponent perfectly for a seamless transition) */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-125 h-125 rounded-full bg-blue-400 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 rounded-full bg-cyan-300 blur-[150px]" />
            </div>

            {/* Top Spacer for balance */}
            <div className="h-24 w-full" />

            {/* Center Content: Identity & Loader */}
            <section className="relative z-10 flex flex-col items-center text-center px-6">

                {/* Sleek animated badge */}
                <div className="mb-6 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 backdrop-blur-md shadow-sm">
                    <span className="text-sm font-bold tracking-wide text-blue-700 dark:text-cyan-400">
                        @shawkath646
                    </span>
                </div>

                {/* Name */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white">
                    Shawkath Hossain Maruf
                </h1>

                {/* Website URL */}
                <h2 className="text-lg font-medium tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                    shawkath646.pro
                </h2>
            </section>

            {/* Bottom Content: CloudBurst Lab Branding */}
            <section className="relative z-10 pb-12 flex flex-col items-center gap-2">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 dark:text-slate-500">
                    Engineered By
                </p>
                <div className="flex items-center gap-2.5 opacity-80 hover:opacity-100 transition-opacity">
                    {/* Placeholder for your actual logo. Used FaCloud as a stylish stand-in */}
                    <div className="p-1.5 bg-linear-to-br from-blue-500 to-cyan-400 rounded-lg shadow-lg shadow-cyan-500/20">
                        <FaCloud className="text-white text-sm" />
                    </div>
                    <span className="font-bold text-sm tracking-wide text-slate-700 dark:text-slate-300">
                        CloudBurst <span className="text-blue-600 dark:text-cyan-400">Lab</span>
                    </span>
                </div>
            </section>

        </main>
    );
}