'use client'

import { getOrderDetails } from '@/app/actions/orders'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, MapPin, Phone, CreditCard, Package, Truck } from 'lucide-react'
import { CancelOrderButton, OrderStatusTimeline } from '@/components/modules/orders'
import { siteConfig } from '@/config/site'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Order } from '@/types'

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [orderId, setOrderId] = useState<number>(0)

    useEffect(() => {
        async function initialize() {
            const { id } = await params
            const parsedId = parseInt(id)

            if (isNaN(parsedId)) {
                router.push('/orders')
                return
            }

            setOrderId(parsedId)
            const result = await getOrderDetails(parsedId)

            if (result.error || !result.order) {
                router.push('/orders')
                return
            }

            setOrder(result.order)
            setLoading(false)
        }
        initialize()
    }, [params, router])

    // Auto-refresh order every 10 seconds
    useEffect(() => {
        if (!orderId) return

        const interval = setInterval(async () => {
            const result = await getOrderDetails(orderId)
            if (result.order) {
                setOrder(result.order)
            }
        }, 10000)

        return () => clearInterval(interval)
    }, [orderId])

    if (loading || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 transition-colors">
                <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="animate-pulse space-y-6">
                        <div className="h-10 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
                        <div className="h-96 bg-white dark:bg-neutral-900 rounded-3xl"></div>
                    </div>
                </main>
            </div>
        )
    }

    const getStatusColor = (status: string) => {
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
        <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 transition-colors">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-12">
                    <Button variant="ghost" asChild className="mb-6 -ml-4 text-neutral-600 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">
                        <Link href="/orders" className="flex items-center gap-2">
                            <ChevronLeft className="h-5 w-5" />
                            Back to Orders
                        </Link>
                    </Button>
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 flex-wrap">
                                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-white transition-colors">Order #{order.id}</h1>
                                    <Badge variant="secondary" className={`${getStatusColor(order.status)} text-sm px-4 py-1.5 border-0`}>
                                        {getStatusLabel(order.status)}
                                    </Badge>
                                </div>
                                <p className="text-neutral-600 dark:text-neutral-400 transition-colors">
                                    {new Date(order.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <CancelOrderButton orderId={order.id} status={order.status} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left Column: Items */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm overflow-hidden border border-neutral-100 dark:border-neutral-800 transition-colors">
                            <div className="p-8 pb-6">
                                <h2 className="font-bold text-xl text-neutral-900 dark:text-white transition-colors">Order Items</h2>
                            </div>
                            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="px-8 py-6 flex gap-5">
                                        <div className="relative w-24 h-24 bg-neutral-50 dark:bg-neutral-800 rounded-2xl overflow-hidden flex-shrink-0 border border-neutral-100 dark:border-neutral-700 transition-colors">
                                            {item.product.image_url ? (
                                                <Image
                                                    src={item.product.image_url}
                                                    alt={item.product.name_en}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-neutral-400 dark:text-neutral-600">
                                                    <Package className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-4 mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-neutral-900 dark:text-white text-lg transition-colors">{item.product.name_en}</h3>
                                                    <p className="text-base text-neutral-500 dark:text-neutral-400 mt-1 transition-colors font-arabic" dir="rtl">{item.product.name_ar}</p>
                                                </div>
                                                <p className="font-bold text-neutral-900 dark:text-white text-lg whitespace-nowrap transition-colors">
                                                    {((item.price_at_purchase || 0) * item.quantity).toLocaleString()} <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{siteConfig.currency.code}</span>
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-6 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-neutral-500 dark:text-neutral-400 transition-colors">Quantity:</span>
                                                    <span className="font-medium text-neutral-900 dark:text-white transition-colors">{item.quantity}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-neutral-500 dark:text-neutral-400 transition-colors">Unit Price:</span>
                                                    <span className="font-medium text-neutral-900 dark:text-white transition-colors">{(item.price_at_purchase || 0).toLocaleString()} {siteConfig.currency.code}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-8 py-8 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-900 transition-colors">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-neutral-900 dark:text-white transition-colors">Total Amount</span>
                                    <span className="text-3xl font-bold text-neutral-900 dark:text-white transition-colors">{order.total_amount.toLocaleString()} <span className="text-lg font-medium text-neutral-500 dark:text-neutral-400">{siteConfig.currency.code}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status Timeline */}
                        <OrderStatusTimeline
                            status={order.status}
                            createdAt={order.created_at}
                            updatedAt={order.updated_at}
                            deliveryType={order.delivery_type}
                            paymentMethod={order.payment_method}
                        />

                        {/* Delivery Info */}
                        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm p-8 border border-neutral-100 dark:border-neutral-800 transition-colors">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950 rounded-xl flex items-center justify-center transition-colors">
                                    <Truck className="h-5 w-5 text-rose-600 dark:text-rose-400 transition-colors" />
                                </div>
                                <h2 className="font-bold text-lg text-neutral-900 dark:text-white transition-colors">Delivery Details</h2>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 transition-colors">Method</p>
                                    <p className="text-neutral-900 dark:text-white font-semibold text-base capitalize transition-colors">{order.delivery_type}</p>
                                </div>
                                {order.delivery_type === 'delivery' && (
                                    <>
                                        <div>
                                            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 transition-colors">Address</p>
                                            <div className="flex items-start gap-3 text-neutral-900 dark:text-white transition-colors">
                                                <MapPin className="h-5 w-5 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0 transition-colors" />
                                                <span className="leading-relaxed">{order.delivery_address || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 transition-colors">Phone</p>
                                            <div className="flex items-center gap-3 text-neutral-900 dark:text-white transition-colors">
                                                <Phone className="h-5 w-5 text-rose-600 dark:text-rose-400 transition-colors" />
                                                <span className="font-medium">{order.phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm p-8 border border-neutral-100 dark:border-neutral-800 transition-colors">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950 rounded-xl flex items-center justify-center transition-colors">
                                    <CreditCard className="h-5 w-5 text-rose-600 dark:text-rose-400 transition-colors" />
                                </div>
                                <h2 className="font-bold text-lg text-neutral-900 dark:text-white transition-colors">Payment Details</h2>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 transition-colors">Method</p>
                                    <p className="text-neutral-900 dark:text-white font-semibold text-base transition-colors">
                                        {order.payment_method === 'instapay'
                                            ? 'InstaPay'
                                            : (order.delivery_type === 'delivery' ? 'Cash on Delivery' : 'Cash Payment')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3 transition-colors">Status</p>
                                    <Badge variant="outline" className={`${getStatusColor(order.status)} border-0 px-3 py-1.5`}>
                                        {getStatusLabel(order.status)}
                                    </Badge>
                                </div>
                                {order.payment_method === 'instapay' && order.payment_proof_url && (
                                    <div>
                                        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3 transition-colors">Payment Proof</p>
                                        <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-700 shadow-sm transition-colors">
                                            <Image
                                                src={order.payment_proof_url}
                                                alt="Payment Proof"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
