import * as productService from '@/services/products'
import * as categoryService from '@/services/categories'
import { Package, ShoppingBag, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { siteConfig } from '@/config/site'

// Cache admin dashboard for 5 minutes to drastically improve TTFB
export const revalidate = 300

export default async function AdminDashboard() {
    // Fetch statistics using service
    const [productStats, totalCategories, recentProducts] = await Promise.all([
        productService.getProductStats(),
        categoryService.getCategoryCount(),
        productService.getRecentProducts(5)
    ])

    const stats = [
        {
            name: 'Total Products',
            value: productStats.totalProducts,
            icon: Package,
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            bgLight: 'bg-blue-50',
        },
        {
            name: 'Active Products',
            value: productStats.activeProducts,
            icon: TrendingUp,
            color: 'bg-green-500',
            textColor: 'text-green-600',
            bgLight: 'bg-green-50',
        },
        {
            name: 'Out of Stock',
            value: productStats.outOfStock,
            icon: AlertCircle,
            color: 'bg-red-500',
            textColor: 'text-red-600',
            bgLight: 'bg-red-50',
        },
        {
            name: 'Categories',
            value: totalCategories,
            icon: ShoppingBag,
            color: 'bg-purple-500',
            textColor: 'text-purple-600',
            bgLight: 'bg-purple-50',
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">Dashboard</h1>
                <p className="text-neutral-700 dark:text-neutral-300 text-lg font-medium">Welcome back! Here's what's happening with your store.</p>
            </div>

            {/* Quick Search */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Quick Search</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/admin/products" className="group">
                        <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-rose-300 dark:hover:border-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
                            <div className="p-2 bg-rose-100 dark:bg-rose-900/40 rounded-lg group-hover:bg-rose-200 dark:group-hover:bg-rose-900/60 transition-colors">
                                <Package className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-neutral-900 dark:text-white">Search Products</p>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300">Find and manage products</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/admin/categories" className="group">
                        <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-rose-300 dark:hover:border-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
                            <div className="p-2 bg-rose-100 dark:bg-rose-900/40 rounded-lg group-hover:bg-rose-200 dark:group-hover:bg-rose-900/60 transition-colors">
                                <ShoppingBag className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-neutral-900 dark:text-white">Search Categories</p>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300">Organize your catalog</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.name} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bgLight} dark:bg-opacity-20`}>
                                    <Icon className={`h-6 w-6 ${stat.textColor} dark:opacity-90`} />
                                </div>
                            </div>
                            <h3 className="text-neutral-700 dark:text-neutral-300 text-sm font-bold uppercase tracking-wide mb-1">{stat.name}</h3>
                            <p className="text-4xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
                        </div>
                    )
                })}
            </div>

            {/* Recent Products */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Recent Products</h2>
                            <p className="text-neutral-700 dark:text-neutral-300 mt-1 font-medium">Latest additions to your inventory</p>
                        </div>
                        <Link
                            href="/admin/products"
                            className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold text-sm"
                        >
                            View All →
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                        <thead className="bg-neutral-50 dark:bg-neutral-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800">
                            {recentProducts?.map((product) => (
                                <tr key={product.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name_en}
                                                    className="h-12 w-12 rounded-lg object-cover shadow-sm"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                                    <Package className="h-6 w-6 text-neutral-400 dark:text-neutral-500" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-semibold text-neutral-900 dark:text-white">{product.name_en}</p>
                                                <p className="text-xs text-neutral-600 dark:text-neutral-400">{product.name_ar}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                            {/* @ts-ignore */}
                                            {product.categories?.name_en || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-bold text-neutral-900 dark:text-white">{product.price} {siteConfig.currency.code}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={product.in_stock ? 'success' : 'destructive'}>
                                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold text-sm"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {(!recentProducts || recentProducts.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
                                            <p className="text-neutral-700 dark:text-neutral-300 font-medium">No products yet</p>
                                            <Link href="/admin/products" className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 text-sm font-semibold">
                                                Create your first product →
                                            </Link>
                                        </div>
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
