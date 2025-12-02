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
                <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-rose-50 border-2 border-rose-200">
                    <DialogHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                            <Trash2 className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-neutral-900 text-center">Delete Category</DialogTitle>
                        <DialogDescription className="text-neutral-600 text-center pt-2">
                            Are you sure you want to delete this category? This action cannot be undone and will permanently remove all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-2 flex-col sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowDialog(false)}
                            disabled={loading}
                            className="w-full sm:w-auto border-2 border-neutral-300 hover:bg-neutral-100 font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="w-full sm:w-auto gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    Delete Permanently
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
