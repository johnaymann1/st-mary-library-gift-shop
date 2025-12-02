import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import EditCategoryForm from './edit-form'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('id', parseInt(id))
        .single()

    if (!category) {
        notFound()
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-neutral-900">Edit Category</h1>
            <EditCategoryForm category={category} />
        </div>
    )
}
