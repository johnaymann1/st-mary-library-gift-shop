'use client'

import { ProductCard } from '@/components/modules/products'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Product, Category } from '@/types'

interface CategoryPageClientProps {
    category: Category
    initialProducts: Product[]
}

export default function CategoryPageClient({ category, initialProducts }: CategoryPageClientProps) {
    const [allProducts] = useState<Product[]>(initialProducts)
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
    const [filtersOpen, setFiltersOpen] = useState(false)

    // Filter states
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [priceRange, setPriceRange] = useState('all')
    const [stockFilter, setStockFilter] = useState('all')

    // Apply filters whenever filter states change
    useEffect(() => {
        let result = [...allProducts]

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(p =>
                p.name_en.toLowerCase().includes(query) ||
                p.name_ar.toLowerCase().includes(query) ||
                (p.desc_en && p.desc_en.toLowerCase().includes(query))
            )
        }

        // Stock filter
        if (stockFilter === 'instock') {
            result = result.filter(p => p.in_stock)
        } else if (stockFilter === 'outofstock') {
            result = result.filter(p => !p.in_stock)
        }

        // Price range filter
        if (priceRange === 'under-100') {
            result = result.filter(p => p.price < 100)
        } else if (priceRange === '100-500') {
            result = result.filter(p => p.price >= 100 && p.price <= 500)
        } else if (priceRange === '500-1000') {
            result = result.filter(p => p.price >= 500 && p.price <= 1000)
        } else if (priceRange === 'over-1000') {
            result = result.filter(p => p.price > 1000)
        }

        // Sorting
        if (sortBy === 'price-low') {
            result.sort((a, b) => a.price - b.price)
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => b.price - a.price)
        } else if (sortBy === 'name') {
            result.sort((a, b) => a.name_en.localeCompare(b.name_en))
        } else {
            result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        }

        setFilteredProducts(result)
    }, [allProducts, searchQuery, sortBy, priceRange, stockFilter])

    const clearFilters = () => {
        setSearchQuery('')
        setSortBy('newest')
        setPriceRange('all')
        setStockFilter('all')
    }

    const hasActiveFilters = searchQuery || sortBy !== 'newest' || priceRange !== 'all' || stockFilter !== 'all'

    return (
        <div className="min-h-screen bg-neutral-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        { label: category.name_en }
                    ]}
                />

                {/* Category Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-neutral-900 mb-2">{category.name_en}</h1>
                    {category.name_ar && <p className="text-lg text-neutral-700">{category.name_ar}</p>}
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4 mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                            type="search"
                            placeholder="Search products in this category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Collapsible Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 mb-8 overflow-hidden">
                    <button
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-neutral-900">Filters</span>
                            {hasActiveFilters && (
                                <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                                    {[searchQuery && 1, sortBy !== 'newest' && 1, priceRange !== 'all' && 1, stockFilter !== 'all' && 1].filter(Boolean).length} active
                                </Badge>
                            )}
                        </div>
                        {filtersOpen ? (
                            <ChevronUp className="h-5 w-5 text-neutral-600" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-neutral-600" />
                        )}
                    </button>

                    {filtersOpen && (
                        <div className="p-6 pt-0 space-y-6 border-t border-neutral-200">
                            {/* Sort By */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Sort By</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { value: 'newest', label: 'Newest' },
                                        { value: 'price-low', label: 'Price: Low to High' },
                                        { value: 'price-high', label: 'Price: High to Low' },
                                        { value: 'name', label: 'Name A-Z' }
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setSortBy(option.value)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === option.value
                                                ? 'bg-rose-600 text-white shadow-md'
                                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Price Range</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { value: 'all', label: 'All Prices' },
                                        { value: 'under-100', label: 'Under 100 EGP' },
                                        { value: '100-500', label: '100-500 EGP' },
                                        { value: '500-1000', label: '500-1000 EGP' },
                                        { value: 'over-1000', label: 'Over 1000 EGP' }
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setPriceRange(option.value)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${priceRange === option.value
                                                ? 'bg-rose-600 text-white shadow-md'
                                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Availability */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Availability</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { value: 'all', label: 'All Products' },
                                        { value: 'instock', label: 'In Stock' },
                                        { value: 'outofstock', label: 'Out of Stock' }
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setStockFilter(option.value)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${stockFilter === option.value
                                                ? 'bg-rose-600 text-white shadow-md'
                                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Active Filters Summary */}
                            {hasActiveFilters && (
                                <div className="pt-4 border-t border-neutral-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-neutral-700 font-medium">
                                            Showing {filteredProducts.length} of {allProducts.length} products
                                        </span>
                                        <button
                                            onClick={clearFilters}
                                            className="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700 font-medium"
                                        >
                                            <X className="h-4 w-4" />
                                            Clear All Filters
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-neutral-600 text-lg font-medium">
                            {hasActiveFilters
                                ? 'No products match your filters.'
                                : 'No products found in this category.'}
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}
