import { createClient } from '@/utils/supabase/server'
import CartClient from './cart-client'

export default async function CartPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="min-h-screen bg-neutral-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-neutral-900 mb-8">Shopping Cart</h1>
                <CartClient user={user} />
            </main>
        </div>
    )
}
