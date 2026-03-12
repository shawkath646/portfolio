import Link from "next/link";

type PaginationProps = {
    prevPage?: string;
    nextPage?: string;
    prevPageLabel?: string;
    nextPageLabel?: string;
    className?: string;
};

export default function SimplePagination({
    prevPage,
    nextPage,
    prevPageLabel,
    nextPageLabel,
    className = "",
}: PaginationProps) {
    return (
        <nav
            aria-label="Page navigation"
            className={`container mx-auto flex items-center justify-between gap-4 py-5 border-t border-gray-200/40 dark:border-gray-700/40 ${className}`}
        >
            {/* Previous */}
            {prevPage ? (
                <Link
                    href={prevPage}
                    rel="prev"
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300/60 dark:border-gray-600/60 text-gray-800 dark:text-gray-200 hover:border-blue-500/70 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                >
                    <span className="text-lg transition-transform group-hover:-translate-x-0.5">
                        ←
                    </span>

                    <span className="flex flex-col leading-tight">
                        <span className="text-xs opacity-70">Previous</span>
                        {prevPageLabel && (
                            <span className="hidden sm:block text-sm font-medium">
                                {prevPageLabel}
                            </span>
                        )}
                    </span>
                </Link>
            ) : (
                <span />
            )}

            {/* Next */}
            {nextPage ? (
                <Link
                    href={nextPage}
                    rel="next"
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300/60 dark:border-gray-600/60 text-gray-800 dark:text-gray-200 hover:border-blue-500/70 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                >
                    <span className="flex flex-col text-right leading-tight">
                        <span className="text-xs opacity-70">Next</span>
                        {nextPageLabel && (
                            <span className="hidden sm:block text-sm font-medium">
                                {nextPageLabel}
                            </span>
                        )}
                    </span>

                    <span className="text-lg transition-transform group-hover:translate-x-0.5">
                        →
                    </span>
                </Link>
            ) : (
                <span />
            )}
        </nav>
    );
}