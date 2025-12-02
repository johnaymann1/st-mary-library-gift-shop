'use client'

import { createCategory } from '@/app/actions/admin'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Upload } from 'lucide-react'
import { toast } from 'sonner'

export default function CreateCategoryForm() {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)

        const result = await createCategory(formData)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Category created successfully!')
            const form = document.getElementById('create-category-form') as HTMLFormElement
            form?.reset()
        }
        setLoading(false)
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md border border-neutral-200 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-neutral-900">Add New Category</h2>

            <form id="create-category-form" action={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Name (English)</label>
                        <Input type="text" name="name_en" required placeholder="Enter category name" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Name (Arabic)</label>
                        <Input type="text" name="name_ar" required placeholder="أدخل اسم الفئة" className="text-right" dir="rtl" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Category Image</label>
                    <div className="relative">
                        <label className="flex items-center justify-center gap-2 w-full h-24 px-4 py-6 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:border-rose-400 hover:bg-rose-50/50 transition-all group">
                            <Upload className="h-5 w-5 text-neutral-400 group-hover:text-rose-600 transition-colors" />
                            <span className="text-sm text-neutral-600 group-hover:text-rose-600 font-medium transition-colors">Click to upload image</span>
                            <input type="file" name="image" accept="image/*" className="sr-only" />
                        </label>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full gap-2"
                    size="lg"
                >
                    <Plus className="h-4 w-4" />
                    {loading ? 'Creating...' : 'Create Category'}
                </Button>
            </form>
        </div>
    )
}
