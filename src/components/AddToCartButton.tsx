'use client'

import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Check } from 'lucide-react'
import { Product } from '@/types'
import { useState } from 'react'

export default function AddToCartButton({ product }: { product: Product }) {
    const { addToCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [justAdded, setJustAdded] = useState(false)

    const handleAddToCart = async () => {
        setLoading(true)
        await addToCart(product)
        setLoading(false)
        setJustAdded(true)
        setTimeout(() => setJustAdded(false), 2000)
    }

    if (justAdded) {
        return (
            <Button
                disabled
                className="w-full gap-2 bg-green-600 hover:bg-green-600 text-white"
                size="lg"
            >
                <Check className="h-5 w-5" />
                Added to Cart!
            </Button>
        )
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
