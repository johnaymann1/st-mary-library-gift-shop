'use client'

import { Button } from '@/components/ui/button'
import { cancelOrder } from '@/app/actions/orders'
import { X, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface CancelOrderButtonProps {
    orderId: number
    status: string
}

export function CancelOrderButton({ orderId, status }: CancelOrderButtonProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    // Only show cancel button for certain statuses
    const cancellableStatuses = ['pending_payment', 'processing']
    if (!cancellableStatuses.includes(status)) {
        return null
    }

    async function handleCancel() {
        setLoading(true)
        const result = await cancelOrder(orderId)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Order cancelled successfully')
            router.refresh()
        }
        setLoading(false)
        setShowConfirm(false)
    }

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setShowConfirm(true)}
                className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold h-11 px-6 rounded-xl focus:ring-4 focus:ring-red-500 focus:ring-offset-2"
                aria-label={`Cancel order number ${orderId}`}
            >
                <X className="h-4 w-4 mr-2" aria-hidden="true" />
                Cancel Order
            </Button>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent className="sm:max-w-md bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-red-950/20 border-neutral-200 dark:border-neutral-700 transition-colors">
                    <DialogHeader className="space-y-4">
                        <div className="mx-auto w-14 h-14 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-lg border-2 border-red-100 dark:border-red-900 transition-colors">
                            <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400 transition-colors" />
                        </div>
                        <DialogTitle className="text-xl text-center text-neutral-900 dark:text-white transition-colors">Cancel This Order?</DialogTitle>
                        <DialogDescription className="text-center text-neutral-700 dark:text-neutral-300 transition-colors">
                            Are you sure you want to cancel <span className="font-bold text-neutral-900 dark:text-white">Order #{orderId}</span>?
                            <br />
                            <span className="text-sm mt-1 block text-neutral-600 dark:text-neutral-400 transition-colors">This action cannot be undone.</span>
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-3 sm:gap-3 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowConfirm(false)}
                            disabled={loading}
                            className="flex-1 h-11 border-2 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 border-neutral-300 dark:border-neutral-600 font-semibold text-neutral-900 dark:text-white transition-colors"
                        >
                            Keep Order
                        </Button>
                        <Button
                            onClick={handleCancel}
                            disabled={loading}
                            className="bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 text-white flex-1 h-11 shadow-lg shadow-red-600/20 dark:shadow-red-500/20 font-semibold transition-colors"
                        >
                            {loading ? 'Cancelling...' : (
                                <>
                                    <X className="h-4 w-4 mr-2" />
                                    Yes, Cancel
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
