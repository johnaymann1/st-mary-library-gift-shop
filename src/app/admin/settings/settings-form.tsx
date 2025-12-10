'use client'

import { updateStoreSettings } from '@/app/actions/admin'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Save, Upload, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { StoreSettings } from '@/utils/settings'
import Image from 'next/image'

export default function SettingsForm({ settings }: { settings: StoreSettings }) {
    const [loading, setLoading] = useState(false)
    const [heroImagePreview, setHeroImagePreview] = useState<string | null>(settings.hero_image_url || null)

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setHeroImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            const result = await updateStoreSettings(formData)

            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success('Settings updated successfully!')
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update settings')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hero Image */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-neutral-900">Hero Image</h2>
                <p className="text-sm text-neutral-600">
                    Upload a new hero image for your homepage. Recommended size: 1920x1080px
                </p>
                
                <div className="space-y-4">
                    {heroImagePreview && (
                        <div className="relative w-full h-64 rounded-lg overflow-hidden border border-neutral-200">
                            <Image
                                src={heroImagePreview}
                                alt="Hero image preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
                            <Upload className="w-4 h-4" />
                            Choose Image
                            <input
                                type="file"
                                name="hero_image"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                        <p className="text-sm text-neutral-500">
                            JPG, PNG or WebP (max 5MB)
                        </p>
                    </div>
                </div>
            </div>

            {/* Store Information */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-neutral-900">Store Information</h2>
                
                <div className="space-y-2">
                    <label htmlFor="store_name" className="block text-sm font-medium text-neutral-700">
                        Store Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        id="store_name"
                        name="store_name"
                        defaultValue={settings.store_name}
                        required
                        placeholder="St. Mary Gift Shop"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        defaultValue={settings.description}
                        rows={3}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Discover a curated collection of books, stationery, and unique gifts..."
                    />
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-neutral-900">Contact Information</h2>
                
                <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        defaultValue={settings.phone}
                        required
                        placeholder="+20 123 456 7890"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="support_email" className="block text-sm font-medium text-neutral-700">
                        Support Email
                    </label>
                    <Input
                        type="email"
                        id="support_email"
                        name="support_email"
                        defaultValue={settings.support_email || ''}
                        placeholder="support@stmarylibrary.com (optional)"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="address" className="block text-sm font-medium text-neutral-700">
                        Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        id="address"
                        name="address"
                        defaultValue={settings.address}
                        required
                        placeholder="St Mary Church Faggalah, Cairo, Egypt"
                    />
                </div>
            </div>

            {/* Delivery Settings */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-neutral-900">Delivery Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="delivery_fee" className="block text-sm font-medium text-neutral-700">
                            Delivery Fee (EGP) <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            id="delivery_fee"
                            name="delivery_fee"
                            defaultValue={settings.delivery_fee}
                            required
                            min="0"
                            step="0.01"
                            placeholder="50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="free_delivery_threshold" className="block text-sm font-medium text-neutral-700">
                            Free Delivery Threshold (EGP)
                        </label>
                        <Input
                            type="number"
                            id="free_delivery_threshold"
                            name="free_delivery_threshold"
                            defaultValue={settings.free_delivery_threshold || ''}
                            min="0"
                            step="0.01"
                            placeholder="1000 (optional)"
                        />
                        <p className="text-xs text-neutral-500">
                            Leave empty for no free delivery threshold
                        </p>
                    </div>
                </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-neutral-900">Social Media Links</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="facebook_url" className="block text-sm font-medium text-neutral-700">
                            Facebook URL
                        </label>
                        <Input
                            type="url"
                            id="facebook_url"
                            name="facebook_url"
                            defaultValue={settings.facebook_url || ''}
                            placeholder="https://facebook.com/yourpage"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="instagram_url" className="block text-sm font-medium text-neutral-700">
                            Instagram URL
                        </label>
                        <Input
                            type="url"
                            id="instagram_url"
                            name="instagram_url"
                            defaultValue={settings.instagram_url || ''}
                            placeholder="https://instagram.com/yourpage"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="twitter_url" className="block text-sm font-medium text-neutral-700">
                            Twitter URL
                        </label>
                        <Input
                            type="url"
                            id="twitter_url"
                            name="twitter_url"
                            defaultValue={settings.twitter_url || ''}
                            placeholder="https://twitter.com/yourpage"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="linkedin_url" className="block text-sm font-medium text-neutral-700">
                            LinkedIn URL
                        </label>
                        <Input
                            type="url"
                            id="linkedin_url"
                            name="linkedin_url"
                            defaultValue={settings.linkedin_url || ''}
                            placeholder="https://linkedin.com/company/yourpage"
                        />
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={loading}
                    className="min-w-[120px]"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
