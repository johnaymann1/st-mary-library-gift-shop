import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import CheckoutClient from './checkout-client'
import { getStoreSettings } from '@/utils/settings'
import * as userService from '@/services/users'
import * as addressService from '@/services/addresses'

export default async function CheckoutPage() {
    const user = await userService.getCurrentUser()

    if (!user) {
        redirect('/login?next=/checkout')
    }

    // Fetch store settings for delivery fee
    const settings = await getStoreSettings()

    // Fetch user profile with phone
    const userProfile = await userService.getUserById(user.id)

    // Fetch user addresses
    const addresses = await addressService.getAddressesByUserId(user.id)

    return (
        <div className="min-h-screen bg-neutral-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/cart" className="inline-flex items-center gap-2 text-neutral-600 hover:text-rose-600 transition-colors mb-6">
                    <ChevronLeft className="h-5 w-5" />
                    Back to Cart
                </Link>
                <h1 className="text-3xl font-bold text-neutral-900 mb-8">Checkout</h1>
                <CheckoutClient
                    userPhone={userProfile?.phone || ''}
                    savedAddresses={addresses || []}
                    deliveryFee={settings.delivery_fee}
                    currencyCode={settings.currency_code}
                    instapayEnabled={settings.instapay_enabled}
                    instapayPhone={settings.instapay_phone || '01000000000'}
                    deliveryTimeDays={settings.delivery_time_days || '1-3 business days'}
                />
            </main>
        </div>
    )
}
