import Image from "next/image";
import Link from "next/link";
import appBaseUrl from "@/data/appBaseUrl";
import { getSingleSearchParam } from "@/utils/string";
import { FaGlobe, FaAndroid, FaDesktop, FaCloud } from "react-icons/fa";

export default async function EmbeddedCardPage({ searchParams }: PageProps<"/embedded-card">) {
    const params = await searchParams;
    const sizeParam = getSingleSearchParam(params.size) || "medium";
    const themeParam = getSingleSearchParam(params.theme);

    const isSmall = sizeParam === "small";
    const isLarge = sizeParam === "large";

    const themeClass = themeParam === "dark" ? "dark" : themeParam === "light" ? "light" : "";

    return (
        <div className={themeClass}>
            <main className="flex min-h-screen w-full items-center justify-center p-3">
                <div
                    className={`
            relative w-full overflow-hidden rounded-2xl border border-gray-200/60 
            bg-white/80 shadow-xl backdrop-blur-xl transition-all duration-300 
            hover:shadow-2xl dark:border-white/10 dark:bg-gray-900/80 dark:shadow-none
            ${isSmall ? "max-w-xs" : isLarge ? "max-w-lg" : "max-w-md"}
          `}
                >
                    {/* Subtle glow effects */}
                    <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-600/25 pointer-events-none" />
                    <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-600/25 pointer-events-none" />

                    {/* Content Wrapper */}
                    <div
                        className={`relative z-10 flex ${isSmall
                            ? "flex-row items-center space-x-3.5 p-4"
                            : "flex-col items-center p-6 text-center"
                            }`}
                    >
                        {/* Avatar with Animated Gradient Border */}
                        <div
                            className={`
                                relative shrink-0 rounded-full p-0.5 bg-linear-to-tr from-blue-500 to-indigo-500 
                                transition-transform duration-500
                                ${isSmall ? "h-14 w-14" : "mb-5 h-24 w-24"}
                            `}
                        >
                            <div className="relative h-full w-full overflow-hidden rounded-full border-[3px] border-white dark:border-gray-900 bg-white dark:bg-gray-900">
                                <Image
                                    src="/avatar.png"
                                    alt="Shawkat Hossain Maruf"
                                    fill
                                    className="object-cover"
                                    sizes={isSmall ? "56px" : "96px"}
                                    priority
                                />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className={`${isSmall ? "flex-1 min-w-0 text-left" : "w-full"}`}>
                            <h1
                                className={`font-bold tracking-tight text-gray-900 dark:text-white truncate ${isSmall ? "text-base" : "text-lg"
                                    }`}
                            >
                                Shawkat Hossain Maruf
                            </h1>

                            <Link
                                href={appBaseUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-sm font-medium text-transparent hover:opacity-80 dark:from-blue-400 dark:to-indigo-400"
                            >
                                @shawkath646
                            </Link>

                            {/* Extended info for Medium & Large */}
                            {!isSmall && (
                                <div className="mt-2 flex items-center justify-center space-x-2">
                                    <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                                        Full-Stack Software Engineer & Founder of
                                    </p>
                                    <Link href="https://clouburstlab.com">
                                        <Image
                                            alt="clouburstlab logo"
                                            src="https://assets.clouburstlab.com/branding/icon_light.png"
                                            height={16}
                                            width={120}
                                            className="h-4 w-30 block dark:hidden"
                                        />
                                        <Image
                                            alt="clouburstlab logo"
                                            src="https://assets.clouburstlab.com/branding/icon_dark.png"
                                            height={16}
                                            width={120}
                                            className="h-4 w-30 hidden dark:block"
                                        />
                                    </Link>
                                </div>
                            )}

                            {/* Extra details for Large only */}
                            {isLarge && (
                                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                                    {[
                                        { name: "Web", icon: FaGlobe },
                                        { name: "Android", icon: FaAndroid },
                                        { name: "Desktop", icon: FaDesktop },
                                        { name: "Cloud", icon: FaCloud },
                                    ].map((tag) => (
                                        <span
                                            key={tag.name}
                                            className="flex items-center gap-1 rounded-full bg-gray-100/90 px-2.5 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800/90 dark:text-gray-300"
                                        >
                                            <tag.icon className="text-[10px]" />
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* CTA for Medium & Large */}
                        {!isSmall && (
                            <div className="mt-5 w-full">
                                <Link
                                    href={appBaseUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full rounded-xl bg-gray-900 py-2.5 px-4 text-center text-xs font-semibold text-white shadow-md transition-all hover:bg-gray-800 hover:shadow-lg dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                                >
                                    View Portfolio
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
