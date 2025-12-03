import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
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
            <Link href="/admin/categories" className="inline-flex items-center gap-2 text-neutral-600 hover:text-rose-600 transition-colors mb-6">
                <ChevronLeft className="h-5 w-5" />
                Back to Categories
            </Link>
            <h1 className="text-2xl font-bold mb-6 text-neutral-900">Edit Category</h1>
            <EditCategoryForm category={category} />
        </div>
    )
}
