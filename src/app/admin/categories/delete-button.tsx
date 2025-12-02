'use client'

import { deleteCategory } from '@/app/actions/admin'
import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function DeleteCategoryButton({ id }: { id: number }) {
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this category?')) return

        setLoading(true)
        const result = await deleteCategory(id)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Category deleted successfully')
        }
        setLoading(false)
    }

    return (
        <button
            onClick={handleDelete}
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
    )
}
