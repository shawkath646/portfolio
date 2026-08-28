import Link from "next/link";

export default function LocalizedNotFound() {
    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            className="min-h-[70vh] flex flex-col items-center justify-center p-4"
            aria-label="Not found page content"
        >
            <section
                className="relative z-10 max-w-2xl w-full text-center py-12 px-6"
                aria-labelledby="error-title"
            >
                <h1
                    id="error-title"
                    className="font-mono text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 inline-block mb-4"
                >
                    404
                </h1>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    Page Not Found
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                    The page you are looking for doesn&apos;t exist or has been moved.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                    Back to Home
                </Link>
            </section>
        </main>
    );
}
