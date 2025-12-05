'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'
import { siteConfig } from '@/config/site'

import { useCart } from '@/context/CartContext'

import { Product } from '@/types'

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart()

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        await addToCart(product)
    }

    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-700 ease-out transform hover:-translate-y-2 flex flex-col">
            <Link 
                href={`/product/${product.id}`} 
                className={`relative ${!product.in_stock ? 'pointer-events-none' : ''}`}
            >
                {/* Image Container with Aspect Ratio */}
                <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                    {product.image_url ? (
                        <Image
                            src={product.image_url}
                            alt={`${product.name_en} - ${product.name_ar}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                            priority={false}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 text-neutral-400" role="img" aria-label="No product image available">
                            <span className="text-sm" aria-hidden="true">No Image</span>
                        </div>
                    )}

                    {/* Stock Badge */}
                    {!product.in_stock && (
                        <div className="absolute top-3 right-3">
                            <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />
                </div>
            </Link>

            {/* Product Info */}
            <div className="flex-1 p-5 space-y-3 flex flex-col">
                <div className="flex-1">
                    <Link href={`/product/${product.id}`}>
                        <h3 className="text-base font-semibold text-neutral-900 group-hover:text-rose-600 transition-colors duration-400 ease-out line-clamp-2 mb-1">
                            {product.name_en}
                        </h3>
                    </Link>
                    <p className="text-base text-neutral-500 line-clamp-1" dir="rtl">{product.name_ar}</p>
                </div>

                {/* Price */}
                <div className="pt-2 border-t border-neutral-100">
                    <p className="text-2xl font-bold text-neutral-900">{product.price.toLocaleString()}
                        <span className="text-sm font-normal text-neutral-500 ml-1">{siteConfig.currency.code}</span>
                    </p>
                </div>

                {/* Add to Cart Button */}
                <Button
                    onClick={handleAddToCart}
                    disabled={!product.in_stock}
                    className="w-full gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed focus:ring-4 focus:ring-rose-500 focus:ring-offset-2"
                    variant={product.in_stock ? "primary" : "secondary"}
                    aria-label={product.in_stock ? `Add ${product.name_en} to cart` : `${product.name_en} is out of stock`}
                >
                    <ShoppingBag className="h-4 w-4" />
                    {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
            </div>
        </div>
    )
}
