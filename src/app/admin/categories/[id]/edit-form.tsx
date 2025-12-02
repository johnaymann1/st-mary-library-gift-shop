'use client'

import { updateCategory } from '@/app/actions/admin'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Upload, Save, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

import { Category } from '@/types'

export default function EditCategoryForm({ category }: { category: Category }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)

        const result = await updateCategory(formData)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Category updated successfully!')
            router.refresh()
            router.push('/admin/categories')
        }
        setLoading(false)
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md border border-neutral-200">
            <Button
                variant="ghost"
                onClick={() => router.push('/admin/categories')}
                className="mb-4 text-neutral-600 hover:text-rose-600 hover:bg-rose-50"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
            </Button>
            <h2 className="text-2xl font-bold mb-6 text-neutral-900">Edit Category</h2>

            <form action={handleSubmit} className="space-y-6">
                <input type="hidden" name="id" value={category.id} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Name (English)</label>
                        <Input type="text" name="name_en" defaultValue={category.name_en} required placeholder="Enter category name" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Name (Arabic)</label>
                        <Input type="text" name="name_ar" defaultValue={category.name_ar} required placeholder="أدخل اسم الفئة" className="text-right" dir="rtl" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Category Image</label>
                    {category.image_url && (
                        <div className="mb-4">
                            <p className="text-xs text-neutral-600 mb-2">Current Image:</p>
                            <img src={category.image_url} alt="Current" className="h-32 w-32 object-cover rounded-xl shadow-sm border border-neutral-200" />
                        </div>
                    )}
                    <div className="relative">
                        <label className="flex items-center justify-center gap-2 w-full h-24 px-4 py-6 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:border-rose-400 hover:bg-rose-50/50 transition-all group">
                            <Upload className="h-5 w-5 text-neutral-400 group-hover:text-rose-600 transition-colors" />
                            <span className="text-sm text-neutral-600 group-hover:text-rose-600 font-medium transition-colors">
                                {category.image_url ? 'Click to change image' : 'Click to upload image'}
                            </span>
                            <input type="file" name="image" accept="image/*" className="sr-only" />
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        onClick={() => router.back()}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
