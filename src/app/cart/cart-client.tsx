'use client'

import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { CartSkeleton } from '@/components/modules/cart'
import { ProductPrice, isSaleActive } from '@/components/ui/product-price'
import { toast } from 'sonner'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { useState, useEffect } from 'react'

import { User } from '@supabase/supabase-js'

export default function CartClient({ user }: { user: User | null }) {
    const { cart, removeFromCart, updateQuantity, isLoading, addToCart } = useCart()
    const router = useRouter()
    const [showEmptyCartDialog, setShowEmptyCartDialog] = useState(false)

    // DEBUG: Log cart data to see sale prices
    useEffect(() => {
        if (cart.length > 0) {
            console.log('=== CART DEBUG ===')
            cart.forEach(item => {
                console.log(`Product: ${item.product.name_en}`)
                console.log(`  Product ID: ${item.product_id}`)
                console.log(`  Regular Price: ${item.product.price}`)
                console.log(`  Sale Price: ${item.product.sale_price}`)
                console.log(`  Sale End Date: ${item.product.sale_end_date}`)
                console.log(`  Full Product Data:`, JSON.stringify(item.product, null, 2))
                console.log(`  Is Sale Active: ${isSaleActive(item.product.sale_price, item.product.sale_end_date)}`)
            })
        }
    }, [cart])

    const subtotal = cart.reduce((acc, item) => {
        if (!item.product || item.product.price == null) return acc
        const activePrice = isSaleActive(item.product.sale_price, item.product.sale_end_date) && item.product.sale_price
            ? item.product.sale_price
            : item.product.price
        return acc + (activePrice * item.quantity)
    }, 0)

    const handleCheckout = () => {
        if (user) {
            router.push('/checkout')
        } else {
            router.push('/login?next=/checkout')
        }
    }

    const handleRemoveWithUndo = (productId: number, item: typeof cart[0]) => {
        // Store the removed item details before removing
        const removedItem = { ...item }
        
        // Remove from cart immediately (optimistic update)
        removeFromCart(productId)
        
        toast.success('Item removed from cart', {
            action: {
                label: 'Undo',
                onClick: async () => {
                    try {
                        // Reconstruct the product object with all required fields including sale info
                        const productToRestore = {
                            id: removedItem.product_id,
                            name_en: removedItem.product.name_en,
                            name_ar: removedItem.product.name_ar,
                            price: removedItem.product.price,
                            sale_price: removedItem.product.sale_price,
                            sale_end_date: removedItem.product.sale_end_date,
                            image_url: removedItem.product.image_url,
                            in_stock: removedItem.product.in_stock,
                            // Add default/placeholder values for required Product fields
                            desc_en: null,
                            desc_ar: null,
                            category_id: 0, // Will be ignored by addToCart
                            is_active: true,
                            created_at: new Date().toISOString()
                        }
                        
                        // Re-add to cart with original quantity
                        await addToCart(productToRestore as any, removedItem.quantity)
                        toast.success('Item restored to cart')
                    } catch (error) {
                        toast.error('Could not restore item')
                        console.error('Undo restore error:', error)
                    }
                }
            },
            duration: 5000
        })
    }

    if (isLoading) {
        return <CartSkeleton />
    }

    if (cart.length === 0) {
        return (
            <EmptyState
                icon="cart"
                title="Your cart is empty"
                description="Looks like you haven't added anything yet. Start exploring our collection!"
                actionLabel="Start Shopping"
                actionHref="/"
            />
        )
    }

    return (
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-colors">
                    <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
                        {cart.filter(item => item.product).map((item) => (
                            <li key={item.product_id} className="p-4 sm:p-6 flex gap-4 sm:gap-6">
                                {/* Image */}
                                <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 transition-colors">
                                    {item.product.image_url ? (
                                        <Image
                                            src={item.product.image_url}
                                            alt={`${item.product.name_en} - ${item.product.name_ar}`}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 text-xs transition-colors" role="img" aria-label="No product image">
                                            No Img
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white line-clamp-2 transition-colors">
                                                <Link href={`/product/${item.product_id}`} className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                                                    {item.product.name_en}
                                                </Link>
                                            </h3>
                                            <div className="whitespace-nowrap">
                                                <ProductPrice 
                                                    price={item.product.price * item.quantity}
                                                    salePrice={item.product.sale_price ? item.product.sale_price * item.quantity : null}
                                                    saleEndDate={item.product.sale_end_date}
                                                    size="sm"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-1 transition-colors" dir="rtl">{item.product.name_ar}</p>
                                        <div className="mt-1">
                                            <ProductPrice 
                                                price={item.product.price}
                                                salePrice={item.product.sale_price}
                                                saleEndDate={item.product.sale_end_date}
                                                size="sm"
                                            />
                                            <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1 transition-colors">per unit</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 sm:gap-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-1 border border-neutral-200 dark:border-neutral-700 transition-colors" role="group" aria-label="Quantity controls">
                                            <button
                                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                className="p-1 hover:bg-white dark:hover:bg-neutral-700 rounded-md transition-colors text-neutral-600 dark:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed h-11 w-11 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                                                disabled={item.quantity <= 1}
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="text-sm font-medium w-8 text-center text-neutral-900 dark:text-white transition-colors" aria-label="Quantity" aria-live="polite">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                className="p-1 hover:bg-white dark:hover:bg-neutral-700 rounded-md transition-colors text-neutral-600 dark:text-neutral-300 h-11 w-11 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemoveWithUndo(item.product_id, item)}
                                            className="text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                                            aria-label={`Remove ${item.product.name_en} from cart`}
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
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-5 sm:p-6 sticky top-24 transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-white transition-colors">Order Summary</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowEmptyCartDialog(true)}
                            className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs transition-colors"
                        >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Empty Cart
                        </Button>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-neutral-700 dark:text-neutral-300 font-medium transition-colors">
                            <span>Subtotal</span>
                            <span>{subtotal.toLocaleString()} {siteConfig.currency.code}</span>
                        </div>
                        <div className="flex justify-between text-neutral-700 dark:text-neutral-300 font-medium transition-colors">
                            <span>Shipping</span>
                            <span className="text-neutral-600 dark:text-neutral-400 transition-colors">Calculated at checkout</span>
                        </div>
                        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 flex justify-between font-bold text-lg text-neutral-900 dark:text-white transition-colors">
                            <span>Total</span>
                            <span>{subtotal.toLocaleString()} {siteConfig.currency.code}</span>
                        </div>
                    </div>

                    <Button
                        onClick={handleCheckout}
                        className="w-full gap-2 h-12 text-base disabled:opacity-60 disabled:cursor-not-allowed focus:ring-4 focus:ring-rose-500 focus:ring-offset-2"
                        size="lg"
                        disabled={cart.length === 0}
                        aria-label="Proceed to checkout"
                    >
                        Proceed to Checkout
                        <ArrowRight className="h-4 w-4" />
                    </Button>

                    {!user && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 text-center mt-4 transition-colors">
                            You'll be asked to sign in to complete your purchase.
                        </p>
                    )}
                </div>
            </div>

            <ConfirmationDialog
                open={showEmptyCartDialog}
                onOpenChange={setShowEmptyCartDialog}
                title="Empty Cart?"
                description="Are you sure you want to remove all items from your cart? This action cannot be undone."
                confirmLabel="Empty Cart"
                cancelLabel="Cancel"
                variant="destructive"
                onConfirm={() => {
                    cart.forEach(item => removeFromCart(item.product_id))
                    toast.success('Cart emptied successfully')
                }}
            />
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
