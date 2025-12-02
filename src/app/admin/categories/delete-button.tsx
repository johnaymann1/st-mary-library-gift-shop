'use client'

import { deleteCategory } from '@/app/actions/admin'
import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function DeleteCategoryButton({ id, onDelete }: { id: number; onDelete?: () => void }) {
    const [loading, setLoading] = useState(false)
    const [showDialog, setShowDialog] = useState(false)

    async function handleDelete() {
        setLoading(true)
        const result = await deleteCategory(id)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Category deleted successfully')
            setShowDialog(false)
            onDelete?.()
        }
        setLoading(false)
    }

    return (
        <>
            <button
                onClick={() => setShowDialog(true)}
                disabled={loading}
                className="text-red-600 hover:text-red-700 disabled:opacity-50 inline-flex items-center gap-1 transition-colors"
                title="Delete category"
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Trash2 className="h-4 w-4" />
                )}
            </button>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-neutral-900">Delete Category</DialogTitle>
                        <DialogDescription className="text-neutral-600">
                            Are you sure you want to delete this category? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowDialog(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={loading}
                            className="gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
