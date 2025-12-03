import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions/auth'
import { User, Package, LogOut, Phone, Mail, Heart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function AccountPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }



    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-rose-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center gap-2 text-neutral-600 hover:text-rose-600 transition-colors mb-6">
                    <ArrowLeft className="h-5 w-5" />
                    Back to Home
                </Link>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-neutral-900 mb-2">My Account</h1>
                    <p className="text-neutral-600">Manage your profile and view your orders</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 sticky top-24">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="h-24 w-24 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                    <User className="h-12 w-12 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-neutral-900 mb-1">
                                    {user.user_metadata.full_name || 'Valued Customer'}
                                </h2>
                                <p className="text-sm text-neutral-600 font-medium">
                                    Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                                    <Mail className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-neutral-600 font-medium mb-1">Email</p>
                                        <p className="text-sm text-neutral-900 font-medium break-all">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                                    <Phone className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-neutral-600 font-medium mb-1">Phone</p>
                                        <p className="text-sm text-neutral-900 font-medium">
                                            {user.user_metadata.phone || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-neutral-200">
                                <form action={logout}>
                                    <Button variant="destructive" className="w-full gap-2 shadow-sm" size="lg" type="submit">
                                        <LogOut className="h-5 w-5" />
                                        Sign Out
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard / Quick Actions */}
                    <div className="lg:col-span-2">
                        {/* Stats Cards */}
                        {/* Quick Links */}
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Link href="/orders" className="group">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 hover:shadow-md hover:border-rose-200 transition-all duration-300 h-full">
                                        <div className="h-14 w-14 bg-rose-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-100 group-hover:scale-110 transition-all duration-300">
                                            <Package className="h-7 w-7 text-rose-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-rose-600 transition-colors">
                                            My Orders
                                        </h3>
                                        <p className="text-sm text-neutral-600 leading-relaxed">
                                            View your order history and track current shipments.
                                        </p>
                                    </div>
                                </Link>

                                <Link href="#" className="group">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 hover:shadow-md hover:border-rose-200 transition-all duration-300 h-full">
                                        <div className="h-14 w-14 bg-pink-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-100 group-hover:scale-110 transition-all duration-300">
                                            <Heart className="h-7 w-7 text-pink-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-rose-600 transition-colors">
                                            Wishlist
                                        </h3>
                                        <p className="text-sm text-neutral-600 leading-relaxed">
                                            Save your favorite items for later.
                                        </p>
                                        <span className="inline-block mt-2 text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
                                            Coming Soon
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
