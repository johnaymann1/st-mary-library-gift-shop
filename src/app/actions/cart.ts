'use server'

import { revalidatePath } from 'next/cache'
import type { CartItem } from '@/types'
import * as cartService from '@/services/cart'
import * as userService from '@/services/users'

/**
 * Shopping Cart Server Actions
 * Handles all cart-related operations with authentication and validation
 */

/**
 * Retrieves the current user's shopping cart
 * @returns Array of cart items or empty array if not authenticated
 */
export async function getCart(): Promise<CartItem[]> {
    const user = await userService.getCurrentUser()
    if (!user) return []

    return cartService.getCartByUserId(user.id)
}

/**
 * Adds a product to the shopping cart
 * @param productId - The ID of the product to add
 * @param quantity - The quantity to add (default: 1)
 * @returns Success status or error message
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
 * @param productId - The ID of the product to update
 * @param quantity - The new quantity (0 to remove)
 * @returns Success status or error message
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
 * @param productId - The ID of the product to remove
 * @returns Success status or error message
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
 * Merges local cart items into the user's cart after login
 * Used to preserve cart items from anonymous browsing
 * @param localItems - Array of cart items from local storage
 * @returns Success status or error message
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
