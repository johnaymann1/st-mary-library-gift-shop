'use client'

import { getProductsAction } from './actions'
import CreateProductForm from './create-form'
import DeleteProductButton from './delete-button'
import DuplicateProductButton from './duplicate-button'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState, useCallback } from 'react'
import { siteConfig } from '@/config/site'

import { Product, Category } from '@/types'

interface ProductsClientPageProps {
    initialProducts: Product[]
    initialCategories: Category[]
}

export default function ProductsClientPage({ initialProducts, initialCategories }: ProductsClientPageProps) {
    const [allProducts, setAllProducts] = useState<Product[]>(initialProducts)
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
    const [categories] = useState<Pick<Category, 'id' | 'name_en'>[]>(initialCategories)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const fetchData = useCallback(async () => {
        setLoading(true)
        const products = await getProductsAction()
        setAllProducts(products)
        setLoading(false)
    }, [])

    // Apply filters whenever search or status changes
    useEffect(() => {
        let result = [...allProducts]

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(p =>
                p.name_en.toLowerCase().includes(query) ||
                p.name_ar.toLowerCase().includes(query)
            )
        }

        // Status filter
        if (statusFilter === 'instock') {
            result = result.filter(p => p.in_stock)
        } else if (statusFilter === 'outofstock') {
            result = result.filter(p => !p.in_stock)
        }

        setFilteredProducts(result)
        setCurrentPage(1) // Reset to first page on filter change
    }, [allProducts, searchQuery, statusFilter])

    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

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
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-white tracking-tight mb-2">Products Management</h1>
                <p className="text-neutral-700 dark:text-neutral-300 font-medium text-lg">Manage your gift shop inventory</p>
            </div>

            <CreateProductForm categories={categories} onSuccess={fetchData} />

            {/* Search and Filter Bar */}
            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                        <Input
                            type="search"
                            placeholder="Search products by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === 'all'
                                ? 'bg-rose-600 text-white shadow-md'
                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setStatusFilter('instock')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === 'instock'
                                ? 'bg-rose-600 text-white shadow-md'
                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                }`}
                        >
                            In Stock
                        </button>
                        <button
                            onClick={() => setStatusFilter('outofstock')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === 'outofstock'
                                ? 'bg-rose-600 text-white shadow-md'
                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                }`}
                        >
                            Out of Stock
                        </button>
                    </div>
                </div>
                {(searchQuery || statusFilter !== 'all') && (
                    <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                        <span>Showing {filteredProducts.length} of {allProducts.length} results</span>
                        {searchQuery && <Badge variant="secondary">Search: {searchQuery}</Badge>}
                        {statusFilter !== 'all' && (
                            <Badge variant="secondary">
                                Status: {statusFilter === 'instock' ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                        )}
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                        <thead className="bg-neutral-50 dark:bg-neutral-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800">
                            {paginatedProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name_en} className="h-12 w-12 rounded-lg object-cover shadow-sm" />
                                        ) : (
                                            <div className="h-12 w-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 text-xs font-medium">No Img</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-neutral-900 dark:text-white">{product.name_en}</div>
                                        <div className="text-xs text-neutral-700 dark:text-neutral-300">{product.name_ar}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300">
                                        {/* @ts-ignore */}
                                        {product.categories?.name_en || 'Uncategorized'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900 dark:text-white">{product.price} {siteConfig.currency.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={product.in_stock ? 'success' : 'destructive'}>
                                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <a
                                                href={`/admin/products/${product.id}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </a>
                                            <DuplicateProductButton product={product} />
                                            <DeleteProductButton id={product.id} onDelete={fetchData} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                                        {searchQuery || statusFilter !== 'all'
                                            ? 'No products match your filters.'
                                            : 'No products found. Create your first product above.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {paginatedProducts.map((product) => (
                    <div key={product.id} className="bg-white dark:bg-neutral-900 shadow-sm rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                        <div className="p-4 space-y-4">
                            {/* Image and Title */}
                            <div className="flex gap-4">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name_en} className="h-20 w-20 rounded-lg object-cover shadow-sm flex-shrink-0" />
                                ) : (
                                    <div className="h-20 w-20 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 text-xs font-medium flex-shrink-0">No Image</div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-neutral-900 dark:text-white truncate">{product.name_en}</h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">{product.name_ar}</p>
                                    <div className="mt-2">
                                        <Badge variant={product.in_stock ? 'success' : 'destructive'}>
                                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-neutral-500 dark:text-neutral-400 text-xs">Category</p>
                                    <p className="font-medium text-neutral-900 dark:text-white">
                                        {/* @ts-ignore */}
                                        {product.categories?.name_en || 'Uncategorized'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-neutral-500 dark:text-neutral-400 text-xs">Price</p>
                                    <p className="font-semibold text-neutral-900 dark:text-white">{product.price} {siteConfig.currency.code}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                <a
                                    href={`/admin/products/${product.id}`}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </a>
                                <DuplicateProductButton product={product} />
                                <DeleteProductButton id={product.id} onDelete={fetchData} />
                            </div>
                        </div>
                    </div>
                ))}
                {filteredProducts.length === 0 && (
                    <div className="bg-white dark:bg-neutral-900 shadow-sm rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 text-center">
                        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                            {searchQuery || statusFilter !== 'all'
                                ? 'No products match your filters.'
                                : 'No products found. Create your first product above.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="bg-white dark:bg-neutral-900 shadow-sm rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Results info */}
                        <div className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                            Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length}
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
