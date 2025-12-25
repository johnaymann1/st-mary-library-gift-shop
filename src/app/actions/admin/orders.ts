'use server'

import { revalidatePath } from 'next/cache'
import * as orderService from '@/services/orders'
import * as userService from '@/services/users'

/**
 * Admin Order Actions
 * Server-side only functions for order management
 */

/**
 * Gets all orders (admin)
 */
export async function getAllOrders(): Promise<{ orders?: ReturnType<typeof orderService.getAllOrders> extends Promise<infer T> ? T : never; error?: string }> {
    const user = await userService.getCurrentUser()
    if (!user) return { error: 'Unauthorized' }

    const isAdmin = await userService.isCurrentUserAdmin()
    if (!isAdmin) return { error: 'Unauthorized' }

    const orders = await orderService.getAllOrders()
    if (!orders) {
        return { error: 'Failed to fetch orders' }
    }
    return { orders }
}

/**
 * Updates order status
 */
export async function updateOrderStatus(orderId: number, status: string) {
    const user = await userService.getCurrentUser()
    if (!user) return { error: 'Unauthorized' }

    const isAdmin = await userService.isCurrentUserAdmin()
    if (!isAdmin) return { error: 'Unauthorized' }

    const result = await orderService.updateOrderStatus(orderId, status)

    if (result.success) {
        revalidatePath('/admin/orders')
    }

    return result
}

/**
 * Approves payment proof
 */
export async function approvePaymentProof(orderId: number) {
    const user = await userService.getCurrentUser()
    if (!user) return { error: 'Unauthorized' }

    const isAdmin = await userService.isCurrentUserAdmin()
    if (!isAdmin) return { error: 'Unauthorized' }

    const result = await orderService.approvePaymentProof(orderId)

    if (result.success) {
        revalidatePath('/admin/orders')
    }

    return result
}

/**
 * Rejects payment proof
 */
export async function rejectPaymentProof(orderId: number, reason?: string) {
    const user = await userService.getCurrentUser()
    if (!user) return { error: 'Unauthorized' }

    const isAdmin = await userService.isCurrentUserAdmin()
    if (!isAdmin) return { error: 'Unauthorized' }

    const result = await orderService.rejectPaymentProof(orderId)

    if (result.success) {
        revalidatePath('/admin/orders')
    }

    return result
}

/**
 * Cancels an order by admin
 */
export async function cancelOrderByAdmin(orderId: number, reason?: string) {
    const user = await userService.getCurrentUser()
    if (!user) return { error: 'Unauthorized' }

    const isAdmin = await userService.isCurrentUserAdmin()
    if (!isAdmin) return { error: 'Unauthorized' }

    const result = await orderService.cancelOrder(orderId)

    if (result.success) {
        revalidatePath('/admin/orders')
    }

    return result
}
