'use server'

import { revalidatePath } from 'next/cache'
import type { CartItem } from '@/types'
import * as cartService from '@/services/cart'
import * as userService from '@/services/users'

/**
 * Retrieves the current user's shopping cart
 */
export async function getCart(): Promise<CartItem[]> {
    const user = await userService.getCurrentUser()
    if (!user) return []

    return cartService.getCartByUserId(user.id)
}

/**
 * Adds a product to the shopping cart
 */
export async function addToCart(productId: number, quantity: number): Promise<{ success?: boolean; error?: string }> {
    const user = await userService.getCurrentUser()
    if (!user) return { error: 'User not logged in' }

    const result = await cartService.addToCart(user.id, productId, quantity)

    if (result.success) {
        revalidatePath('/cart')
    }

    return result
}

/**
 * Updates the quantity of a cart item
 */
export async function updateCartItem(productId: number, quantity: number): Promise<{ success?: boolean; error?: string }> {
    const user = await userService.getCurrentUser()
    if (!user) return { error: 'Unauthorized' }

    const result = await cartService.updateCartItem(user.id, productId, quantity)

    if (result.success) {
        revalidatePath('/cart')
    }

    return result
}

/**
 * Removes a product from the cart
 */
export async function removeCartItem(productId: number): Promise<{ success?: boolean; error?: string }> {
    const user = await userService.getCurrentUser()
    if (!user) return { error: 'Unauthorized' }

    const result = await cartService.removeFromCart(user.id, productId)

    if (result.success) {
        revalidatePath('/cart')
    }

    return result
}

/**
 * Merges local cart items into the user's cart
 */
export async function mergeCart(localItems: { product_id: number; quantity: number }[]): Promise<{ success?: boolean; error?: string }> {
    const user = await userService.getCurrentUser()
    if (!user) return { error: 'Unauthorized' }

    const result = await cartService.mergeCart(user.id, localItems)

    if (result.success) {
        revalidatePath('/cart')
    }

    return result
}
