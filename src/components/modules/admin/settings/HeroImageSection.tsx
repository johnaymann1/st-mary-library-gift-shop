'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import Image from 'next/image'

interface HeroImageSectionProps {
    initialImage: string | null
}

export function HeroImageSection({ initialImage }: HeroImageSectionProps) {
    const [heroImagePreview, setHeroImagePreview] = useState<string | null>(initialImage)

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

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Hero Image</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Upload a new hero image for your homepage. Recommended size: 1920x1080px (max 5MB)
            </p>
            
            <div className="space-y-4">
                {heroImagePreview && (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 transition-colors">
                        <Image
                            src={heroImagePreview}
                            alt="Hero image preview"
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 cursor-pointer transition-colors">
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
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 transition-colors">
                        JPG, PNG or WebP (max 5MB)
                    </p>
                </div>
            </div>
        </div>
    )
}
