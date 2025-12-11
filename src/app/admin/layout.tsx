import { redirect } from 'next/navigation'
import { AdminLayoutClient } from '@/components/modules/admin'
import * as userService from '@/services/users'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await userService.getCurrentUser()

    if (!user) {
        redirect('/login')
    }

    // Check user role using service
    const role = await userService.getUserRole(user.id)

    if (role !== 'admin') {
        redirect('/')
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
        { name: 'Orders', href: '/admin/orders', icon: 'ShoppingBag' },
        { name: 'Products', href: '/admin/products', icon: 'Package' },
        { name: 'Categories', href: '/admin/categories', icon: 'FolderOpen' },
        { name: 'Settings', href: '/admin/settings', icon: 'Settings' },
    ]

    return <AdminLayoutClient navigation={navigation}>{children}</AdminLayoutClient>
}
