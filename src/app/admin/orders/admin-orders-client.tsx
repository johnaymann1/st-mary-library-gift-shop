'use client'

import { useState } from 'react'
import { Order } from '@/types'
import { updateOrderStatus, approvePaymentProof, rejectPaymentProof, cancelOrderByAdmin } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Eye, CheckCircle, XCircle, Filter, ShoppingBag, AlertCircle, Package, CheckCircle2, Ban } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/config/site'

export default function AdminOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders)
    const [filter, setFilter] = useState('all')
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
    const [cancelReason, setCancelReason] = useState('')
    const [updating, setUpdating] = useState(false)

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
            // Optimistic update
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
            toast.success(approved ? 'Payment approved - Order moved to processing' : 'Payment rejected - Order returned to pending payment')
            // Optimistic update
            const newStatus = approved ? 'processing' : 'pending_payment'
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
            // Optimistic update
            setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: 'cancelled' } : o))
            setIsCancelModalOpen(false)
            setSelectedOrder(null)
            setCancelReason('')
        }
        setUpdating(false)
    }

    const openCancelModal = (order: Order) => {
        setSelectedOrder(order)
        setIsCancelModalOpen(true)
    }

    const openVerifyModal = (order: Order) => {
        setSelectedOrder(order)
        setIsVerifyModalOpen(true)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending_payment': return 'bg-amber-100 text-amber-800 border-amber-200'
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'out_for_delivery': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
            case 'ready_for_pickup': return 'bg-purple-100 text-purple-800 border-purple-200'
            case 'completed': return 'bg-green-100 text-green-800 border-green-200'
            case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-600 mb-1">Total Orders</p>
                            <p className="text-3xl font-bold text-neutral-900">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-neutral-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-600 mb-1">Pending Review</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-600 mb-1">In Progress</p>
                            <p className="text-3xl font-bold text-indigo-600">{stats.processing}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Package className="h-6 w-6 text-indigo-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-600 mb-1">Completed</p>
                            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center">
                        <Filter className="h-5 w-5 text-neutral-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-neutral-900">Filter Orders</p>
                        <p className="text-sm text-neutral-600">Showing {filteredOrders.length} of {orders.length} orders</p>
                    </div>
                </div>
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-full sm:w-[220px] h-11 bg-white border-neutral-200 text-neutral-900">
                        <SelectValue placeholder="All Orders" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-neutral-200">
                        <SelectItem value="all" className="text-neutral-900">All Orders</SelectItem>
                        <SelectItem value="pending_payment" className="text-neutral-900">Pending Payment</SelectItem>
                        <SelectItem value="processing" className="text-neutral-900">Processing</SelectItem>
                        <SelectItem value="out_for_delivery" className="text-neutral-900">Out for Delivery</SelectItem>
                        <SelectItem value="ready_for_pickup" className="text-neutral-900">Ready for Pickup</SelectItem>
                        <SelectItem value="completed" className="text-neutral-900">Completed</SelectItem>
                        <SelectItem value="cancelled" className="text-neutral-900">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
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
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-neutral-900">#{order.id}</span>
                                            </div>
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

                                        {/* View Column */}
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

                                        {/* Payment Verify Column */}
                                        <td className="px-4 py-4 text-center">
                                            {order.payment_method === 'instapay' && order.payment_proof_url && order.status === 'pending_payment' ? (
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-medium h-8 px-2"
                                                    onClick={() => openVerifyModal(order)}
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <span className="text-xs text-neutral-400">—</span>
                                            )}
                                        </td>

                                        {/* Change Status Column - Dropdown */}
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
                                                    {/* Only show pending_payment for InstaPay orders */}
                                                    {order.payment_method === 'instapay' && (
                                                        <SelectItem value="pending_payment" className="text-neutral-900 text-xs">Pending Payment</SelectItem>
                                                    )}
                                                    <SelectItem value="processing" className="text-neutral-900 text-xs">Processing</SelectItem>
                                                    {/* Show different statuses based on delivery type */}
                                                    {order.delivery_type === 'delivery' ? (
                                                        <SelectItem value="out_for_delivery" className="text-neutral-900 text-xs">Out for Delivery</SelectItem>
                                                    ) : (
                                                        <SelectItem value="ready_for_pickup" className="text-neutral-900 text-xs">Ready for Pickup</SelectItem>
                                                    )}
                                                    <SelectItem value="completed" className="text-neutral-900 text-xs">Completed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>

                                        {/* Cancel Column */}
                                        <td className="px-4 py-4 text-center">
                                            {!['cancelled', 'completed'].includes(order.status) ? (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-2 border-red-300 hover:bg-red-50 hover:border-red-400 text-red-700 font-semibold h-8 px-2"
                                                    onClick={() => openCancelModal(order)}
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

            {/* Payment Verification Modal */}
            <Dialog open={isVerifyModalOpen} onOpenChange={setIsVerifyModalOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Verify Payment Proof</DialogTitle>
                        <DialogDescription>
                            Review the InstaPay transfer screenshot for <span className="font-semibold text-neutral-900">Order #{selectedOrder?.id}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="my-4 max-h-[60vh] overflow-auto">
                        {selectedOrder?.payment_proof_url ? (
                            <div className="space-y-4">
                                <div className="relative w-full bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm" style={{ minHeight: '400px' }}>
                                    <Image
                                        src={selectedOrder.payment_proof_url}
                                        alt="Payment Proof"
                                        width={800}
                                        height={1200}
                                        className="w-full h-auto object-contain"
                                        unoptimized
                                    />
                                </div>
                                <a
                                    href={selectedOrder.payment_proof_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <Eye className="h-4 w-4" />
                                    Open image in new tab
                                </a>
                            </div>
                        ) : (
                            <div className="p-12 text-center text-neutral-500 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200">
                                <XCircle className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                                <p className="font-medium">No payment proof uploaded</p>
                                <p className="text-sm mt-2">The customer hasn't uploaded a payment screenshot yet.</p>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-2">
                        <Button
                            variant="outline"
                            onClick={() => handleVerifyPayment(false)}
                            disabled={updating || !selectedOrder?.payment_proof_url}
                            className="flex-1 border-2 border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-400 font-semibold"
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white flex-1 shadow-sm"
                            onClick={() => handleVerifyPayment(true)}
                            disabled={updating || !selectedOrder?.payment_proof_url}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cancel Order Modal */}
            <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <Ban className="h-8 w-8 text-red-600" />
                        </div>
                        <DialogTitle className="text-2xl text-center">Cancel Order?</DialogTitle>
                        <DialogDescription className="text-center text-base">
                            You are about to cancel <span className="font-bold text-neutral-900">Order #{selectedOrder?.id}</span>
                            <br />
                            <span className="text-sm">This action cannot be undone.</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="my-6">
                        <div className="bg-neutral-50 rounded-xl p-4 space-y-3 border border-neutral-200">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-neutral-600">Customer</span>
                                <span className="text-sm font-semibold text-neutral-900">{selectedOrder?.user?.full_name || 'Guest'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-neutral-600">Total Amount</span>
                                <span className="text-sm font-semibold text-neutral-900">
                                    {selectedOrder?.total_amount.toLocaleString()} {siteConfig.currency.code}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-neutral-600">Items</span>
                                <span className="text-sm font-semibold text-neutral-900">{selectedOrder?.items?.length || 0} items</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="text-sm font-semibold text-neutral-900 mb-3 block">
                                Cancellation Reason (Optional)
                            </label>
                            <Textarea
                                placeholder="E.g., Out of stock, customer request, payment issue..."
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                rows={3}
                                className="resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                            <p className="text-xs text-neutral-500 mt-2 flex items-start gap-1.5">
                                <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                                <span>Customer will be notified about the cancellation.</span>
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-3 sm:gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCancelModalOpen(false)
                                setCancelReason('')
                            }}
                            disabled={updating}
                            className="flex-1 h-11 border-2 hover:bg-neutral-50 font-semibold"
                        >
                            Keep Order
                        </Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white flex-1 h-11 shadow-lg shadow-red-600/20 font-semibold"
                            onClick={handleCancelOrder}
                            disabled={updating}
                        >
                            {updating ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Ban className="mr-2 h-4 w-4" />
                                    Cancel Order
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}