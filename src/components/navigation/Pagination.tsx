import Link from "next/link";

type PaginationProps = {
    prevPage?: string;
    nextPage?: string;
    prevPageLabel?: string;
    nextPageLabel?: string;
};

export default function Pagination({
    prevPage,
    nextPage,
    prevPageLabel,
    nextPageLabel,
}: PaginationProps) {
    return (
        <nav className="mt-12 container mx-auto flex justify-between items-center text-sm sm:text-base">
            {prevPage ? (
                <Link
                    href={prevPage}
                    className="inline-flex items-center px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    {prevPageLabel ? "Prev: " + prevPageLabel : "Previous"}
                </Link>
            ) : <span />}

            {nextPage ? (
                <Link
                    href={nextPage}
                    className="inline-flex items-center px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    {nextPageLabel ? "Next: " + nextPageLabel : "Next"}
                </Link>
            ) : <span />}
        </nav>
    );
}
