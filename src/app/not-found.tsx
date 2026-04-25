export const dynamic = 'force-static';

export default function NotFound() {
    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            className="min-h-screen flex flex-col items-center justify-center p-4 bg-linear-to-br from-blue-50 via-blue-100 to-indigo-100 dark:from-[#0a192f] dark:via-[#1e293b] dark:to-[#172554]"
            aria-label="Notfound page content"
        >
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                {/* Digital noise pattern */}
                <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAABXRb3MAAAAA1BMVEX///+nxBvIAAAAC0lEQVR4AWP4DwAAgACA7C7POgAAAABJRU5ErkJggg==')] opacity-[0.02]"></div>

                {/* Floating geometric shapes */}
                <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-blue-500/20 dark:border-blue-400/10 rounded-full animate-float opacity-50" />
                <div className="absolute bottom-1/4 right-1/3 w-20 h-20 border-2 border-blue-600/20 dark:border-blue-500/10 rotate-45 animate-float-reverse opacity-40" style={{ animationDelay: '1.5s' }} />
                <div className="absolute top-1/3 right-1/4 w-12 h-12 border-2 border-indigo-500/20 dark:border-indigo-400/10 rounded-md rotate-12 animate-float opacity-40" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-1/3 left-1/3 w-24 h-24 border border-blue-400/20 dark:border-blue-300/10 rounded-full animate-float-reverse opacity-30" style={{ animationDelay: '3s' }} />
            </div>

            <section
                className="relative z-10 max-w-3xl w-full"
                aria-labelledby="error-title"
            >
                {/* Error content container */}
                <div className="py-8 px-6 text-center relative">
                    {/* 404 with glitch effect */}
                    <div className="relative text-center mb-8">
                        <h1
                            id="error-title"
                            className="font-mono text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 inline-block"
                            aria-label="404 error"
                        >
                            404
                        </h1>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                        Page Not Found
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                        The page you are looking for doesn&apos;t exist or has been moved.
                    </p>
                </div>
            </section>
        </main>
    );
}
