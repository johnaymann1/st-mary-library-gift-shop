'use client'

import { createClient } from '@/utils/supabase/client'
import CreateProductForm from './create-form'
import DeleteProductButton from './delete-button'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { siteConfig } from '@/config/site'

import { Product, Category } from '@/types'

export default function ProductsClientPage() {
    const [allProducts, setAllProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Pick<Category, 'id' | 'name_en'>[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient()

            // Fetch products
            const { data: productsData } = await supabase
                .from('products')
                .select(`
                    *,
                    categories (
                        name_en
                    )
                `)
                .order('created_at', { ascending: false })

            if (productsData) {
                setAllProducts(productsData)
            }

            // Fetch categories
            const { data: categoriesData } = await supabase
                .from('categories')
                .select('id, name_en')
                .order('name_en')

            if (categoriesData) {
                setCategories(categoriesData)
            }

            setLoading(false)
        }

        fetchData()
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
    }, [allProducts, searchQuery, statusFilter])

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
                <h1 className="text-4xl font-bold text-neutral-900 tracking-tight mb-2">Products Management</h1>
                <p className="text-neutral-700 font-medium text-lg">Manage your gift shop inventory</p>
            </div>

            <CreateProductForm categories={categories} />

            {/* Search and Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
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
                    <div className="flex items-center gap-2 text-sm text-neutral-700 font-medium">
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

            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-neutral-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-neutral-900 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name_en} className="h-12 w-12 rounded-lg object-cover shadow-sm" />
                                        ) : (
                                            <div className="h-12 w-12 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs font-medium">No Img</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-neutral-900">{product.name_en}</div>
                                        <div className="text-xs text-neutral-700">{product.name_ar}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                                        {/* @ts-ignore */}
                                        {product.categories?.name_en || 'Uncategorized'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900">{product.price} {siteConfig.currency.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={product.in_stock ? 'success' : 'destructive'}>
                                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <a
                                                href={`/admin/products/${product.id}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </a>
                                            <DeleteProductButton id={product.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-neutral-700 font-medium">
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
        </div>
    )
}
