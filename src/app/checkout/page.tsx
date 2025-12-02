import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CheckoutClient from './checkout-client'

export default async function CheckoutPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login?next=/checkout')
    }

    // Fetch user profile with phone
    const { data: userProfile } = await supabase
        .from('users')
        .select('phone')
        .eq('id', user.id)
        .single()

    // Fetch user addresses
    const { data: addresses } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-neutral-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-neutral-900 mb-8">Checkout</h1>
                <CheckoutClient 
                    userPhone={userProfile?.phone || ''} 
                    savedAddresses={addresses || []} 
                />
            </main>
        </div>
    )
}
