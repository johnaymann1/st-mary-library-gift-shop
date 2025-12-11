import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import EditProductForm from './edit-form'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', parseInt(id))
        .single()

    if (!product) {
        notFound()
    }

    // Fetch categories for dropdown
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name_en')
        .order('name_en')

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
