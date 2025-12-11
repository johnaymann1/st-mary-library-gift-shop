/**
 * Cart Service
 * Centralized data access for all cart-related operations.
 */
import { createClient } from '@/lib/supabase/server'
import type { CartItem } from '@/types'

/**
 * Retrieves all cart items for a user
 */
export async function getCartByUserId(userId: string): Promise<CartItem[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('cart')
        .select(`
            id,
            product_id,
            quantity,
            product:products (
                name_en,
                name_ar,
                price,
                image_url,
                in_stock
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

    if (error) {
        return []
    }

    return data as unknown as CartItem[]
}

/**
 * Checks if a product exists in the user's cart
 */
export async function getCartItem(userId: string, productId: number): Promise<{ id: number; quantity: number } | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('cart')
        .select('id, quantity')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single()

    if (error || !data) {
        return null
    }

    return data
}

/**
 * Adds a product to the cart or updates quantity if exists
 */
export async function addToCart(userId: string, productId: number, quantity: number): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()

    // Check if item already exists
    const existing = await getCartItem(userId, productId)

    if (existing) {
        const { error } = await supabase
            .from('cart')
            .update({ quantity: existing.quantity + quantity })
            .eq('id', existing.id)

        if (error) {
            return { error: error.message }
        }
    } else {
        const { error } = await supabase
            .from('cart')
            .insert({
                user_id: userId,
                product_id: productId,
                quantity: quantity
            })

        if (error) {
            return { error: error.message }
        }
    }

    return { success: true }
}

/**
 * Updates the quantity of a cart item
 */
export async function updateCartItem(userId: string, productId: number, quantity: number): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()

    if (quantity <= 0) {
        return removeFromCart(userId, productId)
    }

    const { error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('user_id', userId)
        .eq('product_id', productId)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

/**
 * Removes a product from the cart
 */
export async function removeFromCart(userId: string, productId: number): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

/**
 * Clears all items from a user's cart
 */
export async function clearCart(userId: string): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

/**
 * Merges local cart items into user's cart
 */
export async function mergeCart(userId: string, localItems: { product_id: number; quantity: number }[]): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()

    const { error } = await supabase.rpc('merge_cart', {
        p_user_id: userId,
        p_items: localItems
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}
