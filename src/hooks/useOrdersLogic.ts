'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Order } from '@/types'
import { updateOrderStatus, approvePaymentProof, rejectPaymentProof, cancelOrderByAdmin } from '@/app/actions/admin/orders'
import { toast } from 'sonner'

export function useOrdersLogic(initialOrders: Order[]) {
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>(initialOrders)
    const [filter, setFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
    const [cancelReason, setCancelReason] = useState('')
    const [updating, setUpdating] = useState(false)

    // Auto-refresh orders every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh()
        }, 10000)
        return () => clearInterval(interval)
    }, [router])

    // Update local state when initialOrders changes
    useEffect(() => {
        setOrders(initialOrders)
    }, [initialOrders])

    const filteredOrders = orders.filter(order => {
        // Filter by status
        if (filter !== 'all' && order.status !== filter) return false
        
        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            const orderId = order.id.toString()
            const customerName = order.user?.full_name?.toLowerCase() || ''
            const customerEmail = order.user?.email?.toLowerCase() || ''
            const customerPhone = order.user?.phone?.toLowerCase() || ''
            const deliveryPhone = order.phone?.toLowerCase() || ''
            
            return orderId.includes(query) ||
                   customerName.includes(query) ||
                   customerEmail.includes(query) ||
                   customerPhone.includes(query) ||
                   deliveryPhone.includes(query)
        }
        
        return true
    })

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending_payment').length,
        processing: orders.filter(o => ['processing', 'out_for_delivery', 'ready_for_pickup'].includes(o.status)).length,
        completed: orders.filter(o => o.status === 'completed').length,
    }

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        setUpdating(true)
        const result = await updateOrderStatus(orderId, newStatus)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Order status updated')
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o))
        }
        setUpdating(false)
    }

    const handleVerifyPayment = async (approved: boolean) => {
        if (!selectedOrder) return

        setUpdating(true)
        const result = approved
            ? await approvePaymentProof(selectedOrder.id)
            : await rejectPaymentProof(selectedOrder.id, 'Payment proof rejected by admin')

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(approved ? 'Payment approved - Order moved to processing' : 'Payment rejected - Order cancelled')
            const newStatus = approved ? 'processing' : 'cancelled'
            setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o))
            setIsVerifyModalOpen(false)
            setSelectedOrder(null)
        }
        setUpdating(false)
    }

    const handleCancelOrder = async () => {
        if (!selectedOrder) return

        setUpdating(true)
        const result = await cancelOrderByAdmin(selectedOrder.id, cancelReason || undefined)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Order cancelled successfully')
            setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: 'cancelled' } : o))
            setIsCancelModalOpen(false)
            setSelectedOrder(null)
            setCancelReason('')
        }
        setUpdating(false)
    }

    const openVerifyModal = (order: Order) => {
        setSelectedOrder(order)
        setIsVerifyModalOpen(true)
    }

    const openCancelModal = (order: Order) => {
        setSelectedOrder(order)
        setIsCancelModalOpen(true)
    }

    return {
        orders,
        filteredOrders,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        selectedOrder,
        isVerifyModalOpen,
        setIsVerifyModalOpen,
        isCancelModalOpen,
        setIsCancelModalOpen,
        cancelReason,
        setCancelReason,
        updating,
        stats,
        handleStatusUpdate,
        handleVerifyPayment,
        handleCancelOrder,
        openVerifyModal,
        openCancelModal
    }
}
