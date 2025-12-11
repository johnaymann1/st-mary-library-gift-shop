/**
 * Orders Service
 * Centralized data access for all order-related operations.
 */
import { createClient } from '@/lib/supabase/server'
import type { Order } from '@/types'

export interface OrderFilter {
    status?: string
    userId?: string
}

export interface CreateOrderData {
    userId: string
    deliveryType: 'delivery' | 'pickup'
    address: string | null
    phone: string | null
    paymentMethod: 'cash' | 'instapay'
    paymentProofUrl: string | null
}

const ORDER_SELECT_QUERY = `
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
`

/**
 * Retrieves all orders for a specific user
 */
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('orders')
        .select(ORDER_SELECT_QUERY)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) {
        return []
    }

    return data as unknown as Order[]
}

/**
 * Retrieves a single order by ID
 */
export async function getOrderById(orderId: number): Promise<Order | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('orders')
        .select(ORDER_SELECT_QUERY)
        .eq('id', orderId)
        .single()

    if (error) {
        return null
    }

    return data as unknown as Order
}

/**
 * Retrieves all orders (admin) with optional filtering
 */
export async function getAllOrders(filter?: OrderFilter): Promise<Order[]> {
    const supabase = await createClient()

    let query = supabase
        .from('orders')
        .select(ORDER_SELECT_QUERY)
        .order('created_at', { ascending: false })

    if (filter?.status && filter.status !== 'all') {
        query = query.eq('status', filter.status)
    }
    if (filter?.userId) {
        query = query.eq('user_id', filter.userId)
    }

    const { data, error } = await query

    if (error) {
        return []
    }

    return data as unknown as Order[]
}

/**
 * Updates the status of an order
 */
export async function updateOrderStatus(orderId: number, status: string): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

/**
 * Cancels an order (sets status to 'cancelled')
 */
export async function cancelOrder(orderId: number): Promise<{ success?: boolean; error?: string }> {
    return updateOrderStatus(orderId, 'cancelled')
}

/**
 * Creates a new order using the place_order RPC
 */
export async function createOrder(data: CreateOrderData): Promise<{ orderId?: number; error?: string }> {
    const supabase = await createClient()

    const { data: orderId, error } = await supabase.rpc('place_order', {
        p_user_id: data.userId,
        p_delivery_type: data.deliveryType,
        p_address: data.address,
        p_phone: data.phone,
        p_delivery_date: null,
        p_payment_method: data.paymentMethod,
        p_payment_proof_url: data.paymentProofUrl
    })

    if (error) {
        return { error: error.message }
    }

    return { orderId }
}

/**
 * Gets order ownership info for authorization checks
 */
export async function getOrderOwnership(orderId: number): Promise<{ userId: string; status: string } | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('orders')
        .select('user_id, status')
        .eq('id', orderId)
        .single()

    if (error || !data) {
        return null
    }

    return { userId: data.user_id, status: data.status }
}

/**
 * Approves payment proof (sets status to 'processing')
 */
export async function approvePaymentProof(orderId: number): Promise<{ success?: boolean; error?: string }> {
    return updateOrderStatus(orderId, 'processing')
}

/**
 * Rejects payment proof (cancels order and clears proof)
 */
export async function rejectPaymentProof(orderId: number): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('orders')
        .update({
            status: 'cancelled',
            payment_proof_url: null
        })
        .eq('id', orderId)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

/**
 * Gets order details formatted for email sending
 */
export async function getOrderForEmail(orderId: number): Promise<{
    id: number
    total_amount: number
    delivery_address: string | null
    phone: string | null
    user_id: string
    items: Array<{ product_name: string; quantity: number; price: number }>
} | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('orders')
        .select(`
            id,
            total_amount,
            delivery_address,
            phone,
            user_id,
            order_items!inner(
                quantity,
                price,
                products!inner(name_en)
            )
        `)
        .eq('id', orderId)
        .single()

    if (error || !data) {
        return null
    }

    const items = (data.order_items as Array<{ products: { name_en: string } | { name_en: string }[], quantity: number, price: number }>).map((item) => {
        const product = Array.isArray(item.products) ? item.products[0] : item.products
        return {
            product_name: product?.name_en || 'Unknown Product',
            quantity: item.quantity,
            price: item.price
        }
    })

    return {
        id: data.id,
        total_amount: data.total_amount,
        delivery_address: data.delivery_address,
        phone: data.phone,
        user_id: data.user_id,
        items
    }
}
