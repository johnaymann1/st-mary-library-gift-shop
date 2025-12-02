import { getAllOrders } from '@/app/actions/admin'
import AdminOrdersClient from './admin-orders-client'
import { redirect } from 'next/navigation'

export default async function AdminOrdersPage() {
    const result = await getAllOrders()

    if (result.error) {
        // If unauthorized or error, redirect to admin dashboard or login
        redirect('/admin')
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Orders Management</h1>
                <p className="text-neutral-600">Manage customer orders and payment confirmations</p>
            </div>

            <AdminOrdersClient initialOrders={result.orders || []} />
        </div>
    )
}
