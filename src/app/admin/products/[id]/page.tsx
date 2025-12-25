import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import EditProductForm from './edit-form'
import * as ProductsService from '@/services/products.service'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const product = await ProductsService.getProductById(parseInt(id))

    if (!product) {
        notFound()
    }

    // Fetch categories for dropdown
    const categories = await import('@/services/categories.service').then(m => m.getAdminCategories())

    return (
        <div>
            <Link href="/admin/products" className="inline-flex items-center gap-2 text-neutral-600 hover:text-rose-600 transition-colors mb-6">
                <ChevronLeft className="h-5 w-5" />
                Back to Products
            </Link>
            <h1 className="text-2xl font-bold mb-6 text-neutral-900">Edit Product</h1>
            <EditProductForm product={product} categories={categories || []} />
        </div>
    )
}
