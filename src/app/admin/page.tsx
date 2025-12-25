import * as productService from '@/services/products'
import * as categoryService from '@/services/categories'
import { Package, ShoppingBag, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { siteConfig } from '@/config/site'
import { Suspense } from 'react'
import { StatsCardsSkeleton } from '@/components/ui/skeletons/StatsCardsSkeleton'
import { RecentProductsSkeleton } from '@/components/ui/skeletons/RecentProductsSkeleton'

// Cache admin dashboard for 5 minutes to drastically improve TTFB
export const revalidate = 300

// Stats Cards Component - Fetches and displays product statistics
async function StatsCards() {
    const [productStats, totalCategories] = await Promise.all([
        productService.getProductStats(),
        categoryService.getCategoryCount(),
    ])

    const stats = [
        {
            name: 'Total Products',
            value: productStats.totalProducts,
            icon: Package,
            iconBg: 'bg-blue-100 dark:bg-blue-900/30',
            iconColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            name: 'Active Products',
            value: productStats.activeProducts,
            icon: TrendingUp,
            iconBg: 'bg-green-100 dark:bg-green-900/30',
            iconColor: 'text-green-600 dark:text-green-400',
        },
        {
            name: 'Out of Stock',
            value: productStats.outOfStock,
            icon: AlertCircle,
            iconBg: 'bg-red-100 dark:bg-red-900/30',
            iconColor: 'text-red-600 dark:text-red-400',
        },
        {
            name: 'Categories',
            value: totalCategories,
            icon: ShoppingBag,
            iconBg: 'bg-purple-100 dark:bg-purple-900/30',
            iconColor: 'text-purple-600 dark:text-purple-400',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
                const Icon = stat.icon
                return (
                    <div
                        key={stat.name}
                        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 transition-colors">{stat.name}</p>
                                <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-2 transition-colors">{stat.value}</p>
                            </div>
                            <div className={`${stat.iconBg} p-3 rounded-xl transition-colors`}>
                                <Icon className={`h-6 w-6 ${stat.iconColor} transition-colors`} />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// Recent Products Component - Displays most recently added products
async function RecentProductsTable() {
    const recentProducts = await productService.getRecentProducts(5)

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-colors">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 transition-colors">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white transition-colors">Recent Products</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-1 font-medium transition-colors">Latest additions to your inventory</p>
                    </div>
                    <Link
                        href="/admin/products"
                        className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold text-sm transition-colors"
                    >
                        View All →
                    </Link>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                    <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider transition-colors">Product</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider transition-colors">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider transition-colors">Price</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider transition-colors">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider transition-colors">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800">
                        {recentProducts?.map((product) => (
                            <tr key={product.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name_en}
                                                className="h-12 w-12 rounded-lg object-cover shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center ring-1 ring-neutral-200 dark:ring-neutral-700">
                                                <Package className="h-6 w-6 text-neutral-400 dark:text-neutral-500" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-neutral-900 dark:text-white transition-colors">{product.name_en}</p>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 transition-colors font-arabic" dir="rtl">{product.name_ar}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-neutral-700 dark:text-neutral-300 transition-colors">
                                        {/* @ts-ignore */}
                                        {product.categories?.name_en || 'Uncategorized'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-bold text-neutral-900 dark:text-white transition-colors">{product.price} <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{siteConfig.currency.code}</span></span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant={product.in_stock ? 'success' : 'destructive'}>
                                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <Link
                                        href={`/admin/products/${product.id}`}
                                        className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold text-sm transition-colors"
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
                                        <Package className="h-12 w-12 text-neutral-300 dark:text-neutral-600 transition-colors" />
                                        <p className="text-neutral-600 dark:text-neutral-400 font-medium transition-colors">No products yet</p>
                                        <Link href="/admin/products" className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 text-sm font-semibold transition-colors">
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
    )
}

export default async function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 dark:from-rose-700 dark:to-rose-800 rounded-2xl p-8 shadow-sm transition-colors">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome to Admin Dashboard</h1>
                <p className="text-rose-100 text-lg font-medium">Manage your products, categories, and orders all in one place</p>
            </div>

            {/* Quick Search - Instant navigation without data fetching */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 transition-colors">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 transition-colors">Quick Access</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link href="/admin/products" className="group">
                        <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-rose-300 dark:hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
                            <div className="p-2 bg-rose-100 dark:bg-rose-900/40 rounded-lg group-hover:bg-rose-200 dark:group-hover:bg-rose-800/60 transition-colors">
                                <Package className="h-5 w-5 text-rose-600 dark:text-rose-400 transition-colors" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-neutral-900 dark:text-white transition-colors">Search Products</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 transition-colors">Browse your inventory</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/admin/categories" className="group">
                        <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-rose-300 dark:hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
                            <div className="p-2 bg-rose-100 dark:bg-rose-900/40 rounded-lg group-hover:bg-rose-200 dark:group-hover:bg-rose-800/60 transition-colors">
                                <ShoppingBag className="h-5 w-5 text-rose-600 dark:text-rose-400 transition-colors" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-neutral-900 dark:text-white transition-colors">Search Categories</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 transition-colors">Organize your catalog</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Statistics Grid - Wrapped in Suspense for progressive rendering */}
            <Suspense fallback={<StatsCardsSkeleton />}>
                <StatsCards />
            </Suspense>

            {/* Recent Products - Wrapped in Suspense for independent loading */}
            <Suspense fallback={<RecentProductsSkeleton />}>
                <RecentProductsTable />
            </Suspense>
        </div>
    )
}
