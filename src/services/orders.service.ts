/**
 * Orders Service
 * Business logic layer for order management.
 * Uses orders repository for data access.
 */
import * as ordersRepo from './repositories/orders.repository'
import type { Order } from '@/types'

/**
 * Service result type
 */
export interface ServiceResult<T = void> {
    success: boolean
    data?: T
    error?: string
}

/**
 * Order filters
 */
export interface OrderFilter {
    status?: string
    userId?: string
}

/**
 * Order creation data
 */
export interface CreateOrderData {
    userId: string
    deliveryType: 'delivery' | 'pickup'
    address: string | null
    phone: string | null
    paymentMethod: 'cash' | 'instapay'
    paymentProofUrl: string | null
}

/**
 * Gets all orders for a specific user
 */
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
        return await ordersRepo.findOrdersByUserId(userId)
    } catch (error) {
        console.error('Get orders error:', error)
        return []
    }
}

/**
 * Gets a single order by ID
 */
export async function getOrderById(orderId: number): Promise<Order | null> {
    try {
        return await ordersRepo.findOrderById(orderId)
    } catch (error) {
        console.error('Get order error:', error)
        return null
    }
}

/**
 * Gets all orders with filtering (admin)
 */
export async function getAllOrders(filter?: OrderFilter): Promise<Order[]> {
    try {
        return await ordersRepo.findAllOrders(filter)
    } catch (error) {
        console.error('Get all orders error:', error)
        return []
    }
}

/**
 * Creates a new order
 */
export async function createOrder(data: CreateOrderData): Promise<ServiceResult<number>> {
    try {
        // Validate delivery data
        if (data.deliveryType === 'delivery' && !data.address) {
            return { success: false, error: 'Delivery address is required' }
        }

        if (!data.phone) {
            return { success: false, error: 'Phone number is required' }
        }

        // Validate InstaPay payment
        if (data.paymentMethod === 'instapay' && !data.paymentProofUrl) {
            return { success: false, error: 'Payment proof is required for InstaPay' }
        }

        const orderId = await ordersRepo.createOrder(data)
        return { success: true, data: orderId }
    } catch (error) {
        console.error('Create order error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create order'
        }
    }
}

/**
 * Updates order status
 */
export async function updateOrderStatus(
    orderId: number,
    status: string
): Promise<ServiceResult> {
    try {
        // Validate status
        const validStatuses = ['pending', 'processing', 'shipped', 'completed', 'cancelled']
        if (!validStatuses.includes(status)) {
            return { success: false, error: 'Invalid order status' }
        }

        await ordersRepo.updateOrderStatus(orderId, status)
        return { success: true }
    } catch (error) {
        console.error('Update order status error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update order status'
        }
    }
}

/**
 * Cancels an order (user action)
 */
export async function cancelOrder(
    orderId: number,
    userId: string
): Promise<ServiceResult> {
    try {
        // Verify ownership
        const ownership = await ordersRepo.findOrderOwnership(orderId)
        if (!ownership) {
            return { success: false, error: 'Order not found' }
        }

        if (ownership.userId !== userId) {
            return { success: false, error: 'Unauthorized to cancel this order' }
        }

        // Only allow cancellation of pending_payment and processing orders
        const cancellableStatuses = ['pending_payment', 'processing']
        if (!cancellableStatuses.includes(ownership.status)) {
            return { success: false, error: 'Only pending or processing orders can be cancelled' }
        }

        await ordersRepo.updateOrderStatus(orderId, 'cancelled')
        return { success: true }
    } catch (error) {
        console.error('Cancel order error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to cancel order'
        }
    }
}

/**
 * Approves payment proof (admin action)
 */
export async function approvePaymentProof(orderId: number): Promise<ServiceResult> {
    try {
        await ordersRepo.updateOrderStatus(orderId, 'processing')
        return { success: true }
    } catch (error) {
        console.error('Approve payment error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to approve payment'
        }
    }
}

/**
 * Rejects payment proof (admin action)
 */
export async function rejectPaymentProof(orderId: number): Promise<ServiceResult> {
    try {
        await ordersRepo.rejectOrderPayment(orderId)
        return { success: true }
    } catch (error) {
        console.error('Reject payment error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to reject payment'
        }
    }
}

/**
 * Gets order details formatted for email
 */
export async function getOrderForEmail(orderId: number): Promise<{
    id: number
    total_amount: number
    delivery_address: string | null
    phone: string | null
    user_id: string
    items: Array<{ product_name: string; quantity: number; price: number }>
} | null> {
    try {
        return await ordersRepo.findOrderForEmail(orderId)
    } catch (error) {
        console.error('Get order for email error:', error)
        return null
    }
}

/**
 * Verifies order ownership
 */
export async function verifyOrderOwnership(
    orderId: number,
    userId: string
): Promise<boolean> {
    try {
        const ownership = await ordersRepo.findOrderOwnership(orderId)
        return ownership?.userId === userId
    } catch (error) {
        console.error('Verify ownership error:', error)
        return false
    }
}

/**
 * Gets order statistics for dashboard
 */
export interface OrderStats {
    totalOrders: number
    pendingOrders: number
    completedOrders: number
    totalRevenue: number
}

export async function getOrderStats(): Promise<OrderStats> {
    try {
        const [total, pending, completed, revenue] = await Promise.all([
            ordersRepo.countOrders(),
            ordersRepo.countOrders({ status: 'pending' }),
            ordersRepo.countOrders({ status: 'completed' }),
            ordersRepo.calculateTotalRevenue()
        ])

        return {
            totalOrders: total,
            pendingOrders: pending,
            completedOrders: completed,
            totalRevenue: revenue
        }
    } catch (error) {
        console.error('Get order stats error:', error)
        return {
            totalOrders: 0,
            pendingOrders: 0,
            completedOrders: 0,
            totalRevenue: 0
        }
    }
}

/**
 * Gets recent orders for dashboard
 */
export async function getRecentOrders(limit: number = 5): Promise<Order[]> {
    try {
        return await ordersRepo.findRecentOrders(limit)
    } catch (error) {
        console.error('Get recent orders error:', error)
        return []
    }
}
