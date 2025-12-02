import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
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
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
            <EditProductForm product={product} categories={categories || []} />
        </div>
    )
}
