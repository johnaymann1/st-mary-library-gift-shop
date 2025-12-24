import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AddToCartButton } from '@/components/modules/cart'
import { siteConfig } from '@/config/site'
import { ProductDetailsClient } from '@/components/modules/products/product-details-client'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ProductPrice } from '@/components/ui/product-price'
import * as productService from '@/services/products'
import type { Metadata } from 'next'

// Enable ISR with 1 hour revalidation
export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const product = await productService.getProductById(parseInt(id))

    if (!product) {
        return {
            title: 'Product Not Found',
        }
    }

    return {
        title: `${product.name_en} | ${siteConfig.displayName}`,
        description: product.desc_en || `Buy ${product.name_en} at ${siteConfig.displayName}`,
        openGraph: {
            title: product.name_en,
            description: product.desc_en || undefined,
            images: product.image_url ? [product.image_url] : undefined,
        },
    }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = await productService.getProductById(parseInt(id))

    if (!product) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-rose-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 transition-colors">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb Navigation */}
                <Breadcrumb
                    items={[
                        {
                            label: product.categories?.name_en || 'Category',
                            href: `/category/${product.category_id}`
                        },
                        {
                            label: product.name_en
                        }
                    ]}
                />

                <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden border-4 border-white dark:border-neutral-800 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Image Section */}
                        <div className="relative aspect-w-1 aspect-h-1 h-96 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-neutral-800 dark:to-neutral-900 rounded-3xl overflow-hidden shadow-xl transition-colors">
                            {product.image_url ? (
                                <Image
                                    src={product.image_url}
                                    alt={product.name_en}
                                    fill
                                    className="w-full h-full object-center object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-neutral-500">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="flex flex-col">
                            <div className="mb-4">
                                <span className="inline-flex items-center text-rose-600 dark:text-rose-400 font-medium text-sm px-3 py-1 bg-rose-50 dark:bg-rose-900/20 rounded-full transition-colors">
                                    {product.categories?.name_en || 'Uncategorized'}
                                </span>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1 transition-colors">{product.name_en}</h1>
                                {product.name_ar && <p className="text-lg md:text-xl text-gray-600 dark:text-neutral-300 mt-1 font-medium transition-colors" dir="rtl">{product.name_ar}</p>}
                            </div>

                            {/* Price - hide on mobile (shows in sticky bar) */}
                            <div className="hidden md:block mb-6">
                                <ProductPrice 
                                    price={product.price}
                                    salePrice={product.sale_price}
                                    saleEndDate={product.sale_end_date}
                                    size="lg"
                                    showSavings={true}
                                />
                            </div>

                            <div className="prose prose-sm md:prose-base text-gray-500 dark:text-neutral-300 mb-8 transition-colors">
                                <p>{product.desc_en}</p>
                                {product.desc_ar && <p className="mt-2 text-right text-sm md:text-base" dir="rtl">{product.desc_ar}</p>}
                            </div>

                            {/* Desktop Add to Cart - hidden on mobile */}
                            <div className="mt-auto hidden md:block">
                                {!product.in_stock && (
                                    <div className="mb-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 transition-colors">
                                        Out of Stock
                                    </div>
                                )}

                                <AddToCartButton product={product} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Sticky Bottom Bar - only on mobile */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t-2 border-gray-100 dark:border-neutral-800 shadow-2xl z-50 transition-colors">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                        {/* Price */}
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-neutral-400 transition-colors">Price</span>
                            <ProductPrice 
                                price={product.price}
                                salePrice={product.sale_price}
                                saleEndDate={product.sale_end_date}
                                size="sm"
                            />
                        </div>

                        {/* Add to Cart Button */}
                        <div className="flex-1 max-w-[200px]">
                            {!product.in_stock ? (
                                <div className="px-4 py-3 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 text-center transition-colors">
                                    Out of Stock
                                </div>
                            ) : (
                                <AddToCartButton product={product} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Spacer for mobile sticky bar */}
                <div className="md:hidden h-20" />
            </main>
        </div>
    )
}
