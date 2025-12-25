import { Order } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, ShoppingBag, Package, Ban } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/config/site'
import { CheckCircle } from 'lucide-react'

interface OrdersTableProps {
    orders: Order[]
    updating: boolean
    onStatusUpdate: (orderId: number, newStatus: string) => void
    onVerifyClick: (order: Order) => void
    onCancelClick: (order: Order) => void
}

function getStatusColor(status: string) {
    switch (status) {
        case 'pending_payment': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
        case 'processing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
        case 'out_for_delivery': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
        case 'ready_for_pickup': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
        case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800'
        case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
        default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800'
    }
}

function getStatusLabel(status: string) {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export function OrdersTable({ orders, updating, onStatusUpdate, onVerifyClick, onCancelClick }: OrdersTableProps) {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors">
            <div className="overflow-x-auto">
                <table className="w-full table-fixed min-w-[1200px]">
                    <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
                        <tr>
                            <th className="w-20 px-4 py-4 text-left text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider transition-colors">Order</th>
                            <th className="w-44 px-4 py-4 text-left text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider transition-colors">Customer</th>
                            <th className="w-32 px-4 py-4 text-left text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider transition-colors">Items</th>
                            <th className="w-28 px-4 py-4 text-left text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider transition-colors">Date</th>
                            <th className="w-28 px-4 py-4 text-left text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider transition-colors">Total</th>
                            <th className="w-40 px-4 py-4 text-left text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider transition-colors">Status</th>
                            <th className="w-24 px-4 py-4 text-center text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider transition-colors">View</th>
                            <th className="w-28 px-4 py-4 text-center text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider transition-colors">Verify</th>
                            <th className="w-48 px-4 py-4 text-center text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider transition-colors">Change Status</th>
                            <th className="w-28 px-4 py-4 text-center text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider transition-colors">Cancel</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="px-6 py-16 text-center">
                                    <ShoppingBag className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3 transition-colors" />
                                    <p className="text-neutral-600 dark:text-neutral-400 font-medium transition-colors">No orders found matching the filter</p>
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                    <td className="px-4 py-4">
                                        <span className="font-semibold text-neutral-900 dark:text-white transition-colors">#{order.id}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="truncate">
                                            <p className="font-medium text-neutral-900 dark:text-white truncate transition-colors">{order.user?.full_name || 'Guest'}</p>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate transition-colors">{order.user?.email || order.user?.phone || 'N/A'}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-2">
                                                {order.items?.slice(0, 2).map((item) => (
                                                    <div key={item.id} className="relative w-7 h-7 rounded-lg border-2 border-white dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-800 overflow-hidden shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700">
                                                        {item.product?.image_url ? (
                                                            <Image
                                                                src={item.product.image_url}
                                                                alt={item.product.name_en}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Package className="h-3 w-3 text-neutral-400 dark:text-neutral-500" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-xs font-medium text-neutral-900 dark:text-white transition-colors">
                                                {order.items?.length || 0}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap transition-colors">
                                            {new Date(order.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="font-semibold text-neutral-900 dark:text-white text-sm whitespace-nowrap transition-colors">
                                            {order.total_amount.toLocaleString()} <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 transition-colors">{siteConfig.currency.code}</span>
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
                                            className="border-2 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-neutral-400 dark:hover:border-neutral-500 text-neutral-700 dark:text-neutral-300 h-8 px-2 font-semibold transition-all"
                                        >
                                            <Link href={`/orders/${order.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        {order.payment_method === 'instapay' && order.payment_proof_url ? (
                                            <Button
                                                size="sm"
                                                className={order.status === 'pending_payment' 
                                                    ? "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white shadow-sm font-medium h-8 px-2 transition-colors"
                                                    : "bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 shadow-sm font-medium h-8 px-2 transition-colors"
                                                }
                                                onClick={() => onVerifyClick(order)}
                                            >
                                                {order.status === 'pending_payment' ? (
                                                    <CheckCircle className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        ) : (
                                            <span className="text-xs text-neutral-400 dark:text-neutral-500">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <Select
                                            value={order.status}
                                            onValueChange={(newStatus) => onStatusUpdate(order.id, newStatus)}
                                            disabled={updating || order.status === 'cancelled'}
                                        >
                                            <SelectTrigger className="w-full h-8 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs transition-colors">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                                                {order.payment_method === 'instapay' && (
                                                    <SelectItem value="pending_payment" className="text-neutral-900 dark:text-white text-xs focus:bg-neutral-100 dark:focus:bg-neutral-700">Pending Payment</SelectItem>
                                                )}
                                                <SelectItem value="processing" className="text-neutral-900 dark:text-white text-xs focus:bg-neutral-100 dark:focus:bg-neutral-700">Processing</SelectItem>
                                                {order.delivery_type === 'delivery' ? (
                                                    <SelectItem value="out_for_delivery" className="text-neutral-900 dark:text-white text-xs focus:bg-neutral-100 dark:focus:bg-neutral-700">Out for Delivery</SelectItem>
                                                ) : (
                                                    <SelectItem value="ready_for_pickup" className="text-neutral-900 dark:text-white text-xs focus:bg-neutral-100 dark:focus:bg-neutral-700">Ready for Pickup</SelectItem>
                                                )}
                                                <SelectItem value="completed" className="text-neutral-900 dark:text-white text-xs focus:bg-neutral-100 dark:focus:bg-neutral-700">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        {!['cancelled', 'completed'].includes(order.status) ? (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-2 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-400 dark:hover:border-red-600 text-red-700 dark:text-red-400 font-semibold h-8 px-2 transition-colors"
                                                onClick={() => onCancelClick(order)}
                                                disabled={updating}
                                            >
                                                <Ban className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <span className="text-xs text-neutral-400 dark:text-neutral-500">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
