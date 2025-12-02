'use client'

import { updateProduct } from '@/app/actions/admin'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { Upload, Save, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { siteConfig } from '@/config/site'

import { Product, Category } from '@/types'

export default function EditProductForm({ product, categories }: { product: Product, categories: Pick<Category, 'id' | 'name_en'>[] }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)

        const result = await updateProduct(formData)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Product updated successfully!')
            router.refresh()
            router.push('/admin/products')
        }
        setLoading(false)
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md border border-neutral-200">
            <Button
                variant="ghost"
                onClick={() => router.push('/admin/products')}
                className="mb-4 text-neutral-600 hover:text-rose-600 hover:bg-rose-50"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
            </Button>
            <h2 className="text-2xl font-bold mb-6 text-neutral-900">Edit Product</h2>

            <form action={handleSubmit} className="space-y-6">
                <input type="hidden" name="id" value={product.id} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Name (English)</label>
                        <Input type="text" name="name_en" defaultValue={product.name_en} required placeholder="Enter product name" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Name (Arabic)</label>
                        <Input type="text" name="name_ar" defaultValue={product.name_ar} required placeholder="أدخل اسم المنتج" className="text-right" dir="rtl" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Description (English)</label>
                        <textarea name="desc_en" defaultValue={product.desc_en || ''} className="flex w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 min-h-[80px]" placeholder="Enter product description" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Description (Arabic)</label>
                        <textarea name="desc_ar" defaultValue={product.desc_ar || ''} className="flex w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 min-h-[80px] text-right" dir="rtl" placeholder="أدخل وصف المنتج" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Price ({siteConfig.currency.code})</label>
                        <Input type="number" name="price" step="0.01" defaultValue={product.price} required placeholder="0.00" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Stock Status</label>
                        <div className="pt-2">
                            <Toggle id="in_stock" name="in_stock" defaultChecked={product.in_stock} label="In Stock" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Category</label>
                        <select name="category_id" defaultValue={product.category_id || ''} required className="flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2">
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name_en}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Product Image</label>
                    {product.image_url && (
                        <div className="mb-4">
                            <p className="text-xs text-neutral-600 mb-2">Current Image:</p>
                            <img src={product.image_url} alt="Current" className="h-32 w-32 object-cover rounded-xl shadow-sm border border-neutral-200" />
                        </div>
                    )}
                    <div className="relative">
                        <label className="flex items-center justify-center gap-2 w-full h-24 px-4 py-6 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:border-rose-400 hover:bg-rose-50/50 transition-all group">
                            <Upload className="h-5 w-5 text-neutral-400 group-hover:text-rose-600 transition-colors" />
                            <span className="text-sm text-neutral-600 group-hover:text-rose-600 font-medium transition-colors">
                                {product.image_url ? 'Click to change image' : 'Click to upload image'}
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
