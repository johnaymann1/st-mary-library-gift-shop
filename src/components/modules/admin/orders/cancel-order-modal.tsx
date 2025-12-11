'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Ban, AlertCircle } from 'lucide-react'
import { Order } from '@/types'
import { siteConfig } from '@/config/site'

interface CancelOrderModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    order: Order | null
    cancelReason: string
    onCancelReasonChange: (reason: string) => void
    updating: boolean
    onConfirm: () => void
}

export function CancelOrderModal({
    open,
    onOpenChange,
    order,
    cancelReason,
    onCancelReasonChange,
    updating,
    onConfirm
}: CancelOrderModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-gradient-to-br from-rose-50 via-white to-red-50">
                <DialogHeader className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-red-100">
                        <Ban className="h-8 w-8 text-red-600" />
                    </div>
                    <DialogTitle className="text-2xl text-center text-neutral-900">Cancel Order?</DialogTitle>
                    <DialogDescription className="text-center text-base text-neutral-700">
                        You are about to cancel <span className="font-bold text-neutral-900">Order #{order?.id}</span>
                        <br />
                        <span className="text-sm text-neutral-600">This action cannot be undone.</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="my-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 space-y-3 border border-neutral-200 shadow-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-neutral-600">Customer</span>
                            <span className="text-sm font-semibold text-neutral-900">{order?.user?.full_name || 'Guest'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-neutral-600">Total Amount</span>
                            <span className="text-sm font-semibold text-neutral-900">
                                {order?.total_amount.toLocaleString()} {siteConfig.currency.code}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-neutral-600">Items</span>
                            <span className="text-sm font-semibold text-neutral-900">{order?.items?.length || 0} items</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="text-sm font-semibold text-neutral-900 mb-3 block">
                            Cancellation Reason (Optional)
                        </label>
                        <Textarea
                            placeholder="E.g., Out of stock, customer request, payment issue..."
                            value={cancelReason}
                            onChange={(e) => onCancelReasonChange(e.target.value)}
                            rows={3}
                            className="resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                        />
                        <p className="text-xs text-neutral-500 mt-2 flex items-start gap-1.5">
                            <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                            <span>Customer will be notified about the cancellation.</span>
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-3 sm:gap-3">
                    <Button
                        variant="outline"
                        onClick={() => {
                            onOpenChange(false)
                            onCancelReasonChange('')
                        }}
                        disabled={updating}
                        className="flex-1 h-11 border-2 bg-white hover:bg-neutral-50 font-semibold text-neutral-900"
                    >
                        Keep Order
                    </Button>
                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white flex-1 h-11 shadow-lg shadow-red-600/20 font-semibold"
                        onClick={onConfirm}
                        disabled={updating}
                    >
                        {updating ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <Ban className="mr-2 h-4 w-4" />
                                Cancel Order
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
