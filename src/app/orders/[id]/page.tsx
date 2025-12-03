import { getOrderDetails } from '@/app/actions/orders'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, MapPin, Phone, CreditCard, Package, Truck } from 'lucide-react'
import CancelOrderButton from '@/components/CancelOrderButton'
import OrderStatusTimeline from '@/components/OrderStatusTimeline'
import { siteConfig } from '@/config/site'

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const orderId = parseInt(id)

    if (isNaN(orderId)) {
        redirect('/orders')
    }

    const result = await getOrderDetails(orderId)

    if (result.error || !result.order) {
        redirect('/orders')
    }

    const { order } = result

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending_payment': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'processing': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
            case 'out_for_delivery': return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'completed': return 'bg-green-100 text-green-800 border-green-200'
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getStatusLabel = (status: string) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-12">
                    <Button variant="ghost" asChild className="mb-6 -ml-4 text-neutral-600 hover:text-rose-600 hover:bg-rose-50">
                        <Link href="/orders" className="flex items-center gap-2">
                            <ChevronLeft className="h-5 w-5" />
                            Back to Orders
                        </Link>
                    </Button>
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 flex-wrap">
                                    <h1 className="text-4xl font-bold text-neutral-900">Order #{order.id}</h1>
                                    <Badge variant="secondary" className={`${getStatusColor(order.status)} text-sm px-4 py-1.5 border-0`}>
                                            {getStatusLabel(order.status)}
                                        </Badge>
                                    </div>
                                <p className="text-neutral-600">
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
                                {order.status === 'pending_payment' && order.payment_method === 'instapay' && (
                                    <Button className="bg-rose-600 hover:bg-rose-700 text-white px-6 h-11 rounded-xl shadow-lg shadow-rose-600/20">
                                        Upload Payment Proof
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left Column: Items */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                            <div className="p-8 pb-6">
                                <h2 className="font-bold text-xl text-neutral-900">Order Items</h2>
                            </div>
                            <div className="divide-y divide-neutral-100">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="px-8 py-6 flex gap-5">
                                        <div className="relative w-24 h-24 bg-neutral-50 rounded-2xl overflow-hidden flex-shrink-0 border border-neutral-100">
                                            {item.product.image_url ? (
                                                <Image
                                                    src={item.product.image_url}
                                                    alt={item.product.name_en}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                                    <Package className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-4 mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-neutral-900 text-lg">{item.product.name_en}</h3>
                                                    <p className="text-base text-neutral-500 mt-1" dir="rtl">{item.product.name_ar}</p>
                                                </div>
                                                <p className="font-bold text-neutral-900 text-lg whitespace-nowrap">
                                                    {((item.price_at_purchase || 0) * item.quantity).toLocaleString()} <span className="text-sm font-medium text-neutral-500">{siteConfig.currency.code}</span>
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-6 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-neutral-500">Quantity:</span>
                                                    <span className="font-medium text-neutral-900">{item.quantity}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-neutral-500">Unit Price:</span>
                                                    <span className="font-medium text-neutral-900">{(item.price_at_purchase || 0).toLocaleString()} {siteConfig.currency.code}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-8 py-8 bg-gradient-to-br from-neutral-50 to-white">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-neutral-900">Total Amount</span>
                                    <span className="text-3xl font-bold text-neutral-900">{order.total_amount.toLocaleString()} <span className="text-lg font-medium text-neutral-500">{siteConfig.currency.code}</span></span>
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
                        />

                        {/* Delivery Info */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl flex items-center justify-center">
                                    <Truck className="h-5 w-5 text-rose-600" />
                                </div>
                                <h2 className="font-bold text-lg text-neutral-900">Delivery Details</h2>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Method</p>
                                    <p className="text-neutral-900 font-semibold text-base capitalize">{order.delivery_type}</p>
                                </div>
                                {order.delivery_type === 'delivery' && (
                                    <>
                                        <div>
                                            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Address</p>
                                            <div className="flex items-start gap-3 text-neutral-900">
                                                <MapPin className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                                                <span className="leading-relaxed">{order.delivery_address || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Phone</p>
                                            <div className="flex items-center gap-3 text-neutral-900">
                                                <Phone className="h-5 w-5 text-rose-600" />
                                                <span className="font-medium">{order.phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl flex items-center justify-center">
                                    <CreditCard className="h-5 w-5 text-rose-600" />
                                </div>
                                <h2 className="font-bold text-lg text-neutral-900">Payment Details</h2>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Method</p>
                                    <p className="text-neutral-900 font-semibold text-base">
                                        {order.payment_method === 'instapay' 
                                            ? 'InstaPay' 
                                            : (order.delivery_type === 'delivery' ? 'Cash on Delivery' : 'Cash Payment')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Status</p>
                                    <Badge variant="outline" className={`${getStatusColor(order.status)} border-0 px-3 py-1.5`}>
                                        {getStatusLabel(order.status)}
                                    </Badge>
                                </div>
                                {order.payment_method === 'instapay' && order.payment_proof_url && (
                                    <div>
                                        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Payment Proof</p>
                                        <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-neutral-100 shadow-sm">
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
