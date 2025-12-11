'use server'

import { revalidatePath } from 'next/cache'
import type { Order } from '@/types'
import * as orderService from '@/services/orders'
import * as userService from '@/services/users'

/**
 * Gets all orders for the current authenticated user
 */
export async function getUserOrders(): Promise<Order[]> {
    const user = await userService.getCurrentUser()
    if (!user) return []

    return orderService.getOrdersByUserId(user.id)
}

/**
 * Gets order details with authorization check
 */
export async function getOrderDetails(orderId: number): Promise<{ order?: Order; error?: string }> {
    const user = await userService.getCurrentUser()
    if (!user) return { error: 'Unauthorized' }

    const isAdmin = await userService.isCurrentUserAdmin()
    const order = await orderService.getOrderById(orderId)

    if (!order) {
        return { error: 'Order not found' }
    }

    // Security check: User can only see their own orders unless they are admin
    if (order.user_id !== user.id && !isAdmin) {
        return { error: 'Unauthorized' }
    }

    return { order }
}

/**
 * Gets all orders (admin only)
 */
export async function getAllOrders(statusFilter?: string): Promise<{ orders?: Order[]; error?: string }> {
    const user = await userService.getCurrentUser()
    if (!user) return { error: 'Unauthorized' }

    const isAdmin = await userService.isCurrentUserAdmin()
    if (!isAdmin) {
        return { error: 'Unauthorized' }
    }

    const orders = await orderService.getAllOrders({ status: statusFilter })
    return { orders }
}

/**
 * Updates order status (admin only)
 */
export async function updateOrderStatus(orderId: number, status: string): Promise<{ success?: boolean; error?: string }> {
    const user = await userService.getCurrentUser()
    if (!user) return { error: 'Unauthorized' }

    const isAdmin = await userService.isCurrentUserAdmin()
    if (!isAdmin) {
        return { error: 'Unauthorized' }
    }

    const result = await orderService.updateOrderStatus(orderId, status)

    if (result.success) {
        revalidatePath('/admin/orders')
        revalidatePath(`/orders/${orderId}`)
    }

    return result
}

/**
 * Cancels an order (user can only cancel their own pending orders)
 */
export async function cancelOrder(orderId: number): Promise<{ success?: boolean; error?: string }> {
    const user = await userService.getCurrentUser()
    if (!user) return { error: 'Unauthorized' }

    const ownership = await orderService.getOrderOwnership(orderId)
    if (!ownership) return { error: 'Order not found' }

    // Check if user owns the order
    if (ownership.userId !== user.id) return { error: 'Unauthorized' }

    // Check if order can be cancelled (only pending_payment or processing)
    const cancellableStatuses = ['pending_payment', 'processing']
    if (!cancellableStatuses.includes(ownership.status)) {
        return { error: 'This order cannot be cancelled' }
    }

    const result = await orderService.cancelOrder(orderId)

    if (result.success) {
        revalidatePath('/orders')
        revalidatePath(`/orders/${orderId}`)
    }

    return result
}

/**
 * Verifies payment (admin only)
 */
export async function verifyPayment(orderId: number, approved: boolean): Promise<{ success?: boolean; error?: string }> {
    const user = await userService.getCurrentUser()
    if (!user) return { error: 'Unauthorized' }

    const isAdmin = await userService.isCurrentUserAdmin()
    if (!isAdmin) {
        return { error: 'Unauthorized' }
    }

    const status = approved ? 'processing' : 'cancelled'
    const result = await orderService.updateOrderStatus(orderId, status)

    if (result.success) {
        revalidatePath('/admin/orders')
        revalidatePath(`/orders/${orderId}`)
    }

    return result
}
