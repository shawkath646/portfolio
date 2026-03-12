"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    basePath: string;
};

export default function NumberPagination({
    currentPage,
    totalPages,
    basePath,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const safeCurrentPage = Math.min(
        Math.max(currentPage, 1),
        Math.max(totalPages, 1)
    );

    const createPageUrl = (page: number) => {
        if (page <= 1) {
            return basePath;
        }

        return `${basePath}?page=${page}`;
    };

    const getPages = () => {
        const pages: (number | "...")[] = [];
        const delta = 2;

        const start = Math.max(2, safeCurrentPage - delta);
        const end = Math.min(totalPages - 1, safeCurrentPage + delta);

        pages.push(1);

        if (start > 2) pages.push("...");

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages - 1) pages.push("...");

        if (totalPages > 1) pages.push(totalPages);

        return pages;
    };

    const pages = getPages();

    return (
        <nav
            className="mt-8 flex w-full flex-wrap items-center justify-center gap-2 sm:gap-2.5"
            aria-label="Pagination Navigation"
        >
            {/* Previous */}
            {safeCurrentPage > 1 && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        href={createPageUrl(safeCurrentPage - 1)}
                        rel="prev"
                        aria-label="Previous Page"
                        className="inline-flex min-w-9 items-center justify-center rounded-md border border-gray-300/80 dark:border-gray-600/80 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-sm transition-colors hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        Previous
                    </Link>
                </motion.div>
            )}

            {/* Page numbers */}
            {pages.map((page, index) =>
                page === "..." ? (
                    <span
                        key={`ellipsis-${index}`}
                        className="px-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                    >
                        ...
                    </span>
                ) : (
                    <motion.div
                        key={page}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            href={createPageUrl(page)}
                            aria-label={`Go to page ${page}`}
                            aria-current={page === safeCurrentPage ? "page" : undefined}
                            className={`inline-flex min-w-9 items-center justify-center rounded-md border px-3 py-2 text-xs sm:text-sm font-medium backdrop-blur-sm transition-colors ${page === safeCurrentPage
                                    ? "border-blue-600 dark:border-blue-400 bg-blue-600 dark:bg-blue-500 text-white"
                                    : "border-gray-300/80 dark:border-gray-600/80 bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                                }`}
                        >
                            {page}
                        </Link>
                    </motion.div>
                )
            )}

            {/* Next */}
            {safeCurrentPage < totalPages && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        href={createPageUrl(safeCurrentPage + 1)}
                        rel="next"
                        aria-label="Next Page"
                        className="inline-flex min-w-9 items-center justify-center rounded-md border border-gray-300/80 dark:border-gray-600/80 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-sm transition-colors hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        Next
                    </Link>
                </motion.div>
            )}
        </nav>
    );
}