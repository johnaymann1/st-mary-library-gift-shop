'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Eye, CheckCircle, XCircle } from 'lucide-react'
import Image from 'next/image'
import { Order } from '@/types'

interface PaymentVerifyModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    order: Order | null
    updating: boolean
    onVerify: (approved: boolean) => void
}

export function PaymentVerifyModal({
    open,
    onOpenChange,
    order,
    updating,
    onVerify
}: PaymentVerifyModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 transition-colors">
                <DialogHeader>
                    <DialogTitle className="text-xl text-neutral-900 dark:text-white transition-colors">
                        {order?.status === 'pending_payment' ? 'Verify Payment Proof' : 'View Payment Proof'}
                    </DialogTitle>
                    <DialogDescription className="text-neutral-600 dark:text-neutral-400 transition-colors">
                        {order?.status === 'pending_payment' 
                            ? `Review the InstaPay transfer screenshot for Order #${order?.id}`
                            : `Payment proof for Order #${order?.id} (Already ${order?.status === 'cancelled' ? 'rejected' : 'verified'})`
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="my-4 max-h-[60vh] overflow-auto">
                    {order?.payment_proof_url ? (
                        <div className="space-y-4">
                            <div className="relative w-full bg-neutral-50 dark:bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-sm transition-colors" style={{ minHeight: '400px' }}>
                                <Image
                                    src={order.payment_proof_url}
                                    alt="Payment Proof"
                                    width={800}
                                    height={1200}
                                    className="w-full h-auto object-contain"
                                    unoptimized
                                />
                            </div>
                            <a
                                href={order.payment_proof_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                            >
                                <Eye className="h-4 w-4" />
                                Open image in new tab
                            </a>
                        </div>
                    ) : (
                        <div className="p-12 text-center text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 transition-colors">
                            <XCircle className="h-12 w-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3 transition-colors" />
                            <p className="font-medium">No payment proof uploaded</p>
                            <p className="text-sm mt-2">The customer hasn't uploaded a payment screenshot yet.</p>
                        </div>
                    )}
                </div>

                {order?.status === 'pending_payment' && (
                    <DialogFooter className="gap-2 sm:gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onVerify(false)}
                            disabled={updating || !order?.payment_proof_url}
                            className="flex-1 border-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-800 dark:hover:text-red-300 hover:border-red-400 dark:hover:border-red-600 font-semibold transition-colors"
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                        </Button>
                        <Button
                            className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white flex-1 shadow-sm transition-colors"
                            onClick={() => onVerify(true)}
                            disabled={updating || !order?.payment_proof_url}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
