'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Product } from '@/types'

export default function DuplicateProductButton({ product }: { product: Product }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleDuplicate() {
        setLoading(true)
        
        // Create form data with product details
        const formData = new FormData()
        formData.append('name_en', `${product.name_en} (Copy)`)
        formData.append('name_ar', `${product.name_ar} (نسخة)`)
        formData.append('price', product.price.toString())
        formData.append('category_id', product.category_id.toString())
        formData.append('in_stock', product.in_stock.toString())
        
        // If there's an image URL, we'll need to fetch and include it
        // For now, we'll skip the image in the duplicate
        
        try {
            const { createProduct } = await import('@/app/actions/admin')
            const result = await createProduct(formData)
            
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success('Product duplicated successfully! Redirecting to edit...')
                // Redirect to edit the new product
                setTimeout(() => {
                    router.push('/admin/products')
                    router.refresh()
                }, 1000)
            }
        } catch (error) {
            toast.error('Failed to duplicate product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleDuplicate}
            disabled={loading}
            className="text-rose-600 hover:text-rose-700 disabled:opacity-50 inline-flex items-center gap-1 transition-colors"
            title="Duplicate product"
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </button>
    )
}
