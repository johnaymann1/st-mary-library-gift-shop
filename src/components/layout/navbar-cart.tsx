'use client'

import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export function NavbarCart() {
    const { cartCount } = useCart()

    return (
        <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-rose-50 dark:hover:bg-rose-900/20 min-w-[44px] min-h-[44px] transition-colors"
            asChild
        >
            <Link href="/cart">
                <ShoppingBag className="h-5 w-5 text-neutral-700 dark:text-neutral-200 transition-colors" />
                <span className="sr-only">Cart</span>
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-600 dark:bg-rose-500 text-white text-xs font-semibold rounded-full flex items-center justify-center transition-colors">
                        {cartCount}
                    </span>
                )}
            </Link>
        </Button>
    )
}
