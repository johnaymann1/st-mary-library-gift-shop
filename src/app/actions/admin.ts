'use server'

import { revalidatePath } from 'next/cache'
import * as productService from '@/services/products'
import * as categoryService from '@/services/categories'
import * as orderService from '@/services/orders'
import * as storageService from '@/services/storage'
import * as settingsService from '@/services/settings'
import { categorySchema, productSchema, validateImageFile } from '@/utils/validation'

// --- Categories ---

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

// --- Products ---

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

    const updates: productService.UpdateProductData = {
        name_en: nameEn,
        name_ar: nameAr,
        desc_en: descEn,
        desc_ar: descAr,
        price,
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

// --- Orders ---

/**
 * Gets all orders (admin)
 */
export async function getAllOrders(): Promise<{ orders?: ReturnType<typeof orderService.getAllOrders> extends Promise<infer T> ? T : never; error?: string }> {
    const orders = await orderService.getAllOrders()
    if (!orders) {
        return { error: 'Failed to fetch orders' }
    }
    return { orders }
}

/**
 * Updates order status
 */
export async function updateOrderStatus(orderId: number, status: string) {
    const result = await orderService.updateOrderStatus(orderId, status)

    if (result.success) {
        revalidatePath('/admin/orders')
    }

    return result
}

/**
 * Approves payment proof
 */
export async function approvePaymentProof(orderId: number) {
    const result = await orderService.approvePaymentProof(orderId)

    if (result.success) {
        revalidatePath('/admin/orders')
    }

    return result
}

/**
 * Rejects payment proof
 */
export async function rejectPaymentProof(orderId: number, reason?: string) {
    const result = await orderService.rejectPaymentProof(orderId)

    if (result.success) {
        revalidatePath('/admin/orders')
    }

    return result
}

/**
 * Cancels an order by admin
 */
export async function cancelOrderByAdmin(orderId: number, reason?: string) {
    const result = await orderService.cancelOrder(orderId)

    if (result.success) {
        revalidatePath('/admin/orders')
    }

    return result
}

// --- Store Settings ---

/**
 * Updates store settings in the database
 */
export async function updateStoreSettings(formData: FormData) {
    const storeName = formData.get('store_name') as string
    const description = formData.get('description') as string
    const phone = formData.get('phone') as string
    const phone2 = formData.get('phone_2') as string
    const phone3 = formData.get('phone_3') as string
    const address = formData.get('address') as string
    const workingHours = formData.get('working_hours') as string
    const deliveryFee = parseFloat(formData.get('delivery_fee') as string)
    const deliveryTimeDays = formData.get('delivery_time_days') as string
    const freeDeliveryThreshold = formData.get('free_delivery_threshold') as string
    const heroImage = formData.get('hero_image') as File | null
    const instapayEnabled = formData.get('instapay_enabled') === 'on'
    const instapayPhone = formData.get('instapay_phone') as string
    const facebookUrl = formData.get('facebook_url') as string
    const instagramUrl = formData.get('instagram_url') as string
    const twitterUrl = formData.get('twitter_url') as string
    const linkedinUrl = formData.get('linkedin_url') as string

    // Validation
    if (!storeName || !phone || !address || isNaN(deliveryFee)) {
        return { error: 'Please fill in all required fields' }
    }

    // Handle hero image upload if provided
    let heroImageUrl: string | undefined
    if (heroImage && heroImage.size > 0) {
        const uploadResult = await storageService.uploadHeroImage(heroImage)
        if (uploadResult.error) {
            return { error: uploadResult.error }
        }
        heroImageUrl = uploadResult.url
    }

    const result = await settingsService.updateSettings({
        store_name: storeName,
        description: description,
        phone: phone,
        phone_2: phone2 || null,
        phone_3: phone3 || null,
        address: address,
        working_hours: workingHours || null,
        delivery_fee: deliveryFee,
        delivery_time_days: deliveryTimeDays || null,
        free_delivery_threshold: freeDeliveryThreshold ? parseFloat(freeDeliveryThreshold) : null,
        instapay_enabled: instapayEnabled,
        instapay_phone: instapayPhone || null,
        ...(heroImageUrl && { hero_image_url: heroImageUrl }),
        facebook_url: facebookUrl || null,
        instagram_url: instagramUrl || null,
        twitter_url: twitterUrl || null,
        linkedin_url: linkedinUrl || null,
    })

    if (result.error) {
        return { error: result.error }
    }

    // Revalidate all pages that use settings
    revalidatePath('/', 'layout')
    revalidatePath('/admin/settings')
    revalidatePath('/checkout')
    revalidatePath('/not-found')

    return { success: true }
}
