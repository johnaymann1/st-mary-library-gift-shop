import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AdminLayoutClient } from '@/components/AdminLayoutClient'

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

    return <AdminLayoutClient navigation={navigation}>{children}</AdminLayoutClient>
}
