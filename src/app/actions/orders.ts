'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Order } from '@/types'

export async function getUserOrders() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items (
                *,
                product:products (
                    name_en,
                    name_ar,
                    image_url
                )
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching user orders:', error)
        return []
    }

    return data as unknown as Order[]
}

export async function getOrderDetails(orderId: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Get user role to check if admin
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    const isAdmin = userData?.role === 'admin'

    const query = supabase
        .from('orders')
        .select(`
            *,
            items:order_items (
                id,
                quantity,
                price_at_purchase,
                product:products (
                    id,
                    name_en,
                    name_ar,
                    image_url
                )
            ),
            user:users (
                full_name,
                email,
                phone
            )
        `)
        .eq('id', orderId)
        .single()

    const { data: order, error } = await query

    if (error || !order) {
        return { error: 'Order not found' }
    }

    // Security check: User can only see their own orders unless they are admin
    if (order.user_id !== user.id && !isAdmin) {
        return { error: 'Unauthorized' }
    }

    return { order: order as unknown as Order }
}

export async function getAllOrders(statusFilter?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Verify Admin
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userData?.role !== 'admin') {
        return { error: 'Unauthorized' }
    }

    let query = supabase
        .from('orders')
        .select(`
            *,
            items:order_items (
                *,
                product:products (
                    name_en,
                    name_ar,
                    image_url
                )
            ),
            user:users (
                full_name,
                email,
                phone
            )
        `)
        .order('created_at', { ascending: false })

    if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching all orders:', error)
        return { error: error.message }
    }

    return { orders: data as unknown as Order[] }
}

export async function updateOrderStatus(orderId: number, status: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Verify Admin
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userData?.role !== 'admin') {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

    if (error) return { error: error.message }

    revalidatePath('/admin/orders')
    revalidatePath(`/orders/${orderId}`)
    return { success: true }
}

export async function cancelOrder(orderId: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Get the order to verify ownership and status
    const { data: order } = await supabase
        .from('orders')
        .select('user_id, status')
        .eq('id', orderId)
        .single()

    if (!order) return { error: 'Order not found' }
    
    // Check if user owns the order
    if (order.user_id !== user.id) return { error: 'Unauthorized' }

    // Check if order can be cancelled (only pending_payment or processing)
    const cancellableStatuses = ['pending_payment', 'processing']
    if (!cancellableStatuses.includes(order.status)) {
        return { error: 'This order cannot be cancelled' }
    }

    const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)

    if (error) return { error: error.message }

    revalidatePath('/orders')
    revalidatePath(`/orders/${orderId}`)
    return { success: true }
}

export async function verifyPayment(orderId: number, approved: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Verify Admin
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userData?.role !== 'admin') {
        return { error: 'Unauthorized' }
    }

    const status = approved ? 'processing' : 'cancelled'

    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

    if (error) return { error: error.message }

    revalidatePath('/admin/orders')
    revalidatePath(`/orders/${orderId}`)
    return { success: true }
}
