import { Product } from '@/types'
import { Badge } from '@/components/ui/badge'
import { siteConfig } from '@/config/site'
import DeleteProductButton from '@/app/admin/products/delete-button'
import DuplicateProductButton from '@/app/admin/products/duplicate-button'

interface ProductsMobileListProps {
    products: Product[]
    onRefresh: () => void
    isEmpty?: boolean
}

export function ProductsMobileList({ products, onRefresh, isEmpty }: ProductsMobileListProps) {
    if (isEmpty) {
        return (
            <div className="md:hidden">
                <div className="bg-white dark:bg-neutral-900 shadow-sm rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 text-center">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                        No products found. Create your first product above.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="md:hidden space-y-4">
            {products.map((product) => (
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
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate font-arabic" dir="rtl">{product.name_ar}</p>
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
                            <DeleteProductButton id={product.id} onDelete={onRefresh} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
