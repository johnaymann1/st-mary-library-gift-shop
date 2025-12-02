'use client'

import { createProduct } from '@/app/actions/admin'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { Plus, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { siteConfig } from '@/config/site'

import { Category } from '@/types'

export default function CreateProductForm({ categories }: { categories: Pick<Category, 'id' | 'name_en'>[] }) {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)

        const result = await createProduct(formData)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Product created successfully!')
            const form = document.getElementById('create-product-form') as HTMLFormElement
            form?.reset()
        }
        setLoading(false)
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md border border-neutral-200 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-neutral-900">Add New Product</h2>

            <form id="create-product-form" action={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Name (English)</label>
                        <Input type="text" name="name_en" required placeholder="Enter product name" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Name (Arabic)</label>
                        <Input type="text" name="name_ar" required placeholder="أدخل اسم المنتج" className="text-right" dir="rtl" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Description (English)</label>
                        <textarea name="desc_en" className="flex w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 min-h-[80px]" placeholder="Enter product description" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Description (Arabic)</label>
                        <textarea name="desc_ar" className="flex w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 min-h-[80px] text-right" dir="rtl" placeholder="أدخل وصف المنتج" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Price ({siteConfig.currency.code})</label>
                        <Input type="number" name="price" step="0.01" required placeholder="0.00" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Stock Status</label>
                        <div className="pt-2">
                            <Toggle id="in_stock" name="in_stock" defaultChecked label="In Stock" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Category</label>
                        <select name="category_id" required className="flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2">
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name_en}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Product Image</label>
                        <div className="relative">
                            <label className="flex items-center justify-center gap-2 w-full h-24 px-4 py-6 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:border-rose-400 hover:bg-rose-50/50 transition-all group">
                                <Upload className="h-5 w-5 text-neutral-400 group-hover:text-rose-600 transition-colors" />
                                <span className="text-sm text-neutral-600 group-hover:text-rose-600 font-medium transition-colors">Click to upload image</span>
                                <input type="file" name="image" accept="image/*" className="sr-only" />
                            </label>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full gap-2"
                    size="lg"
                >
                    <Plus className="h-4 w-4" />
                    {loading ? 'Creating...' : 'Create Product'}
                </Button>
            </form>
        </div>
    )
}
