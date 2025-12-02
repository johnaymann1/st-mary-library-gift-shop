import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/AdminSidebar'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check user role from public.users table
    const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (error || !userData || userData.role !== 'admin') {
        redirect('/')
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
        { name: 'Orders', href: '/admin/orders', icon: 'ShoppingBag' },
        { name: 'Products', href: '/admin/products', icon: 'Package' },
        { name: 'Categories', href: '/admin/categories', icon: 'FolderOpen' },
    ]

    return (
        <div className="min-h-screen bg-neutral-50">
            <AdminSidebar navigation={navigation} />
            
            {/* Main Content - offset by sidebar on desktop, mobile padding for header */}
            <main className="md:ml-64 pt-20 min-h-screen">
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
