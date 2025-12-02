'use client'

import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'
import { Product } from '@/types'
import { useState } from 'react'

export default function AddToCartButton({ product }: { product: Product }) {
    const { addToCart } = useCart()
    const [loading, setLoading] = useState(false)

    const handleAddToCart = async () => {
        setLoading(true)
        await addToCart(product)
        setLoading(false)
    }

    return (
        <Button
            onClick={handleAddToCart}
            disabled={!product.in_stock || loading}
            className="w-full gap-2"
            size="lg"
            variant={product.in_stock ? "primary" : "secondary"}
        >
            <ShoppingBag className="h-5 w-5" />
            {loading ? 'Adding...' : (product.in_stock ? 'Add to Cart' : 'Out of Stock')}
        </Button>
    )
}
