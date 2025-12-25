import { Product } from '@/types'
import { Badge } from '@/components/ui/badge'
import { siteConfig } from '@/config/site'
import DeleteProductButton from '@/app/admin/products/delete-button'
import DuplicateProductButton from '@/app/admin/products/duplicate-button'

interface ProductsTableProps {
    products: Product[]
    onRefresh: () => void
}

export function ProductsTable({ products, onRefresh }: ProductsTableProps) {
    if (products.length === 0) {
        return (
            <div className="hidden md:block bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                <div className="px-6 py-12 text-center text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                    No products found. Create your first product above.
                </div>
            </div>
        )
    }

    return (
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
                        {products.map((product) => (
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
                                    <div className="text-xs text-neutral-700 dark:text-neutral-300 font-arabic" dir="rtl">{product.name_ar}</div>
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
                                        <DeleteProductButton id={product.id} onDelete={onRefresh} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
