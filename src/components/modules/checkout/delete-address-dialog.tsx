'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface DeleteAddressDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
}

export function DeleteAddressDialog({
    open,
    onOpenChange,
    onConfirm
}: DeleteAddressDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-rose-50 border-2 border-rose-200">
                <DialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                        <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-neutral-900 text-center">Delete Address</DialogTitle>
                    <DialogDescription className="text-neutral-600 text-center pt-2">
                        Are you sure you want to delete this address? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-2 flex-col sm:flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="w-full sm:w-auto border-2 border-neutral-400 text-neutral-800 hover:bg-neutral-100 hover:border-neutral-500 font-semibold"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        className="w-full sm:w-auto gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Address
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
