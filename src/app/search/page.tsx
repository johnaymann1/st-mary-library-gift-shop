import ProductCard from '@/components/ProductCard'
import { createClient } from '@/utils/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Search, SlidersHorizontal } from 'lucide-react'

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
    const supabase = await createClient()
    const params = await searchParams
    const query = params.q || ''
    const categoryId = params.category
    const sortBy = params.sort || 'newest'
    const currentPage = parseInt(params.page || '1')
    const offset = (currentPage - 1) * ITEMS_PER_PAGE

    // Fetch categories for filter
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name_en, name_ar')
        .eq('is_active', true)
        .order('name_en')

    // Build query
    let productsQuery = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('is_active', true)

    // Apply search filter
    if (query) {
        productsQuery = productsQuery.or(`name_en.ilike.%${query}%,name_ar.ilike.%${query}%,desc_en.ilike.%${query}%,desc_ar.ilike.%${query}%`)
    }

    // Apply category filter
    if (categoryId) {
        productsQuery = productsQuery.eq('category_id', parseInt(categoryId))
    }

    // Apply sorting
    switch (sortBy) {
        case 'price-asc':
            productsQuery = productsQuery.order('price', { ascending: true })
            break
        case 'price-desc':
            productsQuery = productsQuery.order('price', { ascending: false })
            break
        case 'name':
            productsQuery = productsQuery.order('name_en', { ascending: true })
            break
        case 'newest':
        default:
            productsQuery = productsQuery.order('created_at', { ascending: false })
    }

    // Apply pagination
    productsQuery = productsQuery.range(offset, offset + ITEMS_PER_PAGE - 1)

    const { data: products, count } = await productsQuery

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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Category
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <a 
                                    href={`/search?q=${query}&sort=${sortBy}&page=1`}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                        !categoryId 
                                            ? 'bg-rose-600 text-white' 
                                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                    }`}
                                >
                                    All
                                </a>
                                {categories?.map((cat) => (
                                    <a
                                        key={cat.id}
                                        href={`/search?q=${query}&category=${cat.id}&sort=${sortBy}&page=1`}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                            categoryId === cat.id.toString()
                                                ? 'bg-rose-600 text-white'
                                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                        }`}
                                    >
                                        {cat.name_en}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Sort Filter */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    window.location.href = `/search?q=${query}${categoryId ? `&category=${categoryId}` : ''}&sort=${e.target.value}&page=1`
                                }}
                                className="w-full px-4 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-900 text-base focus:outline-none focus:ring-2 focus:ring-rose-500\"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name">Name: A to Z</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                {products && products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                                        page === currentPage
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
                    <div className="text-center py-16 bg-white rounded-2xl">
                        <div className="mb-4">
                            <div className="mx-auto h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center">
                                <Search className="h-8 w-8 text-neutral-400" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                            No products found
                        </h3>
                        <p className="text-neutral-600 mb-4">
                            {query 
                                ? `We couldn't find any products matching "${query}"`
                                : 'Try searching for something'}
                        </p>
                        
                        {/* Category Suggestions */}
                        {categories && categories.length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm text-neutral-600 mb-3">Try browsing these categories:</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {categories.slice(0, 4).map((cat) => (
                                        <a
                                            key={cat.id}
                                            href={`/category/${cat.id}`}
                                            className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors text-sm font-medium"
                                        >
                                            {cat.name_en}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <a href="/" className="inline-flex items-center justify-center px-6 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors">
                            Browse All Products
                        </a>
                    </div>
                )}
            </main>
        </div>
    )
}
