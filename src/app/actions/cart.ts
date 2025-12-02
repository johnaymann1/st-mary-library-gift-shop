'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { CartItem } from '@/types'

export async function getCart() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

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
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching cart:', error)
        return []
    }

    return data as unknown as CartItem[]
}

export async function addToCart(productId: number, quantity: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'User not logged in' }
    }

    // Check if item already exists
    const { data: existing } = await supabase
        .from('cart')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

    let error

    if (existing) {
        const { error: updateError } = await supabase
            .from('cart')
            .update({ quantity: existing.quantity + quantity })
            .eq('id', existing.id)
        error = updateError
    } else {
        const { error: insertError } = await supabase
            .from('cart')
            .insert({
                user_id: user.id,
                product_id: productId,
                quantity: quantity
            })
        error = insertError
    }

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/cart')
    return { success: true }
}

export async function updateCartItem(productId: number, quantity: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    if (quantity <= 0) {
        return removeCartItem(productId)
    }

    const { error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId)

    if (error) return { error: error.message }

    revalidatePath('/cart')
    return { success: true }
}

export async function removeCartItem(productId: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)

    if (error) return { error: error.message }

    revalidatePath('/cart')
    return { success: true }
}

export async function mergeCart(localItems: { product_id: number; quantity: number }[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Use the RPC function we assumed exists from the prompt context
    const { error } = await supabase.rpc('merge_cart', {
        p_user_id: user.id,
        p_items: localItems
    })

    if (error) {
        console.error('Merge cart error:', error)
        return { error: error.message }
    }

    revalidatePath('/cart')
    return { success: true }
}
