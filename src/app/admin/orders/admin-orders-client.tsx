'use client'

import { useState, useEffect } from 'react'
import { Order } from '@/types'
import { updateOrderStatus, approvePaymentProof, rejectPaymentProof, cancelOrderByAdmin } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Eye, CheckCircle, ShoppingBag, Package, Ban } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/config/site'
import {
    OrderStatsCards,
    OrderFilterBar,
    PaymentVerifyModal,
    CancelOrderModal
} from '@/components/modules/admin/orders'

export default function AdminOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>(initialOrders)
    const [filter, setFilter] = useState('all')
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
        if (filter === 'all') return true
        return order.status === filter
    })

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending_payment': return 'bg-amber-100 text-amber-800 border-amber-200'
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'out_for_delivery': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
            case 'ready_for_pickup': return 'bg-purple-100 text-purple-800 border-purple-200'
            case 'completed': return 'bg-green-100 text-green-800 border-green-200'
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getStatusLabel = (status: string) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

    // Stats
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending_payment').length,
        processing: orders.filter(o => ['processing', 'out_for_delivery', 'ready_for_pickup'].includes(o.status)).length,
        completed: orders.filter(o => o.status === 'completed').length,
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <OrderStatsCards {...stats} />

            {/* Filters */}
            <OrderFilterBar
                filter={filter}
                onFilterChange={setFilter}
                filteredCount={filteredOrders.length}
                totalCount={orders.length}
            />

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                {/* Mobile scroll wrapper */}
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed min-w-[1200px]">
                        <thead className="bg-neutral-50 border-b border-neutral-100">
                            <tr>
                                <th className="w-20 px-4 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Order</th>
                                <th className="w-44 px-4 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Customer</th>
                                <th className="w-32 px-4 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Items</th>
                                <th className="w-28 px-4 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Date</th>
                                <th className="w-28 px-4 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Total</th>
                                <th className="w-40 px-4 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</th>
                                <th className="w-24 px-4 py-4 text-center text-xs font-semibold text-neutral-600 uppercase tracking-wider">View</th>
                                <th className="w-28 px-4 py-4 text-center text-xs font-semibold text-neutral-600 uppercase tracking-wider">Verify</th>
                                <th className="w-48 px-4 py-4 text-center text-xs font-semibold text-neutral-600 uppercase tracking-wider">Change Status</th>
                                <th className="w-28 px-4 py-4 text-center text-xs font-semibold text-neutral-600 uppercase tracking-wider">Cancel</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-6 py-16 text-center">
                                        <ShoppingBag className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                                        <p className="text-neutral-500 font-medium">No orders found matching the filter</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="px-4 py-4">
                                            <span className="font-semibold text-neutral-900">#{order.id}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="truncate">
                                                <p className="font-medium text-neutral-900 truncate">{order.user?.full_name || 'Guest'}</p>
                                                <p className="text-sm text-neutral-500 truncate">{order.user?.email || order.user?.phone || 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {order.items?.slice(0, 2).map((item) => (
                                                        <div key={item.id} className="relative w-7 h-7 rounded-lg border-2 border-white bg-neutral-50 overflow-hidden shadow-sm">
                                                            {item.product?.image_url ? (
                                                                <Image
                                                                    src={item.product.image_url}
                                                                    alt={item.product.name_en}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Package className="h-3 w-3 text-neutral-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-xs font-medium text-neutral-900">
                                                    {order.items?.length || 0}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-neutral-600 whitespace-nowrap">
                                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="font-semibold text-neutral-900 text-sm whitespace-nowrap">
                                                {order.total_amount.toLocaleString()} <span className="text-xs font-medium text-neutral-500">{siteConfig.currency.code}</span>
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <Badge variant="secondary" className={`${getStatusColor(order.status)} border-0 text-xs`}>
                                                {getStatusLabel(order.status)}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                                className="border-2 border-neutral-400 hover:bg-neutral-100 hover:border-neutral-500 text-neutral-800 h-8 px-2 font-semibold"
                                            >
                                                <Link href={`/orders/${order.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            {order.payment_method === 'instapay' && order.payment_proof_url && order.status === 'pending_payment' ? (
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-medium h-8 px-2"
                                                    onClick={() => {
                                                        setSelectedOrder(order)
                                                        setIsVerifyModalOpen(true)
                                                    }}
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <span className="text-xs text-neutral-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <Select
                                                value={order.status}
                                                onValueChange={(newStatus) => handleStatusUpdate(order.id, newStatus)}
                                                disabled={updating || order.status === 'cancelled'}
                                            >
                                                <SelectTrigger className="w-full h-8 bg-white border-neutral-200 text-neutral-900 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border-neutral-200">
                                                    {order.payment_method === 'instapay' && (
                                                        <SelectItem value="pending_payment" className="text-neutral-900 text-xs">Pending Payment</SelectItem>
                                                    )}
                                                    <SelectItem value="processing" className="text-neutral-900 text-xs">Processing</SelectItem>
                                                    {order.delivery_type === 'delivery' ? (
                                                        <SelectItem value="out_for_delivery" className="text-neutral-900 text-xs">Out for Delivery</SelectItem>
                                                    ) : (
                                                        <SelectItem value="ready_for_pickup" className="text-neutral-900 text-xs">Ready for Pickup</SelectItem>
                                                    )}
                                                    <SelectItem value="completed" className="text-neutral-900 text-xs">Completed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            {!['cancelled', 'completed'].includes(order.status) ? (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-2 border-red-300 hover:bg-red-50 hover:border-red-400 text-red-700 font-semibold h-8 px-2"
                                                    onClick={() => {
                                                        setSelectedOrder(order)
                                                        setIsCancelModalOpen(true)
                                                    }}
                                                    disabled={updating}
                                                >
                                                    <Ban className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <span className="text-xs text-neutral-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <PaymentVerifyModal
                open={isVerifyModalOpen}
                onOpenChange={setIsVerifyModalOpen}
                order={selectedOrder}
                updating={updating}
                onVerify={handleVerifyPayment}
            />

            <CancelOrderModal
                open={isCancelModalOpen}
                onOpenChange={setIsCancelModalOpen}
                order={selectedOrder}
                cancelReason={cancelReason}
                onCancelReasonChange={setCancelReason}
                updating={updating}
                onConfirm={handleCancelOrder}
            />
        </div>
    )
}