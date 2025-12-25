/**
 * Orders Repository
 * Pure database operations for order management.
 * Zero business logic - only data access.
 */
import { createClient } from '@/lib/supabase/server'
import type { Order } from '@/types'

/**
 * Order creation data
 */
export interface CreateOrderEntity {
    userId: string
    deliveryType: 'delivery' | 'pickup'
    address: string | null
    phone: string | null
    paymentMethod: 'cash' | 'instapay'
    paymentProofUrl: string | null
}

/**
 * Order query filters
 */
export interface OrderQueryFilters {
    status?: string
    userId?: string
    paymentMethod?: 'cash' | 'instapay'
    deliveryType?: 'delivery' | 'pickup'
    limit?: number
    offset?: number
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
 * Finds all orders for a specific user
 */
export async function findOrdersByUserId(userId: string): Promise<Order[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('orders')
        .select(ORDER_SELECT_QUERY)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch orders: ${error.message}`)

    return data as unknown as Order[]
}

/**
 * Finds a single order by ID
 */
export async function findOrderById(orderId: number): Promise<Order | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('orders')
        .select(ORDER_SELECT_QUERY)
        .eq('id', orderId)
        .maybeSingle()

    if (error) throw new Error(`Failed to fetch order: ${error.message}`)

    return data as unknown as Order | null
}

/**
 * Finds all orders with optional filtering (admin)
 */
export async function findAllOrders(filters?: OrderQueryFilters): Promise<Order[]> {
    const supabase = await createClient()

    let query = supabase
        .from('orders')
        .select(ORDER_SELECT_QUERY)
        .order('created_at', { ascending: false })

    // Apply filters
    if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
    }
    if (filters?.userId) {
        query = query.eq('user_id', filters.userId)
    }
    if (filters?.paymentMethod) {
        query = query.eq('payment_method', filters.paymentMethod)
    }
    if (filters?.deliveryType) {
        query = query.eq('delivery_type', filters.deliveryType)
    }

    // Apply pagination
    if (filters?.limit) {
        query = query.limit(filters.limit)
    }
    if (filters?.offset && filters?.limit) {
        query = query.range(filters.offset, filters.offset + filters.limit - 1)
    }

    const { data, error } = await query

    if (error) throw new Error(`Failed to fetch all orders: ${error.message}`)

    return data as unknown as Order[]
}

/**
 * Gets order ownership information (for authorization)
 */
export async function findOrderOwnership(orderId: number): Promise<{
    userId: string
    status: string
} | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('orders')
        .select('user_id, status')
        .eq('id', orderId)
        .maybeSingle()

    if (error) throw new Error(`Failed to fetch order ownership: ${error.message}`)

    return data ? { userId: data.user_id, status: data.status } : null
}

/**
 * Creates a new order using the database RPC function
 */
export async function createOrder(entity: CreateOrderEntity): Promise<number> {
    const supabase = await createClient()

    const { data: orderId, error } = await supabase.rpc('place_order', {
        p_user_id: entity.userId,
        p_delivery_type: entity.deliveryType,
        p_address: entity.address,
        p_phone: entity.phone,
        p_delivery_date: null,
        p_payment_method: entity.paymentMethod,
        p_payment_proof_url: entity.paymentProofUrl
    })

    if (error) throw new Error(`Failed to create order: ${error.message}`)

    return orderId as number
}

/**
 * Updates order status
 */
export async function updateOrderStatus(orderId: number, status: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

    if (error) throw new Error(`Failed to update order status: ${error.message}`)
}

/**
 * Updates order payment proof URL
 */
export async function updatePaymentProof(orderId: number, proofUrl: string | null): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('orders')
        .update({ payment_proof_url: proofUrl })
        .eq('id', orderId)

    if (error) throw new Error(`Failed to update payment proof: ${error.message}`)
}

/**
 * Updates order status and clears payment proof (reject payment)
 */
export async function rejectOrderPayment(orderId: number): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('orders')
        .update({
            status: 'cancelled',
            payment_proof_url: null
        })
        .eq('id', orderId)

    if (error) throw new Error(`Failed to reject payment: ${error.message}`)
}

/**
 * Gets order details for email notification
 */
export async function findOrderForEmail(orderId: number): Promise<{
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
                price_at_purchase,
                products!inner(name_en)
            )
        `)
        .eq('id', orderId)
        .maybeSingle()

    if (error) throw new Error(`Failed to fetch order for email: ${error.message}`)
    if (!data) return null

    const items = (data.order_items as Array<{
        products: { name_en: string } | { name_en: string }[]
        quantity: number
        price_at_purchase: number
    }>).map((item) => {
        const product = Array.isArray(item.products) ? item.products[0] : item.products
        return {
            product_name: product?.name_en || 'Unknown Product',
            quantity: item.quantity,
            price: item.price_at_purchase
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

/**
 * Counts total orders
 */
export async function countOrders(filters?: Pick<OrderQueryFilters, 'status' | 'userId'>): Promise<number> {
    const supabase = await createClient()

    let query = supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

    if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
    }
    if (filters?.userId) {
        query = query.eq('user_id', filters.userId)
    }

    const { count, error } = await query

    if (error) throw new Error(`Failed to count orders: ${error.message}`)

    return count || 0
}

/**
 * Calculates total revenue (sum of completed order amounts)
 */
export async function calculateTotalRevenue(): Promise<number> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed')

    if (error) throw new Error(`Failed to calculate revenue: ${error.message}`)

    return data.reduce((sum, order) => sum + order.total_amount, 0)
}

/**
 * Gets recent orders (dashboard widget)
 */
export async function findRecentOrders(limit: number = 5): Promise<Order[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('orders')
        .select(ORDER_SELECT_QUERY)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw new Error(`Failed to fetch recent orders: ${error.message}`)

    return data as unknown as Order[]
}
