'use client'

import { getCategoriesAction } from './actions'
import CreateCategoryForm from './create-form'
import DeleteCategoryButton from './delete-button'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState, useCallback } from 'react'

import { Category } from '@/types'

interface CategoriesClientPageProps {
    initialCategories: Category[]
}

export default function CategoriesClientPage({ initialCategories }: CategoriesClientPageProps) {
    const [allCategories, setAllCategories] = useState<Category[]>(initialCategories)
    const [filteredCategories, setFilteredCategories] = useState<Category[]>(initialCategories)
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const fetchData = useCallback(async () => {
        setLoading(true)
        const categories = await getCategoriesAction()
        setAllCategories(categories)
        setLoading(false)
    }, [])

    // Apply search filter
    useEffect(() => {
        let result = [...allCategories]

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(c =>
                c.name_en.toLowerCase().includes(query) ||
                c.name_ar.toLowerCase().includes(query)
            )
        }

        setFilteredCategories(result)
        setCurrentPage(1) // Reset to first page on filter change
    }, [allCategories, searchQuery])

    // Calculate pagination
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex)

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="text-neutral-600">Loading...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-white tracking-tight mb-2">Categories Management</h1>
                <p className="text-neutral-700 dark:text-neutral-300 font-medium text-lg">Organize your products into categories</p>
            </div>

            <CreateCategoryForm onSuccess={fetchData} />

            {/* Search Bar */}
            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                    <Input
                        type="search"
                        placeholder="Search categories by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                {searchQuery && (
                    <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                        <span>Showing {filteredCategories.length} of {allCategories.length} results</span>
                        <Badge variant="secondary">Search: {searchQuery}</Badge>
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                    <thead className="bg-neutral-50 dark:bg-neutral-800">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">Name (EN)</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">Name (AR)</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800">
                        {paginatedCategories.map((category) => (
                            <tr key={category.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {category.image_url ? (
                                        <img src={category.image_url} alt={category.name_en} className="h-12 w-12 rounded-full object-cover shadow-sm" />
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 text-xs font-medium">No Img</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900 dark:text-white">{category.name_en}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300">{category.name_ar}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant={category.is_active ? 'success' : 'destructive'}>
                                        {category.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <a
                                            href={`/admin/categories/${category.id}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </a>
                                        <DeleteCategoryButton id={category.id} onDelete={fetchData} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredCategories.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                                    {searchQuery
                                        ? 'No categories match your search.'
                                        : 'No categories found. Create your first category above.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {paginatedCategories.map((category) => (
                    <div key={category.id} className="bg-white dark:bg-neutral-900 shadow-sm rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                        <div className="p-4 space-y-4">
                            {/* Image and Title */}
                            <div className="flex gap-4">
                                {category.image_url ? (
                                    <img src={category.image_url} alt={category.name_en} className="h-20 w-20 rounded-full object-cover shadow-sm flex-shrink-0" />
                                ) : (
                                    <div className="h-20 w-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 text-xs font-medium flex-shrink-0">No Image</div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-neutral-900 dark:text-white">{category.name_en}</h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">{category.name_ar}</p>
                                    <div className="mt-2">
                                        <Badge variant={category.is_active ? 'success' : 'destructive'}>
                                            {category.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                <a
                                    href={`/admin/categories/${category.id}`}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </a>
                                <DeleteCategoryButton id={category.id} onDelete={fetchData} />
                            </div>
                        </div>
                    </div>
                ))}
                {filteredCategories.length === 0 && (
                    <div className="bg-white dark:bg-neutral-900 shadow-sm rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 text-center">
                        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                            {searchQuery
                                ? 'No categories match your search.'
                                : 'No categories found. Create your first category above.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="bg-white dark:bg-neutral-900 shadow-sm rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 transition-colors">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Results info */}
                        <div className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                            Showing {startIndex + 1}-{Math.min(endIndex, filteredCategories.length)} of {filteredCategories.length}
                        </div>

                        {/* Pagination buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
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
                                                onClick={() => goToPage(page)}
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
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 rounded-lg text-sm font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
