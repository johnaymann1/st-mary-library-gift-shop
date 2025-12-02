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
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageName, setImageName] = useState<string>('')
    const [imageError, setImageError] = useState<string>('')
    const router = useRouter()

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Check file size (5MB limit)
            const maxSize = 5 * 1024 * 1024 // 5MB in bytes
            if (file.size > maxSize) {
                setImageError('Image size must be less than 5MB')
                setImagePreview(null)
                setImageName('')
                e.target.value = '' // Clear the input
                return
            }

            setImageError('')
            setImageName(file.name)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    async function handleSubmit(formData: FormData) {
        setLoading(true)

        try {
            // Compress image if present
            const imageFile = formData.get('image') as File
            if (imageFile && imageFile.size > 0) {
                // Compress image if it's larger than 1MB
                if (imageFile.size > 1024 * 1024) {
                    toast.info('Compressing image...')
                    const compressedImage = await compressImage(imageFile)
                    formData.set('image', compressedImage)
                }
            }

            const result = await updateCategory(formData)

            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success('Category updated successfully!')
                router.refresh()
                router.push('/admin/categories')
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update category')
        } finally {
            setLoading(false)
        }
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
                    {category.image_url && !imagePreview && (
                        <div className="mb-4">
                            <p className="text-xs text-neutral-600 mb-2">Current Image:</p>
                            <img src={category.image_url} alt="Current" className="h-32 w-32 object-cover rounded-xl shadow-sm border border-neutral-200" />
                        </div>
                    )}
                    {imagePreview && (
                        <div className="mb-4">
                            <p className="text-xs text-neutral-600 mb-2">New Image Preview:</p>
                            <div className="relative inline-block">
                                <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-xl shadow-sm border-2 border-green-500" />
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-green-600 mt-1">{imageName}</p>
                        </div>
                    )}
                    {imageError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{imageError}</p>
                        </div>
                    )}
                    <div className="relative">
                        <label className="flex items-center justify-center gap-2 w-full h-24 px-4 py-6 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:border-rose-400 hover:bg-rose-50/50 transition-all group">
                            <Upload className="h-5 w-5 text-neutral-400 group-hover:text-rose-600 transition-colors" />
                            <span className="text-sm text-neutral-600 group-hover:text-rose-600 font-medium transition-colors">
                                {imagePreview || category.image_url ? 'Click to change image' : 'Click to upload image'}
                            </span>
                            <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="sr-only" />
                        </label>
                        <p className="text-xs text-neutral-500 mt-2">Maximum file size: 5MB</p>
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
