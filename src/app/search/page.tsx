import { ProductCard } from '@/components/modules/products'
import * as categoryService from '@/services/categories'
import * as productService from '@/services/products'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { Search, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { SearchFilters } from './search-filters'

const ITEMS_PER_PAGE = 12

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{
        q: string
        category?: string
        sort?: string
        page?: string
    }>
}) {
    const params = await searchParams
    const query = params.q || ''
    const categoryId = params.category ? parseInt(params.category) : undefined
    const sortBy = (params.sort || 'newest') as 'newest' | 'price-asc' | 'price-desc' | 'name'
    const currentPage = parseInt(params.page || '1')
    const offset = (currentPage - 1) * ITEMS_PER_PAGE

    // Fetch categories for filter using service
    const categories = await categoryService.getCategories(true)

    // Search products using service
    const { products, count } = await productService.searchProductsWithCount({
        query: query || undefined,
        categoryId,
        sortBy,
        offset,
        limit: ITEMS_PER_PAGE
    })

    const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0

    return (
        <div className="min-h-screen bg-neutral-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                            <Search className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900">Search Results</h1>
                            {query && (
                                <p className="text-neutral-600 mt-1">
                                    Results for &quot;{query}&quot; · {count || 0} products found
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                    <div className="flex items-center gap-2 mb-4">
                        <SlidersHorizontal className="h-5 w-5 text-neutral-600" />
                        <h2 className="font-semibold text-neutral-900">Filters</h2>
                    </div>

                    <SearchFilters
                        query={query}
                        categoryId={categoryId}
                        sortBy={sortBy}
                        categories={categories || []}
                    />
                </div>

                {/* Results Grid */}
                {products && products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                {currentPage > 1 && (
                                    <a
                                        href={`/search?q=${query}${categoryId ? `&category=${categoryId}` : ''}&sort=${sortBy}&page=${currentPage - 1}`}
                                        className="px-4 py-2 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
                                    >
                                        Previous
                                    </a>
                                )}

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                        // Show first, last, current, and adjacent pages
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <a
                                                    key={page}
                                                    href={`/search?q=${query}${categoryId ? `&category=${categoryId}` : ''}&sort=${sortBy}&page=${page}`}
                                                    className={`px-4 py-2 rounded-lg transition-colors ${page === currentPage
                                                        ? 'bg-rose-600 text-white'
                                                        : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                                                        }`}
                                                >
                                                    {page}
                                                </a>
                                            )
                                        } else if (
                                            page === currentPage - 2 ||
                                            page === currentPage + 2
                                        ) {
                                            return <span key={page} className="px-2 text-neutral-400">...</span>
                                        }
                                        return null
                                    })}
                                </div>

                                {currentPage < totalPages && (
                                    <a
                                        href={`/search?q=${query}${categoryId ? `&category=${categoryId}` : ''}&sort=${sortBy}&page=${currentPage + 1}`}
                                        className="px-4 py-2 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
                                    >
                                        Next
                                    </a>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <EmptyState
                        variant="search"
                        title={query ? `No results for "${query}"` : "No products found"}
                        description="Check your spelling or browse our categories to find what you're looking for."
                        primaryAction={{
                            label: "Browse All Products",
                            href: "/"
                        }}
                        secondaryAction={categories && categories.length > 0 ? {
                            label: `Browse ${categories[0].name_en}`,
                            href: `/category/${categories[0].id}`
                        } : undefined}
                    />
                )}
            </main>
        </div>
    )
}
