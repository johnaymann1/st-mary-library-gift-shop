'use client'

import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { siteConfig } from '@/config/site'
import CartSkeleton from '@/components/CartSkeleton'

import { User } from '@supabase/supabase-js'

export default function CartClient({ user }: { user: User | null }) {
    const { cart, removeFromCart, updateQuantity, isLoading } = useCart()
    const router = useRouter()

    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)

    const handleCheckout = () => {
        if (user) {
            router.push('/checkout')
        } else {
            router.push('/login?next=/checkout')
        }
    }

    if (isLoading) {
        return <CartSkeleton />
    }

    if (cart.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-neutral-200">
                <div className="mb-4">
                    <div className="mx-auto h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-neutral-400" />
                    </div>
                </div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">Your cart is empty</h2>
                <p className="text-neutral-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
                <Button asChild>
                    <Link href="/">Start Shopping</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                    <ul className="divide-y divide-neutral-200">
                        {cart.map((item) => (
                            <li key={item.product_id} className="p-4 sm:p-6 flex gap-4 sm:gap-6">
                                {/* Image */}
                                <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-200">
                                    {item.product.image_url ? (
                                        <Image
                                            src={item.product.image_url}
                                            alt={item.product.name_en}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400 text-xs">
                                            No Img
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 line-clamp-2">
                                                <Link href={`/product/${item.product_id}`} className="hover:text-rose-600 transition-colors">
                                                    {item.product.name_en}
                                                </Link>
                                            </h3>
                                            <p className="text-base sm:text-lg font-bold text-neutral-900 whitespace-nowrap ml-2">
                                                {(item.product.price * item.quantity).toLocaleString()} <span className="text-xs font-normal text-neutral-500">{siteConfig.currency.code}</span>
                                            </p>
                                        </div>
                                        <p className="text-sm text-neutral-600 mt-1 line-clamp-1" dir="rtl">{item.product.name_ar}</p>
                                        <p className="text-xs sm:text-sm text-neutral-700 mt-1 font-medium">Unit Price: {item.product.price} {siteConfig.currency.code}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 sm:gap-3 bg-neutral-50 rounded-lg p-1 border border-neutral-200">
                                            <button
                                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                className="p-1 hover:bg-white rounded-md transition-colors text-neutral-600 disabled:opacity-50 h-8 w-8 flex items-center justify-center"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                                            </button>
                                            <span className="text-sm font-medium w-6 text-center text-neutral-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                className="p-1 hover:bg-white rounded-md transition-colors text-neutral-600 h-8 w-8 flex items-center justify-center"
                                            >
                                                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.product_id)}
                                            className="text-xs sm:text-sm font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1 p-2 hover:bg-rose-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="hidden sm:inline">Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-6 lg:mt-0">
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-5 sm:p-6 sticky top-24">
                    <h2 className="text-lg font-bold text-neutral-900 mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-neutral-700 font-medium">
                            <span>Subtotal</span>
                            <span>{subtotal.toLocaleString()} {siteConfig.currency.code}</span>
                        </div>
                        <div className="flex justify-between text-neutral-700 font-medium">
                            <span>Shipping</span>
                            <span className="text-neutral-600">Calculated at checkout</span>
                        </div>
                        <div className="border-t border-neutral-200 pt-4 flex justify-between font-bold text-lg text-neutral-900">
                            <span>Total</span>
                            <span>{subtotal.toLocaleString()} {siteConfig.currency.code}</span>
                        </div>
                    </div>

                    <Button
                        onClick={handleCheckout}
                        className="w-full gap-2 h-12 text-base"
                        size="lg"
                    >
                        Proceed to Checkout
                        <ArrowRight className="h-4 w-4" />
                    </Button>

                    {!user && (
                        <p className="text-xs text-neutral-600 text-center mt-4">
                            You'll be asked to sign in to complete your purchase.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

function ShoppingBagIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    )
}
