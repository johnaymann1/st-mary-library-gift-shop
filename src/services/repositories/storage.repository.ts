/**
 * Storage Repository
 * Pure database operations for Supabase Storage.
 * Handles file uploads, compression, and deletion.
 */
import { createClient } from '@/lib/supabase/server'
import sharp from 'sharp'

/**
 * Storage bucket types
 */
export type StorageBucket = 'categories' | 'products' | 'payment-proofs'

/**
 * Image upload options
 */
export interface UploadOptions {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    compress?: boolean
}

/**
 * Default compression settings
 */
const DEFAULT_COMPRESSION: UploadOptions = {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 80,
    compress: true
}

/**
 * Compresses an image buffer using Sharp
 */
async function compressImageBuffer(
    buffer: Buffer,
    options: UploadOptions
): Promise<Buffer> {
    return sharp(buffer)
        .resize(options.maxWidth, options.maxHeight, {
            fit: 'inside',
            withoutEnlargement: true
        })
        .jpeg({ quality: options.quality })
        .toBuffer()
}

/**
 * Generates a safe, unique filename
 */
function generateFilename(originalName: string, prefix: string = ''): string {
    const sanitized = originalName.replace(/[^a-zA-Z0-9.]/g, '-')
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    return `${prefix}${timestamp}-${random}-${sanitized}.jpg`
}

/**
 * Uploads an image to storage with optional compression
 */
export async function uploadImage(
    file: File,
    bucket: StorageBucket,
    options: UploadOptions = {}
): Promise<string> {
    const supabase = await createClient()
    const opts = { ...DEFAULT_COMPRESSION, ...options }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    let imageData: Buffer | Uint8Array = Buffer.from(arrayBuffer)

    // Compress if enabled
    if (opts.compress) {
        try {
            imageData = await compressImageBuffer(Buffer.from(arrayBuffer), opts)
        } catch (error) {
            console.error('Compression failed, using original:', error)
            // Continue with original if compression fails
        }
    }

    const fileName = generateFilename(file.name)

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, imageData, {
            contentType: 'image/jpeg',
            upsert: false
        })

    if (error) throw new Error(`Image upload failed: ${error.message}`)

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

    return publicUrl
}

/**
 * Uploads payment proof (minimal compression, preserves quality)
 */
export async function uploadPaymentProof(file: File): Promise<string> {
    const supabase = await createClient()

    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `proof-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file, {
            contentType: file.type,
            upsert: false
        })

    if (error) throw new Error(`Payment proof upload failed: ${error.message}`)

    const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName)

    return publicUrl
}

/**
 * Uploads hero image with validation
 */
export async function uploadHeroImage(file: File): Promise<string> {
    const supabase = await createClient()

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        throw new Error('Hero image must be less than 5MB')
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
        throw new Error('Hero image must be JPG, PNG, or WebP format')
    }

    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `settings/hero-${Date.now()}.${fileExt}`

    const { error } = await supabase.storage
        .from('products')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (error) throw new Error(`Failed to upload hero image: ${error.message}`)

    const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName)

    return publicUrl
}

/**
 * Deletes an image from storage
 */
export async function deleteImage(bucket: StorageBucket, filePath: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

    if (error) throw new Error(`Failed to delete image: ${error.message}`)
}

/**
 * Extracts filename from public URL
 */
export function extractFilenameFromUrl(url: string): string {
    return url.split('/').pop() || ''
}

/**
 * Gets public URL for an uploaded file
 */
export async function getPublicUrl(bucket: StorageBucket, fileName: string): Promise<string> {
    const supabase = await createClient()

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

    return publicUrl
}

/**
 * Lists all files in a bucket (admin operation)
 */
export async function listFiles(bucket: StorageBucket, path: string = ''): Promise<string[]> {
    const supabase = await createClient()

    const { data, error } = await supabase.storage
        .from(bucket)
        .list(path)

    if (error) throw new Error(`Failed to list files: ${error.message}`)

    return data.map(file => file.name)
}

/**
 * Deletes multiple files from storage
 */
export async function deleteMultipleImages(bucket: StorageBucket, filePaths: string[]): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.storage
        .from(bucket)
        .remove(filePaths)

    if (error) throw new Error(`Failed to delete images: ${error.message}`)
}
