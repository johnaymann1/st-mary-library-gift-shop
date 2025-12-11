import { redirect } from 'next/navigation'
import * as userService from '@/services/users'
import * as orderService from '@/services/orders'
import OrdersPageClient from './orders-client'

export default async function OrdersPage() {
    const user = await userService.getCurrentUser()

    if (!user) {
        redirect('/login?next=/orders')
    }

    // Fetch orders on server using service
    const orders = await orderService.getOrdersByUserId(user.id)

    return <OrdersPageClient initialOrders={orders} />
}
