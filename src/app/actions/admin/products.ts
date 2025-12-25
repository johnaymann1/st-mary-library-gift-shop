'use server'

import { revalidatePath } from 'next/cache'
import * as productService from '@/services/products'
import * as storageService from '@/services/storage'
import { productSchema, validateImageFile } from '@/utils/validation'

/**
 * Admin Product Actions
 * Server-side only functions for product management
 */

/**
 * Creates a new product
 */
export async function createProduct(formData: FormData) {
    // Validate input
    const rawData = {
        name_en: formData.get('name_en'),
        name_ar: formData.get('name_ar'),
        desc_en: formData.get('desc_en') || '',
        desc_ar: formData.get('desc_ar') || '',
        price: parseFloat(formData.get('price') as string),
        in_stock: formData.get('in_stock') === 'on',
        category_id: parseInt(formData.get('category_id') as string),
        image: formData.get('image')
    }

    const validationResult = productSchema.safeParse(rawData)
    if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors
        const errorMessage = Object.values(errors).flat()[0] || 'Validation failed'
        return { error: errorMessage }
    }

    const { name_en: nameEn, name_ar: nameAr, desc_en: descEn, desc_ar: descAr, price, in_stock: inStock, category_id: categoryId } = validationResult.data
    const imageFile = formData.get('image') as File

    // Get sale fields
    const salePrice = formData.get('sale_price') ? parseFloat(formData.get('sale_price') as string) : null
    const saleEndDate = formData.get('sale_end_date') ? formData.get('sale_end_date') as string : null

    // Validate sale price is less than regular price
    if (salePrice && salePrice >= price) {
        return { error: 'Sale price must be less than regular price' }
    }

    let imageUrl: string | null = null
    if (imageFile && imageFile.size > 0) {
        // Validate image file
        const fileValidation = validateImageFile(imageFile)
        if (!fileValidation.valid) {
            return { error: fileValidation.error || 'Invalid image file' }
        }

        const uploadResult = await storageService.uploadImage(imageFile, 'products')
        if (uploadResult.error) {
            return { error: uploadResult.error }
        }
        imageUrl = uploadResult.url ?? null
    }

    const createProductResult = await productService.createProduct({
        name_en: nameEn,
        name_ar: nameAr,
        desc_en: descEn,
        desc_ar: descAr,
        price,
        sale_price: salePrice,
        sale_end_date: saleEndDate,
        in_stock: inStock,
        category_id: categoryId,
        image_url: imageUrl,
        is_active: true
    })

    if (createProductResult.error) {
        return { error: createProductResult.error }
    }

    revalidatePath('/admin/products')
    revalidatePath('/')
    revalidatePath('/product/[id]', 'page')
    revalidatePath('/category/[id]', 'page')
    return { success: true }
}

/**
 * Updates an existing product
 */
export async function updateProduct(formData: FormData) {
    const id = parseInt(formData.get('id') as string)
    if (isNaN(id) || id < 1) {
        return { error: 'Invalid product ID' }
    }

    // Validate input
    const rawData = {
        name_en: formData.get('name_en'),
        name_ar: formData.get('name_ar'),
        desc_en: formData.get('desc_en') || '',
        desc_ar: formData.get('desc_ar') || '',
        price: parseFloat(formData.get('price') as string),
        in_stock: formData.get('in_stock') === 'on',
        category_id: parseInt(formData.get('category_id') as string),
        image: formData.get('image')
    }

    const validationResult = productSchema.safeParse(rawData)
    if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors
        const errorMessage = Object.values(errors).flat()[0] || 'Validation failed'
        return { error: errorMessage }
    }

    const { name_en: nameEn, name_ar: nameAr, desc_en: descEn, desc_ar: descAr, price, in_stock: inStock, category_id: categoryId } = validationResult.data
    const imageFile = formData.get('image') as File

    // Get sale fields
    const salePrice = formData.get('sale_price') ? parseFloat(formData.get('sale_price') as string) : null
    const saleEndDate = formData.get('sale_end_date') ? formData.get('sale_end_date') as string : null

    // Validate sale price is less than regular price
    if (salePrice && salePrice >= price) {
        return { error: 'Sale price must be less than regular price' }
    }

    const updates: productService.UpdateProductData = {
        name_en: nameEn,
        name_ar: nameAr,
        desc_en: descEn,
        desc_ar: descAr,
        price,
        sale_price: salePrice,
        sale_end_date: saleEndDate,
        in_stock: inStock,
        category_id: categoryId,
    }

    if (imageFile && imageFile.size > 0) {
        // Validate image file
        const fileValidation = validateImageFile(imageFile)
        if (!fileValidation.valid) {
            return { error: fileValidation.error || 'Invalid image file' }
        }

        const uploadResult = await storageService.uploadImage(imageFile, 'products')
        if (uploadResult.error) {
            return { error: uploadResult.error }
        }
        if (uploadResult.url) {
            updates.image_url = uploadResult.url
        }
    }

    const updateProductResult = await productService.updateProduct(id, updates)

    if (updateProductResult.error) {
        return { error: updateProductResult.error }
    }

    revalidatePath('/admin/products')
    revalidatePath('/')
    revalidatePath('/product/[id]', 'page')
    revalidatePath('/category/[id]', 'page')
    return { success: true }
}

/**
 * Deletes a product by ID
 */
export async function deleteProduct(id: number) {
    const result = await productService.deleteProduct(id)

    if (result.error) {
        return { error: result.error }
    }

    revalidatePath('/admin/products')
    revalidatePath('/')
    revalidatePath('/product/[id]', 'page')
    revalidatePath('/category/[id]', 'page')
    return { success: true }
}
