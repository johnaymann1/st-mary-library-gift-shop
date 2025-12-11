/**
 * Storage Service
 * Centralized image upload and storage operations.
 */
import { createClient } from '@/lib/supabase/server'
import sharp from 'sharp'

export type StorageBucket = 'categories' | 'products' | 'payment-proofs'

export interface UploadOptions {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    compress?: boolean
}

const DEFAULT_OPTIONS: UploadOptions = {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 80,
    compress: true
}

/**
 * Compresses an image using sharp
 */
async function compressImage(buffer: Buffer, options: UploadOptions): Promise<Buffer> {
    return sharp(buffer)
        .resize(options.maxWidth, options.maxHeight, {
            fit: 'inside',
            withoutEnlargement: true
        })
        .jpeg({ quality: options.quality })
        .toBuffer()
}

/**
 * Generates a safe filename for storage
 */
function generateSafeFilename(originalName: string, prefix: string = ''): string {
    const sanitized = originalName.replace(/[^a-zA-Z0-9.]/g, '-')
    return `${prefix}${Date.now()}-${sanitized}.jpg`
}

/**
 * Uploads and optionally compresses an image to Supabase storage
 */
export async function uploadImage(
    file: File,
    bucket: StorageBucket,
    options: UploadOptions = {}
): Promise<{ url?: string; error?: string }> {
    const supabase = await createClient()
    const opts = { ...DEFAULT_OPTIONS, ...options }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    let imageData: Buffer | Uint8Array = Buffer.from(arrayBuffer)

    // Compress if enabled
    if (opts.compress) {
        try {
            imageData = await compressImage(Buffer.from(arrayBuffer), opts)
        } catch {
            // Continue with original buffer if compression fails
        }
    }

    const fileName = generateSafeFilename(file.name)

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, imageData, {
            contentType: 'image/jpeg',
            upsert: false
        })

    if (error) {
        return { error: `Image upload failed: ${error.message}` }
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

    return { url: publicUrl }
}

/**
 * Uploads a payment proof image (minimal compression)
 */
export async function uploadPaymentProof(file: File): Promise<{ url?: string; error?: string }> {
    const supabase = await createClient()

    const fileExt = file.name.split('.').pop()
    const fileName = `proof-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file)

    if (error) {
        return { error: `Image upload failed: ${error.message}` }
    }

    const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName)

    return { url: publicUrl }
}

/**
 * Uploads a hero image for store settings
 */
export async function uploadHeroImage(file: File): Promise<{ url?: string; error?: string }> {
    const supabase = await createClient()

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        return { error: 'Hero image must be less than 5MB' }
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
        return { error: 'Hero image must be JPG, PNG, or WebP format' }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `settings/hero-${Date.now()}.${fileExt}`

    const { error } = await supabase.storage
        .from('products')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (error) {
        return { error: `Failed to upload hero image: ${error.message}` }
    }

    const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName)

    return { url: publicUrl }
}

/**
 * Deletes an image from storage
 */
export async function deleteImage(bucket: StorageBucket, filePath: string): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()

    const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}
