'use client'

import { Order } from '@/types'
import { OrderStatsCards, OrderFilterBar, PaymentVerifyModal, CancelOrderModal } from '@/components/modules/admin/orders'
import { OrdersTable } from '@/components/modules/admin/orders/OrdersTable'
import { useOrdersLogic } from '@/hooks/useOrdersLogic'

export default function AdminOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
    const {
        filteredOrders,
        filter,
        setFilter,
        selectedOrder,
        isVerifyModalOpen,
        setIsVerifyModalOpen,
        isCancelModalOpen,
        setIsCancelModalOpen,
        cancelReason,
        setCancelReason,
        updating,
        stats,
        handleStatusUpdate,
        handleVerifyPayment,
        handleCancelOrder,
        openVerifyModal,
        openCancelModal,
        orders
    } = useOrdersLogic(initialOrders)

    return (
        <div className="space-y-6">
            <OrderStatsCards {...stats} />

            <OrderFilterBar
                filter={filter}
                onFilterChange={setFilter}
                filteredCount={filteredOrders.length}
                totalCount={orders.length}
            />

            <OrdersTable
                orders={filteredOrders}
                updating={updating}
                onStatusUpdate={handleStatusUpdate}
                onVerifyClick={openVerifyModal}
                onCancelClick={openCancelModal}
            />

            <PaymentVerifyModal
                open={isVerifyModalOpen}
                onOpenChange={setIsVerifyModalOpen}
                order={selectedOrder}
                updating={updating}
                onVerify={handleVerifyPayment}
            />

            <CancelOrderModal
                open={isCancelModalOpen}
                onOpenChange={setIsCancelModalOpen}
                order={selectedOrder}
                cancelReason={cancelReason}
                onCancelReasonChange={setCancelReason}
                updating={updating}
                onConfirm={handleCancelOrder}
            />
        </div>
    )
}
