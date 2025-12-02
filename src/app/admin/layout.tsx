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
            
            {/* Main Content - offset by sidebar width using CSS variable on desktop only */}
            <main className="transition-all duration-300 md:ml-[var(--admin-sidebar-width,18rem)] pt-24 md:pt-20">
                <div className="px-4 sm:px-6 lg:px-8 py-8 md:py-6 mb-20 md:mb-0">
                    {children}
                </div>
            </main>
        </div>
    )
}
