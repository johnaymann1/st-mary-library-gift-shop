import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AddToCartButton } from '@/components/modules/cart'
import { siteConfig } from '@/config/site'
import { ProductDetailsClient } from '@/components/modules/products/product-details-client'
import * as productService from '@/services/products'
import type { Metadata } from 'next'

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
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-rose-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Navigation */}
                <div className="flex items-center gap-4 mb-6">
                    <ProductDetailsClient categoryId={product.category_id} />
                    {product.categories && (
                        <nav className="flex items-center gap-2 text-sm text-neutral-600">
                            <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
                            <span>/</span>
                            <Link href={`/category/${product.category_id}`} className="hover:text-rose-600 transition-colors">
                                {product.categories.name_en}
                            </Link>
                            <span>/</span>
                            <span className="text-neutral-900 font-medium">{product.name_en}</span>
                        </nav>
                    )}
                </div>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Image Section */}
                        <div className="relative aspect-w-1 aspect-h-1 h-96 bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl overflow-hidden shadow-xl">
                            {product.image_url ? (
                                <Image
                                    src={product.image_url}
                                    alt={product.name_en}
                                    fill
                                    className="w-full h-full object-center object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="flex flex-col">
                            <div className="mb-4">
                                <span className="inline-flex items-center text-rose-600 font-medium text-sm px-3 py-1 bg-rose-50 rounded-full">
                                    {product.categories?.name_en || 'Uncategorized'}
                                </span>
                                <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name_en}</h1>
                                {product.name_ar && <p className="text-xl text-gray-600 mt-1 font-medium" dir="rtl">{product.name_ar}</p>}
                            </div>

                            <div className="text-2xl font-bold text-gray-900 mb-6">
                                {product.price.toLocaleString()} {siteConfig.currency.code}
                            </div>

                            <div className="prose prose-base text-gray-500 mb-8">
                                <p>{product.desc_en}</p>
                                {product.desc_ar && <p className="mt-2 text-right text-base" dir="rtl">{product.desc_ar}</p>}
                            </div>

                            <div className="mt-auto">
                                {!product.in_stock && (
                                    <div className="mb-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                        Out of Stock
                                    </div>
                                )}

                                <AddToCartButton product={product} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
