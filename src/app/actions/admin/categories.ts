'use server'

import { revalidatePath } from 'next/cache'
import * as categoryService from '@/services/categories'
import * as storageService from '@/services/storage'
import { categorySchema, validateImageFile } from '@/utils/validation'

/**
 * Admin Category Actions
 * Server-side only functions for category management
 */

/**
 * Creates a new category with optional image
 */
export async function createCategory(formData: FormData) {
    // Validate input
    const rawData = {
        name_en: formData.get('name_en'),
        name_ar: formData.get('name_ar'),
        image: formData.get('image')
    }

    const result = categorySchema.safeParse(rawData)
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        const errorMessage = Object.values(errors).flat()[0] || 'Validation failed'
        return { error: errorMessage }
    }

    const { name_en: nameEn, name_ar: nameAr } = result.data
    const imageFile = formData.get('image') as File

    let imageUrl: string | null = null
    if (imageFile && imageFile.size > 0) {
        // Validate image file
        const fileValidation = validateImageFile(imageFile)
        if (!fileValidation.valid) {
            return { error: fileValidation.error || 'Invalid image file' }
        }

        const uploadResult = await storageService.uploadImage(imageFile, 'categories')
        if (uploadResult.error) {
            return { error: uploadResult.error }
        }
        imageUrl = uploadResult.url ?? null
    }

    const createResult = await categoryService.createCategory({
        name_en: nameEn,
        name_ar: nameAr,
        image_url: imageUrl,
        is_active: true
    })

    if (createResult.error) {
        return { error: createResult.error }
    }

    revalidatePath('/admin/categories')
    revalidatePath('/')
    revalidatePath('/category/[id]', 'page')
    return { success: true }
}

/**
 * Updates an existing category
 */
export async function updateCategory(formData: FormData) {
    const id = parseInt(formData.get('id') as string)
    if (isNaN(id) || id < 1) {
        return { error: 'Invalid category ID' }
    }

    // Validate input
    const rawData = {
        name_en: formData.get('name_en'),
        name_ar: formData.get('name_ar'),
        image: formData.get('image')
    }

    const validationResult = categorySchema.safeParse(rawData)
    if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors
        const errorMessage = Object.values(errors).flat()[0] || 'Validation failed'
        return { error: errorMessage }
    }

    const { name_en: nameEn, name_ar: nameAr } = validationResult.data
    const imageFile = formData.get('image') as File

    const updates: { name_en: string; name_ar: string; image_url?: string } = {
        name_en: nameEn,
        name_ar: nameAr,
    }

    if (imageFile && imageFile.size > 0) {
        // Validate image file
        const fileValidation = validateImageFile(imageFile)
        if (!fileValidation.valid) {
            return { error: fileValidation.error || 'Invalid image file' }
        }

        const uploadResult = await storageService.uploadImage(imageFile, 'categories')
        if (uploadResult.error) {
            return { error: uploadResult.error }
        }
        if (uploadResult.url) {
            updates.image_url = uploadResult.url
        }
    }

    const updateResult = await categoryService.updateCategory(id, updates)

    if (updateResult.error) {
        return { error: updateResult.error }
    }

    revalidatePath('/admin/categories')
    revalidatePath('/')
    revalidatePath('/category/[id]', 'page')
    return { success: true }
}

/**
 * Deletes a category by ID (only if no products are associated)
 */
export async function deleteCategory(id: number) {
    const result = await categoryService.deleteCategory(id)

    if (result.error) {
        return { error: result.error }
    }

    revalidatePath('/admin/categories')
    revalidatePath('/')
    revalidatePath('/category/[id]', 'page')
    return { success: true }
}
