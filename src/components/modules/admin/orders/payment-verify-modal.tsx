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
            <DialogContent className="sm:max-w-2xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Verify Payment Proof</DialogTitle>
                    <DialogDescription>
                        Review the InstaPay transfer screenshot for <span className="font-semibold text-neutral-900">Order #{order?.id}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="my-4 max-h-[60vh] overflow-auto">
                    {order?.payment_proof_url ? (
                        <div className="space-y-4">
                            <div className="relative w-full bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm" style={{ minHeight: '400px' }}>
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
                                className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Eye className="h-4 w-4" />
                                Open image in new tab
                            </a>
                        </div>
                    ) : (
                        <div className="p-12 text-center text-neutral-500 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200">
                            <XCircle className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                            <p className="font-medium">No payment proof uploaded</p>
                            <p className="text-sm mt-2">The customer hasn't uploaded a payment screenshot yet.</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onVerify(false)}
                        disabled={updating || !order?.payment_proof_url}
                        className="flex-1 border-2 border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-400 font-semibold"
                    >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                    </Button>
                    <Button
                        className="bg-green-600 hover:bg-green-700 text-white flex-1 shadow-sm"
                        onClick={() => onVerify(true)}
                        disabled={updating || !order?.payment_proof_url}
                    >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
