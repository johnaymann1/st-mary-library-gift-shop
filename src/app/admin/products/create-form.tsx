'use client'

import { createProduct } from '@/app/actions/admin'
import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { Plus, Upload, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { siteConfig } from '@/config/site'

import { Category } from '@/types'

export default function CreateProductForm({ categories, onSuccess }: { categories: Pick<Category, 'id' | 'name_en'>[]; onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageName, setImageName] = useState<string>('')
    const [imageError, setImageError] = useState<string>('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        try {
            const formElement = e.currentTarget
            const formData = new FormData(formElement)

            // Ensure the image file is in the FormData if preview exists
            if (fileInputRef.current?.files?.[0]) {
                formData.set('image', fileInputRef.current.files[0])
            }

            const result = await createProduct(formData)

            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success('Product created successfully!')
                formElement.reset()
                setImagePreview(null)
                setImageName('')
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }
                onSuccess?.()
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to create product')
        } finally {
            setLoading(false)
        }
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            // Check file size (5MB limit)
            const maxSize = 5 * 1024 * 1024 // 5MB in bytes
            if (file.size > maxSize) {
                setImageError('Image size must be less than 5MB')
                setImagePreview(null)
                setImageName('')
                e.target.value = '' // Clear the input
                toast.error('Image size must be less than 5MB')
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

    return (
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-800 mb-8 transition-colors">
            <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white transition-colors">Add New Product</h2>

            <form id="create-product-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 transition-colors">Name (English)</label>
                        <Input type="text" name="name_en" required placeholder="Enter product name" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 transition-colors">Name (Arabic)</label>
                        <Input type="text" name="name_ar" required placeholder="أدخل اسم المنتج" className="text-right" dir="rtl" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 transition-colors">Description (English)</label>
                        <textarea name="desc_en" className="flex w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 min-h-[80px]" placeholder="Enter product description" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 transition-colors">Description (Arabic)</label>
                        <textarea name="desc_ar" className="flex w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 min-h-[80px] text-right" dir="rtl" placeholder="أدخل وصف المنتج" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 transition-colors">Price ({siteConfig.currency.code})</label>
                        <Input type="number" name="price" step="0.01" required placeholder="0.00" />
                    </div>

                    <div className="md:col-span-2 p-4 border-2 border-dashed border-rose-200 dark:border-rose-800/50 rounded-xl bg-rose-50/30 dark:bg-rose-900/10 transition-colors">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-rose-100 dark:bg-rose-900/30 rounded-lg transition-colors">
                                <svg className="h-4 w-4 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-neutral-900 dark:text-white transition-colors">Sale & Offers (Optional)</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors">Sale Price ({siteConfig.currency.code})</label>
                                <Input type="number" name="sale_price" step="0.01" placeholder="Leave empty for no sale" />
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 transition-colors">Must be less than regular price</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors">Sale End Date (Optional)</label>
                                <Input type="datetime-local" name="sale_end_date" />
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 transition-colors">Leave empty for ongoing sale</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 transition-colors">Stock Status</label>
                        <div className="pt-2">
                            <Toggle id="in_stock" name="in_stock" defaultChecked label="In Stock" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 transition-colors">Category</label>
                        <select name="category_id" required className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900">
                            <option value="" className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id} className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">{cat.name_en}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 transition-colors">Product Image</label>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            name="image" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            className="sr-only" 
                            id="product-image-input"
                        />
                        {imagePreview ? (
                            <div className="space-y-3">
                                <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20 transition-colors">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg px-4 py-3 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        <span className="text-sm font-medium text-green-700 dark:text-green-300 transition-colors">{imageName}</span>
                                    </div>
                                    <label htmlFor="product-image-input" className="text-sm text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium cursor-pointer transition-colors">
                                        Change
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <label htmlFor="product-image-input" className="flex items-center justify-center gap-2 w-full h-24 px-4 py-6 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl cursor-pointer hover:border-rose-400 dark:hover:border-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-900/10 transition-all group">
                                <Upload className="h-5 w-5 text-neutral-400 dark:text-neutral-500 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" />
                                <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 font-medium transition-colors">Click to upload image</span>
                            </label>
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full gap-2 min-w-[140px] disabled:opacity-70 disabled:cursor-not-wait"
                    size="lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating Product...
                        </>
                    ) : (
                        <>
                            <Plus className="h-4 w-4" />
                            Create Product
                        </>
                    )}
                </Button>
            </form>
        </div>
    )
}
