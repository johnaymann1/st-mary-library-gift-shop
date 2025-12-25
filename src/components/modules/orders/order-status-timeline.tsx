import { CheckCircle2, Clock, Truck, Package, XCircle, Store } from 'lucide-react'

interface OrderStatusTimelineProps {
    status: string
    createdAt: string
    updatedAt: string
    deliveryType?: string
    paymentMethod?: string
}

export function OrderStatusTimeline({ status, createdAt, updatedAt, deliveryType = 'delivery', paymentMethod = 'cash' }: OrderStatusTimelineProps) {
    const isCancelled = status === 'cancelled'

    // Build dynamic status steps based on delivery type and payment method
    const statusSteps = [
        // InstaPay orders start with pending_payment
        ...(paymentMethod === 'instapay' ? [{
            key: 'pending_payment',
            label: 'Pending Payment',
            icon: Clock,
            description: 'Waiting for payment confirmation'
        }] : []),
        {
            key: 'processing',
            label: 'Processing',
            icon: Package,
            description: 'Your order is being prepared'
        },
        // Delivery orders use out_for_delivery
        ...(deliveryType === 'delivery' ? [{
            key: 'out_for_delivery',
            label: 'Out for Delivery',
            icon: Truck,
            description: 'Your order is on the way'
        }] : []),
        // Pickup orders use ready_for_pickup
        ...(deliveryType === 'pickup' ? [{
            key: 'ready_for_pickup',
            label: 'Ready for Pickup',
            icon: Store,
            description: 'Your order is ready to be collected'
        }] : []),
        {
            key: 'completed',
            label: 'Completed',
            icon: CheckCircle2,
            description: deliveryType === 'delivery' ? 'Order delivered successfully' : 'Order collected successfully'
        }
    ]

    const currentStepIndex = statusSteps.findIndex(step => step.key === status)

    if (isCancelled) {
        return (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-6 border border-neutral-100 dark:border-neutral-800 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
                        <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 transition-colors" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white transition-colors">Order Cancelled</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 transition-colors">
                            This order was cancelled on {new Date(updatedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-6 sm:p-8 border border-neutral-100 dark:border-neutral-800 transition-colors">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-6 transition-colors">Order Status</h3>

            <div className="relative">
                {statusSteps.map((step, index) => {
                    const Icon = step.icon
                    const isCompleted = index < currentStepIndex
                    const isCurrent = index === currentStepIndex
                    const isPending = index > currentStepIndex

                    return (
                        <div key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
                            {/* Connecting Line */}
                            {index < statusSteps.length - 1 && (
                                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-700 transition-colors">
                                    {isCompleted && (
                                        <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-green-600 dark:from-green-400 dark:to-green-500" />
                                    )}
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isCompleted
                                    ? 'bg-green-500 dark:bg-green-600 ring-4 ring-green-100 dark:ring-green-900/30'
                                    : isCurrent
                                        ? 'bg-rose-600 dark:bg-rose-500 ring-4 ring-rose-100 dark:ring-rose-900/30 animate-pulse'
                                        : 'bg-neutral-100 dark:bg-neutral-800'
                                }`}>
                                <Icon className={`h-6 w-6 ${isCompleted || isCurrent ? 'text-white' : 'text-neutral-400'
                                    }`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h4 className={`font-semibold transition-colors ${isCurrent ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-900 dark:text-white'
                                            }`}>
                                            {step.label}
                                        </h4>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 transition-colors">
                                            {step.description}
                                        </p>
                                        {isCurrent && (
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 transition-colors">
                                                Updated {new Date(updatedAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        )}
                                    </div>
                                    {isCompleted && (
                                        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full transition-colors">
                                            ✓ Done
                                        </span>
                                    )}
                                    {isCurrent && (
                                        <span className="text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded-full transition-colors">
                                            Current
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
