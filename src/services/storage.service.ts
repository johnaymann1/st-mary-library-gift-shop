/**
 * Storage Service
 * Business logic layer for file storage operations.
 * Uses storage repository for data access.
 */
import * as storageRepo from './repositories/storage.repository'

/**
 * Service result type
 */
export interface ServiceResult<T = void> {
    success: boolean
    data?: T
    error?: string
}

/**
 * Storage bucket types
 */
export type StorageBucket = storageRepo.StorageBucket

/**
 * Upload options
 */
export interface UploadOptions {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    compress?: boolean
}

/**
 * Uploads a product image
 */
export async function uploadProductImage(
    file: File,
    options?: UploadOptions
): Promise<ServiceResult<string>> {
    try {
        // Validate file
        const validation = validateImageFile(file, 3 * 1024 * 1024) // 3MB max
        if (!validation.valid) {
            return { success: false, error: validation.error }
        }

        const url = await storageRepo.uploadImage(file, 'products', options)
        return { success: true, data: url }
    } catch (error) {
        console.error('Upload product image error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to upload product image'
        }
    }
}

/**
 * Uploads a category image
 */
export async function uploadCategoryImage(
    file: File,
    options?: UploadOptions
): Promise<ServiceResult<string>> {
    try {
        // Validate file
        const validation = validateImageFile(file, 2 * 1024 * 1024) // 2MB max
        if (!validation.valid) {
            return { success: false, error: validation.error }
        }

        const url = await storageRepo.uploadImage(file, 'categories', options)
        return { success: true, data: url }
    } catch (error) {
        console.error('Upload category image error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to upload category image'
        }
    }
}

/**
 * Uploads a payment proof
 */
export async function uploadPaymentProof(file: File): Promise<ServiceResult<string>> {
    try {
        // Validate file
        const validation = validateImageFile(file, 5 * 1024 * 1024) // 5MB max
        if (!validation.valid) {
            return { success: false, error: validation.error }
        }

        const url = await storageRepo.uploadPaymentProof(file)
        return { success: true, data: url }
    } catch (error) {
        console.error('Upload payment proof error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to upload payment proof'
        }
    }
}

/**
 * Uploads a hero image
 */
export async function uploadHeroImage(file: File): Promise<ServiceResult<string>> {
    try {
        const url = await storageRepo.uploadHeroImage(file)
        return { success: true, data: url }
    } catch (error) {
        console.error('Upload hero image error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to upload hero image'
        }
    }
}

/**
 * Deletes an image from storage
 */
export async function deleteImage(
    bucket: StorageBucket,
    imageUrl: string
): Promise<ServiceResult> {
    try {
        const fileName = storageRepo.extractFilenameFromUrl(imageUrl)
        if (!fileName) {
            return { success: false, error: 'Invalid image URL' }
        }

        await storageRepo.deleteImage(bucket, fileName)
        return { success: true }
    } catch (error) {
        console.error('Delete image error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete image'
        }
    }
}

/**
 * Validates image file
 */
function validateImageFile(
    file: File,
    maxSize: number
): { valid: boolean; error?: string } {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Invalid file type. Only JPG, PNG, and WebP are allowed'
        }
    }

    // Check file size
    if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1)
        return {
            valid: false,
            error: `File size must be less than ${maxSizeMB}MB`
        }
    }

    return { valid: true }
}

/**
 * Gets public URL for a file
 */
export async function getPublicUrl(
    bucket: StorageBucket,
    fileName: string
): Promise<string> {
    try {
        return await storageRepo.getPublicUrl(bucket, fileName)
    } catch (error) {
        console.error('Get public URL error:', error)
        return ''
    }
}
