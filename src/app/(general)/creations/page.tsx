import type { Metadata } from 'next';
import Link from 'next/link';
import SimplePagination from '@/components/navigation/SimplePagination';
import appBaseUrl from '@/data/appBaseUrl';

export const metadata: Metadata = {
    title: "Creations",
    description: "Explore my projects, journals, research work, and experiments. A collection of ideas and explorations in software development and technology.",
    keywords: [
        "Projects",
        "Portfolio",
        "Creations",
        "Research",
        "Experiments",
        "Software Projects",
        "Developer Work",
        "Technical Projects",
        "Portfolio Projects",
    ],
    alternates: {
        canonical: new URL("/creations", appBaseUrl),
    },
    pagination: {
        previous: new URL("/about", appBaseUrl),
    }
};

interface CreationCategory {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'coming-soon';
    href?: string;
    icon: string;
}

const categories: CreationCategory[] = [
    {
        id: 'projects',
        title: 'Projects',
        description: 'Showcasing web applications, full-stack projects, and technical implementations.',
        status: 'active',
        href: '/creations/projects',
        icon: '🚀',
    },
    {
        id: 'journals',
        title: 'Journals',
        description: 'Personal insights, technical reflections, and learning experiences.',
        status: 'coming-soon',
        icon: '📔',
    },
    {
        id: 'research',
        title: 'Research Papers',
        description: 'Academic research, technical deep-dives, and investigative studies.',
        status: 'coming-soon',
        icon: '📚',
    },
    {
        id: 'experiments',
        title: 'Experiments',
        description: 'Prototypes, proof-of-concepts, and experimental implementations.',
        status: 'coming-soon',
        icon: '⚗️',
    },
];

function CreationCard({ category }: { category: CreationCategory }) {
    const isActive = category.status === 'active';
    const cardClassName = `group relative rounded-2xl border transition-all duration-300 ${isActive
        ? 'cursor-pointer border-slate-200/50 dark:border-white/10 hover:border-blue-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-cyan-500/10'
        : 'cursor-not-allowed border-slate-200/30 dark:border-white/5'
        }`;

    const cardContent = (
        <>
            {/* Background Gradient */}
            <div
                className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${isActive
                    ? 'bg-linear-to-br from-blue-50/50 to-cyan-50/30 dark:from-blue-900/10 dark:to-cyan-900/5 group-hover:from-blue-50/80 group-hover:to-cyan-50/50 dark:group-hover:from-blue-900/20 dark:group-hover:to-cyan-900/10'
                    : 'bg-linear-to-br from-slate-50/30 to-slate-50/10 dark:from-slate-800/10 dark:to-slate-900/5'
                    }`}
                aria-hidden="true"
            />

            {/* Content */}
            <div className="relative z-10 p-6 md:p-8 flex flex-col h-full space-y-4">
                {/* Icon and Title Section */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                        <div className="text-3xl md:text-4xl">{category.icon}</div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {category.title}
                        </h3>
                    </div>

                    {/* Status Badge */}
                    <div
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-300 ${isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 group-hover:bg-green-200 dark:group-hover:bg-green-900/50'
                            : 'bg-slate-200/50 text-slate-600 dark:bg-slate-700/30 dark:text-slate-400'
                            }`}
                        aria-label={`Status: ${category.status === 'active' ? 'Active' : 'Coming Soon'}`}
                    >
                        {category.status === 'active' ? (
                            <>
                                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-green-500"></span>
                                Active
                            </>
                        ) : (
                            'Coming Soon'
                        )}
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed grow">
                    {category.description}
                </p>

                {/* Footer with CTA or Placeholder */}
                <div className="pt-4 border-t border-slate-200/30 dark:border-white/5 flex items-center justify-between">
                    <span
                        className={`text-sm font-medium transition-colors duration-300 ${isActive
                            ? 'text-blue-600 dark:text-cyan-400 group-hover:text-blue-700 dark:group-hover:text-cyan-300'
                            : 'text-slate-500 dark:text-slate-400'
                            }`}
                    >
                        {isActive ? 'Explore' : 'Coming soon'}
                    </span>

                    {isActive && (
                        <span
                            className="text-lg transition-transform duration-300 group-hover:translate-x-1"
                            aria-hidden="true"
                        >
                            →
                        </span>
                    )}
                </div>
            </div>
        </>
    );

    if (isActive) {
        return (
            <Link href={category.href!} className={cardClassName}>
                {cardContent}
            </Link>
        );
    }

    return (
        <div className={cardClassName}>
            {cardContent}
        </div>
    );
}

export default function CreationsPage() {
    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            aria-label="Creations page content"
            className="min-h-screen relative bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 overflow-hidden"
            aria-labelledby="creations-page-title"
        >
            {/* Background Decorative Elements */}
            <div
                className="absolute top-0 left-0 w-1/3 h-1/3 bg-linear-to-br from-blue-200/20 to-cyan-300/20 dark:from-blue-900/10 dark:to-cyan-800/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0"
                aria-hidden="true"
            />
            <div
                className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-linear-to-tl from-indigo-200/20 to-blue-300/20 dark:from-indigo-900/10 dark:to-blue-800/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 z-0"
                aria-hidden="true"
            />

            {/* Content */}
            <div className="relative z-10">
                {/* Hero Section */}
                <header
                    className="pt-20 md:pt-24 pb-10 px-4 sm:px-6 lg:px-8"
                    aria-labelledby="hero-heading"
                >
                    <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6">
                        <h1
                            id="creations-page-title"
                            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white"
                        >
                            Creations
                        </h1>
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            A collection of projects, ideas, and explorations I&apos;ve worked on. From web applications to research
                            investigations, discover what I&apos;ve been building.
                        </p>
                    </div>
                </header>

                {/* Categories Grid */}
                <section
                    className="py-5 px-4 sm:px-6 lg:px-8"
                    aria-labelledby="categories-heading"
                >
                    <div className="max-w-5xl mx-auto">
                        <h2 id="categories-heading" className="sr-only">
                            Creation Categories
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
                            {categories.map((category) => (
                                <CreationCard key={category.id} category={category} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pagination */}
                <div className="px-4 sm:px-6 lg:px-8 pb-16">
                    <SimplePagination
                        prevPage="/about"
                        prevPageLabel="About"
                        nextPage="/"
                        nextPageLabel="Home"
                    />
                </div>
            </div>
        </main>
    );
}
