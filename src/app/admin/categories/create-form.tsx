'use client'

import { createCategory } from '@/app/actions/admin'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Upload, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function CreateCategoryForm({ onSuccess }: { onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageName, setImageName] = useState<string>('')

    async function handleSubmit(formData: FormData) {
        setLoading(true)

        try {
            const result = await createCategory(formData)

            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success('Category created successfully!')
                const form = document.getElementById('create-category-form') as HTMLFormElement
                form?.reset()
                setImagePreview(null)
                setImageName('')
                onSuccess?.()
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to create category')
        } finally {
            setLoading(false)
        }
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            setImageName(file.name)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
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
                    {imagePreview ? (
                        <div className="space-y-3">
                            <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-green-500 bg-green-50">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-green-600" />
                                    <span className="text-sm font-medium text-green-700">{imageName}</span>
                                </div>
                                <label className="text-sm text-rose-600 hover:text-rose-700 font-medium cursor-pointer">
                                    Change
                                    <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="sr-only" />
                                </label>
                            </div>
                        </div>
                    ) : (
                        <label className="flex items-center justify-center gap-2 w-full h-24 px-4 py-6 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:border-rose-400 hover:bg-rose-50/50 transition-all group">
                            <Upload className="h-5 w-5 text-neutral-400 group-hover:text-rose-600 transition-colors" />
                            <span className="text-sm text-neutral-600 group-hover:text-rose-600 font-medium transition-colors">Click to upload image</span>
                            <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="sr-only" />
                        </label>
                    )}
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
