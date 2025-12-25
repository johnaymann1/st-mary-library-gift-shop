import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import CartClient from './cart-client'
import * as UsersService from '@/services/users.service'
import * as AuthService from '@/services/auth.service'
import { createClient } from '@/lib/supabase/server'

export default async function CartPage() {
    // Get full Supabase user for CartClient compatibility
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/" className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors mb-6">
                    <ChevronLeft className="h-5 w-5" />
                    Back to Home
                </Link>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 transition-colors">Shopping Cart</h1>
                <CartClient user={user} />
            </main>
        </div>
    )
}
