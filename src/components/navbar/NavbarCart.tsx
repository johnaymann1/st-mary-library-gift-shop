'use client'

import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function NavbarCart() {
    const { cartCount } = useCart()

    return (
        <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-rose-50"
            asChild
        >
            <Link href="/cart">
                <ShoppingBag className="h-5 w-5 text-neutral-700" />
                <span className="sr-only">Cart</span>
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-600 text-white text-xs rounded-full flex items-center justify-center">
                        {cartCount}
                    </span>
                )}
            </Link>
        </Button>
    )
}
