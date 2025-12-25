/**
 * Cart Service
 * Business logic layer for cart operations.
 * Uses cart repository for data access.
 */
import * as cartRepo from './repositories/cart.repository'
import type { CartItem } from '@/types'

/**
 * Service result type
 */
export interface ServiceResult<T = void> {
    success: boolean
    data?: T
    error?: string
}

/**
 * Gets all cart items for a user
 */
export async function getCartByUserId(userId: string): Promise<CartItem[]> {
    try {
        return await cartRepo.findCartItemsByUserId(userId)
    } catch (error) {
        console.error('Cart service error:', error)
        return []
    }
}

/**
 * Adds a product to cart or increments quantity if exists
 */
export async function addToCart(
    userId: string,
    productId: number,
    quantity: number
): Promise<ServiceResult> {
    try {
        // Validate quantity
        if (quantity <= 0) {
            return { success: false, error: 'Quantity must be positive' }
        }

        // Check if item already exists
        const existing = await cartRepo.findCartItem(userId, productId)

        if (existing) {
            // Update quantity
            const newQuantity = existing.quantity + quantity
            await cartRepo.updateCartItemQuantity(existing.id, newQuantity)
        } else {
            // Create new cart item
            await cartRepo.createCartItem(userId, productId, quantity)
        }

        return { success: true }
    } catch (error) {
        console.error('Add to cart error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to add to cart'
        }
    }
}

/**
 * Updates cart item quantity
 */
export async function updateCartItem(
    userId: string,
    productId: number,
    quantity: number
): Promise<ServiceResult> {
    try {
        // If quantity is 0 or less, remove the item
        if (quantity <= 0) {
            return await removeFromCart(userId, productId)
        }

        await cartRepo.updateCartItemByProduct(userId, productId, quantity)
        return { success: true }
    } catch (error) {
        console.error('Update cart error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update cart'
        }
    }
}

/**
 * Removes a product from cart
 */
export async function removeFromCart(
    userId: string,
    productId: number
): Promise<ServiceResult> {
    try {
        await cartRepo.deleteCartItemByProduct(userId, productId)
        return { success: true }
    } catch (error) {
        console.error('Remove from cart error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to remove from cart'
        }
    }
}

/**
 * Clears all items from cart
 */
export async function clearCart(userId: string): Promise<ServiceResult> {
    try {
        await cartRepo.deleteAllCartItems(userId)
        return { success: true }
    } catch (error) {
        console.error('Clear cart error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to clear cart'
        }
    }
}

/**
 * Merges local cart items into user's cart
 */
export async function mergeCart(
    userId: string,
    localItems: Array<{ product_id: number; quantity: number }>
): Promise<ServiceResult> {
    try {
        if (!localItems || localItems.length === 0) {
            return { success: true }
        }

        await cartRepo.mergeCartItems(userId, localItems)
        return { success: true }
    } catch (error) {
        console.error('Merge cart error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to merge cart'
        }
    }
}

/**
 * Gets total item count in cart
 */
export async function getCartItemCount(userId: string): Promise<number> {
    try {
        return await cartRepo.countCartItems(userId)
    } catch (error) {
        console.error('Cart count error:', error)
        return 0
    }
}

/**
 * Checks if a specific product is in cart
 */
export async function isProductInCart(
    userId: string,
    productId: number
): Promise<boolean> {
    try {
        const item = await cartRepo.findCartItem(userId, productId)
        return !!item
    } catch (error) {
        console.error('Check cart error:', error)
        return false
    }
}

/**
 * Gets cart item by product ID
 */
export async function getCartItem(
    userId: string,
    productId: number
): Promise<{ id: number; quantity: number } | null> {
    try {
        return await cartRepo.findCartItem(userId, productId)
    } catch (error) {
        console.error('Get cart item error:', error)
        return null
    }
}
