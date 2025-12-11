'use client'

import { Truck } from 'lucide-react'
import { siteConfig } from '@/config/site'

interface DeliveryMethodSectionProps {
    deliveryType: 'delivery' | 'pickup'
    onDeliveryTypeChange: (type: 'delivery' | 'pickup') => void
    deliveryFee: number
    currencyCode: string
}

export function DeliveryMethodSection({
    deliveryType,
    onDeliveryTypeChange,
    deliveryFee,
    currencyCode
}: DeliveryMethodSectionProps) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-neutral-200">
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-rose-600" />
                Delivery Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" role="radiogroup" aria-label="Delivery method">
                <label className={`relative flex flex-col p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all focus-within:ring-4 focus-within:ring-rose-500 focus-within:ring-offset-2 ${deliveryType === 'delivery' ? 'border-rose-600 bg-rose-50' : 'border-neutral-200 hover:border-rose-200'}`}>
                    <input
                        type="radio"
                        name="delivery_type"
                        value="delivery"
                        checked={deliveryType === 'delivery'}
                        onChange={() => onDeliveryTypeChange('delivery')}
                        className="sr-only"
                        aria-label="Home delivery"
                    />
                    <span className="font-semibold text-neutral-900">Home Delivery</span>
                    <span className="text-xs sm:text-sm text-neutral-500">Delivery to your doorstep</span>
                    <span className="mt-2 font-bold text-rose-600">{deliveryFee.toFixed(2)} {currencyCode}</span>
                </label>
                <label className={`relative flex flex-col p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all focus-within:ring-4 focus-within:ring-rose-500 focus-within:ring-offset-2 ${deliveryType === 'pickup' ? 'border-rose-600 bg-rose-50' : 'border-neutral-200 hover:border-rose-200'}`}>
                    <input
                        type="radio"
                        name="delivery_type"
                        value="pickup"
                        checked={deliveryType === 'pickup'}
                        onChange={() => onDeliveryTypeChange('pickup')}
                        className="sr-only"
                        aria-label="Store pickup"
                    />
                    <span className="font-semibold text-neutral-900">Store Pickup</span>
                    <span className="text-xs sm:text-sm text-neutral-500">Pick up from {siteConfig.name}</span>
                    <span className="mt-2 font-bold text-green-600">Free</span>
                </label>
            </div>
        </div>
    )
}
