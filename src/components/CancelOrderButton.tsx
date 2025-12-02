'use client'

import { Button } from '@/components/ui/button'
import { cancelOrder } from '@/app/actions/orders'
import { X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CancelOrderButtonProps {
    orderId: number
    status: string
}

export default function CancelOrderButton({ orderId, status }: CancelOrderButtonProps) {
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

    if (showConfirm) {
        return (
            <div className="flex gap-2">
                <Button 
                    variant="outline"
                    onClick={() => setShowConfirm(false)}
                    disabled={loading}
                    className="border-2 border-neutral-400 text-neutral-800 hover:bg-neutral-100 hover:border-neutral-500 font-semibold"
                >
                    No, keep order
                </Button>
                <Button
                    onClick={handleCancel}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white"
                >
                    {loading ? 'Cancelling...' : 'Yes, cancel order'}
                </Button>
            </div>
        )
    }

    return (
        <Button 
            variant="outline" 
            onClick={() => setShowConfirm(true)}
            className="border-2 border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 font-semibold"
        >
            <X className="h-4 w-4 mr-2" />
            Cancel Order
        </Button>
    )
}
