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
        <div className="bg-white dark:bg-neutral-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 transition-colors">
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2 transition-colors">
                <Truck className="h-5 w-5 text-rose-600 dark:text-rose-400 transition-colors" />
                Delivery Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" role="radiogroup" aria-label="Delivery method">
                <label className={`relative flex flex-col p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all focus-within:ring-4 focus-within:ring-rose-500 focus-within:ring-offset-2 ${deliveryType === 'delivery' ? 'border-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-500' : 'border-neutral-200 dark:border-neutral-700 hover:border-rose-200 dark:hover:border-rose-700'}`}>
                    <input
                        type="radio"
                        name="delivery_type"
                        value="delivery"
                        checked={deliveryType === 'delivery'}
                        onChange={() => onDeliveryTypeChange('delivery')}
                        className="sr-only"
                        aria-label="Home delivery"
                    />
                    <span className="font-semibold text-neutral-900 dark:text-white transition-colors">Home Delivery</span>
                    <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 transition-colors">Delivery to your doorstep</span>
                    <span className="mt-2 font-bold text-rose-600 dark:text-rose-400 transition-colors">{deliveryFee.toFixed(2)} {currencyCode}</span>
                </label>
                <label className={`relative flex flex-col p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all focus-within:ring-4 focus-within:ring-rose-500 focus-within:ring-offset-2 ${deliveryType === 'pickup' ? 'border-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-500' : 'border-neutral-200 dark:border-neutral-700 hover:border-rose-200 dark:hover:border-rose-700'}`}>
                    <input
                        type="radio"
                        name="delivery_type"
                        value="pickup"
                        checked={deliveryType === 'pickup'}
                        onChange={() => onDeliveryTypeChange('pickup')}
                        className="sr-only"
                        aria-label="Store pickup"
                    />
                    <span className="font-semibold text-neutral-900 dark:text-white transition-colors">Store Pickup</span>
                    <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 transition-colors">Pick up from {siteConfig.name}</span>
                    <span className="mt-2 font-bold text-green-600 dark:text-green-400 transition-colors">Free</span>
                </label>
            </div>
        </div>
    )
}
