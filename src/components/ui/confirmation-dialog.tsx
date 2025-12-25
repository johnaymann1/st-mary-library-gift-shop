'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ConfirmationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    onConfirm: () => void
    variant?: 'default' | 'destructive'
}

export function ConfirmationDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    variant = 'default'
}: ConfirmationDialogProps) {
    const [isConfirming, setIsConfirming] = useState(false)

    const handleConfirm = async () => {
        setIsConfirming(true)
        try {
            await onConfirm()
            onOpenChange(false)
        } finally {
            setIsConfirming(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        {variant === 'destructive' && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/20">
                                <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                            </div>
                        )}
                        <DialogTitle className="text-neutral-900 dark:text-white">{title}</DialogTitle>
                    </div>
                    <DialogDescription className="text-neutral-600 dark:text-neutral-400">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isConfirming}
                        className="dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isConfirming}
                        variant={variant === 'destructive' ? 'destructive' : 'primary'}
                        className={variant === 'destructive' ? 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700' : ''}
                    >
                        {isConfirming ? 'Processing...' : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
