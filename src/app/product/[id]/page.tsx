'use client'

import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { notFound, useRouter } from 'next/navigation'
import AddToCartButton from '@/components/AddToCartButton'
import { siteConfig } from '@/config/site'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Product } from '@/types'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProduct() {
            const supabase = createClient()
            const { id } = await params

            const { data } = await supabase
                .from('products')
                .select('*, categories(*)')
                .eq('id', parseInt(id))
                .single()

            if (!data) {
                notFound()
            }
            setProduct(data)
            setLoading(false)
        }

        fetchProduct()
    }, [params])

    if (loading || !product) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6 text-neutral-600 hover:text-rose-600 hover:bg-rose-50"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Image Section */}
                        <div className="relative aspect-w-1 aspect-h-1 h-96 bg-gray-200 rounded-lg overflow-hidden">
                            {product.image_url ? (
                                <Image
                                    src={product.image_url}
                                    alt={product.name_en}
                                    fill
                                    className="w-full h-full object-center object-cover"
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
                                <span className="text-indigo-600 font-medium text-sm">
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
