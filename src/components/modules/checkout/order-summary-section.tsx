'use client'

import { Truck } from 'lucide-react'
import { CartItem } from '@/context/CartContext'

interface OrderSummarySectionProps {
    cart: CartItem[]
    subtotal: number
    shippingCost: number
    total: number
    deliveryType: 'delivery' | 'pickup'
    deliveryTimeDays: string
    currencyCode: string
}

export function OrderSummarySection({
    cart,
    subtotal,
    shippingCost,
    total,
    deliveryType,
    deliveryTimeDays,
    currencyCode
}: OrderSummarySectionProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-5 sm:p-6 sticky top-24">
            <h2 className="text-lg font-bold text-neutral-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.map((item) => (
                    <div key={item.product_id} className="flex gap-3">
                        <div className="h-12 w-12 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                            {item.product.image_url && (
                                <img src={item.product.image_url} alt={item.product.name_en} className="h-full w-full object-cover" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">{item.product.name_en}</p>
                            <p className="text-xs text-neutral-500">{item.quantity} x {item.product.price.toLocaleString()}</p>
                        </div>
                        <div className="text-sm font-semibold text-neutral-900">
                            {(item.product.price * item.quantity).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-neutral-200 pt-4 space-y-2">
                <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>{subtotal.toLocaleString()} {currencyCode}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : `${shippingCost.toLocaleString()} ${currencyCode}`}</span>
                </div>
                <div className="border-t border-neutral-200 pt-4 flex justify-between font-bold text-lg text-neutral-900">
                    <span>Total</span>
                    <span>{total.toLocaleString()} {currencyCode}</span>
                </div>
            </div>

            {deliveryType === 'delivery' && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Truck className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Estimated Delivery:</span>
                        <span>{deliveryTimeDays}</span>
                    </div>
                </div>
            )}
        </div>
    )
}
