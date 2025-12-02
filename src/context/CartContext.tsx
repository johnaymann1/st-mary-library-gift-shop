'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getCart, addToCart as serverAddToCart, updateCartItem as serverUpdateCartItem, removeCartItem as serverRemoveCartItem, mergeCart } from '@/app/actions/cart'
import { toast } from 'sonner'
import { User } from '@supabase/supabase-js'
import { Product } from '@/types'

export type CartItem = {
    id: number // For local items, we can use product_id as id or a random one
    product_id: number
    quantity: number
    product: {
        name_en: string
        name_ar: string
        price: number
        image_url: string | null
        in_stock: boolean
    }
}

type CartContextType = {
    cart: CartItem[]
    addToCart: (product: Product, quantity?: number) => Promise<void>
    removeFromCart: (productId: number) => Promise<void>
    updateQuantity: (productId: number, quantity: number) => Promise<void>
    cartCount: number
    isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)

    // Initial load
    useEffect(() => {
        const initCart = async () => {
            const supabase = createClient()
            const { data: { user: currentUser } } = await supabase.auth.getUser()
            setUser(currentUser)

            if (currentUser) {
                // User is logged in
                // Check for local items to merge
                const localCartJson = localStorage.getItem('cart')
                if (localCartJson) {
                    try {
                        const localCart = JSON.parse(localCartJson)
                        if (localCart.length > 0) {
                            const itemsToMerge = localCart.map((item: CartItem) => ({
                                product_id: item.product_id,
                                quantity: item.quantity
                            }))

                            await mergeCart(itemsToMerge)
                            localStorage.removeItem('cart')
                            toast.success('Cart merged successfully')
                        }
                    } catch (e) {
                        console.error('Error parsing local cart for merge:', e)
                    }
                }

                // Fetch server cart
                const serverCart = await getCart()
                setCart(serverCart)
            } else {
                // Guest user - load from local storage
                const localCartJson = localStorage.getItem('cart')
                if (localCartJson) {
                    try {
                        setCart(JSON.parse(localCartJson))
                    } catch (e) {
                        console.error('Error parsing local cart:', e)
                        localStorage.removeItem('cart')
                    }
                }
            }
            setIsLoading(false)
        }

        initCart()
    }, [])

    const addToCart = async (product: Product, quantity = 1) => {
        // Optimistic update
        const newItem: CartItem = {
            id: Date.now(), // Temporary ID for local
            product_id: product.id,
            quantity: quantity,
            product: {
                name_en: product.name_en,
                name_ar: product.name_ar,
                price: product.price,
                image_url: product.image_url,
                in_stock: product.in_stock
            }
        }

        setCart(prev => {
            const existing = prev.find(item => item.product_id === product.id)
            let newCart
            if (existing) {
                newCart = prev.map(item =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            } else {
                newCart = [...prev, newItem]
            }

            // Persist to local storage if guest
            if (!user) {
                localStorage.setItem('cart', JSON.stringify(newCart))
            }

            return newCart
        })

        toast.success('Added to cart')

        if (user) {
            // Sync with server
            await serverAddToCart(product.id, quantity)
            // Refresh to get real IDs
            const updatedCart = await getCart()
            setCart(updatedCart)
        }
    }

    const removeFromCart = async (productId: number) => {
        setCart(prev => {
            const newCart = prev.filter(item => item.product_id !== productId)
            if (!user) {
                localStorage.setItem('cart', JSON.stringify(newCart))
            }
            return newCart
        })

        if (user) {
            await serverRemoveCartItem(productId)
        }
    }

    const updateQuantity = async (productId: number, quantity: number) => {
        if (quantity <= 0) {
            return removeFromCart(productId)
        }

        setCart(prev => {
            const newCart = prev.map(item =>
                item.product_id === productId
                    ? { ...item, quantity }
                    : item
            )
            if (!user) {
                localStorage.setItem('cart', JSON.stringify(newCart))
            }
            return newCart
        })

        if (user) {
            await serverUpdateCartItem(productId, quantity)
        }
    }

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, cartCount, isLoading }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
