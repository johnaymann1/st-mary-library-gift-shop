/**
 * Cart Repository
 * Pure database operations for cart management.
 * Zero business logic - only data access.
 */
import { createClient } from '@/lib/supabase/server'
import type { CartItem } from '@/types'

/**
 * Database schema for cart operations
 */
export interface CartItemEntity {
    id: number
    user_id: string
    product_id: number
    quantity: number
    created_at: string
}

export interface CartItemWithProduct extends CartItemEntity {
    product: {
        name_en: string
        name_ar: string
        price: number
        image_url: string | null
        in_stock: boolean
    }
}

/**
 * Fetches all cart items for a user with product details
 */
export async function findCartItemsByUserId(userId: string): Promise<CartItem[]> {
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
                sale_price,
                sale_end_date,
                image_url,
                in_stock
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

    if (error) throw new Error(`Failed to fetch cart: ${error.message}`)

    return data as unknown as CartItem[]
}

/**
 * Finds a specific cart item by user and product
 */
export async function findCartItem(
    userId: string,
    productId: number
): Promise<{ id: number; quantity: number } | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('cart')
        .select('id, quantity')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .maybeSingle()

    if (error) throw new Error(`Failed to find cart item: ${error.message}`)

    return data
}

/**
 * Creates a new cart item
 */
export async function createCartItem(
    userId: string,
    productId: number,
    quantity: number
): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('cart')
        .insert({
            user_id: userId,
            product_id: productId,
            quantity: quantity
        })

    if (error) throw new Error(`Failed to create cart item: ${error.message}`)
}

/**
 * Updates quantity of an existing cart item by ID
 */
export async function updateCartItemQuantity(
    cartItemId: number,
    quantity: number
): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('id', cartItemId)

    if (error) throw new Error(`Failed to update cart item: ${error.message}`)
}

/**
 * Updates quantity by user and product
 */
export async function updateCartItemByProduct(
    userId: string,
    productId: number,
    quantity: number
): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('user_id', userId)
        .eq('product_id', productId)

    if (error) throw new Error(`Failed to update cart item: ${error.message}`)
}

/**
 * Deletes a cart item by user and product
 */
export async function deleteCartItemByProduct(
    userId: string,
    productId: number
): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)

    if (error) throw new Error(`Failed to delete cart item: ${error.message}`)
}

/**
 * Deletes all cart items for a user
 */
export async function deleteAllCartItems(userId: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId)

    if (error) throw new Error(`Failed to clear cart: ${error.message}`)
}

/**
 * Merges local cart items using database RPC function
 */
export async function mergeCartItems(
    userId: string,
    items: Array<{ product_id: number; quantity: number }>
): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.rpc('merge_cart', {
        p_user_id: userId,
        p_items: items
    })

    if (error) throw new Error(`Failed to merge cart: ${error.message}`)
}

/**
 * Counts total cart items for a user
 */
export async function countCartItems(userId: string): Promise<number> {
    const supabase = await createClient()

    const { count, error } = await supabase
        .from('cart')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

    if (error) throw new Error(`Failed to count cart items: ${error.message}`)

    return count || 0
}
