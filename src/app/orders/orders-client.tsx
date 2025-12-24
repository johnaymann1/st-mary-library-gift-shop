'use client'

import { getUserOrders } from '@/app/actions/orders'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { Package, ChevronRight, ArrowLeft } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { useEffect, useState } from 'react'
import type { Order } from '@/types'

interface OrdersPageClientProps {
    initialOrders: Order[]
}

export default function OrdersPageClient({ initialOrders }: OrdersPageClientProps) {
    const [orders, setOrders] = useState<Order[]>(initialOrders)

    // Auto-refresh orders every 10 seconds for status updates
    useEffect(() => {
        const interval = setInterval(async () => {
            const fetchedOrders = await getUserOrders()
            setOrders(fetchedOrders)
        }, 10000)
        return () => clearInterval(interval)
    }, [])

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
        const labels: Record<string, string> = {
            'pending_payment': 'Pending Payment',
            'processing': 'Processing',
            'out_for_delivery': 'Out for Delivery',
            'ready_for_pickup': 'Ready for Pickup',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        }
        return labels[status] || status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900 transition-colors">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <Button variant="ghost" asChild className="mb-6 -ml-4 text-neutral-600 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                    <Link href="/" className="flex items-center gap-2">
                        <ArrowLeft className="h-5 w-5" />
                        Back to Home
                    </Link>
                </Button>
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-3 transition-colors">My Orders</h1>
                    <p className="text-neutral-600 dark:text-neutral-300 text-lg transition-colors">Track and manage your orders</p>
                </div>

                {orders.length === 0 ? (
                    <EmptyState
                        icon="orders"
                        title="No orders yet"
                        description="Treat yourself today! Start exploring our collection."
                        actionLabel="Start Shopping"
                        actionHref="/"
                    />
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <Link key={order.id} href={`/orders/${order.id}`} className="block group">
                                <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-neutral-100 dark:border-neutral-800">
                                    <div className="p-8">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            {/* Left: Order Info */}
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            <span className="text-xl font-bold text-neutral-900 dark:text-white transition-colors">Order #{order.id}</span>
                                                            <Badge variant="secondary" className={`${getStatusColor(order.status)} border-0 px-4 py-1.5 font-semibold shadow-sm transition-colors`}>
                                                                {getStatusLabel(order.status)}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 transition-colors">
                                                            {new Date(order.created_at).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-300 transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <Package className="h-4 w-4 text-neutral-400 dark:text-neutral-500 transition-colors" />
                                                        <span>{order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Amount & Action */}
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1 font-medium transition-colors">Total Amount</p>
                                                    <p className="text-3xl font-bold text-neutral-900 dark:text-white transition-colors">
                                                        {order.total_amount.toLocaleString()}
                                                        <span className="text-lg font-medium text-neutral-500 dark:text-neutral-400 ml-1 transition-colors">{siteConfig.currency.code}</span>
                                                    </p>
                                                </div>
                                                <ChevronRight className="h-7 w-7 text-neutral-400 dark:text-neutral-500 group-hover:text-rose-600 dark:group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
