import { getUserOrders } from '@/app/actions/orders'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, ChevronRight } from 'lucide-react'
import { siteConfig } from '@/config/site'

export default async function OrdersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const orders = await getUserOrders()

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
                    <h1 className="text-4xl font-bold text-neutral-900 mb-3">My Orders</h1>
                    <p className="text-neutral-600 text-lg">Track and manage your orders</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl shadow-sm">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-rose-100 rounded-3xl mb-6">
                            <Package className="h-12 w-12 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-3">No orders yet</h2>
                        <p className="text-neutral-600 mb-8 max-w-sm mx-auto">Start exploring our collection and place your first order.</p>
                        <Button asChild className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 h-12 rounded-xl shadow-lg">
                            <Link href="/">Start Shopping</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <Link key={order.id} href={`/orders/${order.id}`} className="block group">
                                <div className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-neutral-100">
                                    <div className="p-8">
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                                {/* Left: Order Info */}
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-3 flex-wrap">
                                                                <span className="text-xl font-bold text-neutral-900">Order #{order.id}</span>
                                                                <Badge variant="secondary" className={`${getStatusColor(order.status)} border-0 px-4 py-1.5 font-semibold shadow-sm`}>
                                                                    {getStatusLabel(order.status)}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm font-medium text-neutral-600">
                                                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-6 text-sm text-neutral-600">
                                                        <div className="flex items-center gap-2">
                                                            <Package className="h-4 w-4 text-neutral-400" />
                                                            <span>{order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Amount & Action */}
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="text-sm text-neutral-600 mb-1 font-medium">Total Amount</p>
                                                        <p className="text-3xl font-bold text-neutral-900">
                                                            {order.total_amount.toLocaleString()}
                                                            <span className="text-lg font-medium text-neutral-500 ml-1">{siteConfig.currency.code}</span>
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="h-7 w-7 text-neutral-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
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
