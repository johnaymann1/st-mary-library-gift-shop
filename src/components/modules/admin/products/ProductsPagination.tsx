interface ProductsPaginationProps {
    currentPage: number
    totalPages: number
    startIndex: number
    endIndex: number
    filteredCount: number
    onPageChange: (page: number) => void
}

export function ProductsPagination({
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    filteredCount,
    onPageChange
}: ProductsPaginationProps) {
    if (totalPages <= 1) return null

    return (
        <div className="bg-white dark:bg-neutral-900 shadow-sm rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Results info */}
                <div className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredCount)} of {filteredCount}
                </div>

                {/* Pagination buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-lg text-sm font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>

                    {/* Page numbers */}
                    <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => {
                                // Show first, last, current, and adjacent pages
                                return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                            })
                            .map((page, idx, arr) => (
                                <div key={page} className="flex items-center gap-1">
                                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                                        <span className="px-2 text-neutral-400 dark:text-neutral-500">...</span>
                                    )}
                                    <button
                                        onClick={() => onPageChange(page)}
                                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                            ? 'bg-rose-600 text-white shadow-md'
                                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                </div>
                            ))}
                    </div>

                    {/* Mobile page indicator */}
                    <div className="sm:hidden px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Page {currentPage} of {totalPages}
                    </div>

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-lg text-sm font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}
