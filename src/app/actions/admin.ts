'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import sharp from 'sharp'

/**
 * Uploads and compresses an image to Supabase storage
 * @param file - The image file to upload
 * @param bucket - The storage bucket ('categories' or 'products')
 * @returns The public URL of the uploaded image
 * @throws Error if upload fails
 */
async function uploadImage(file: File, bucket: 'categories' | 'products') {
    const supabase = await createClient()

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Compress image using sharp (max 1200x1200, 80% quality)
    const compressedBuffer = await sharp(buffer)
        .resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: true
        })
        .jpeg({ quality: 80 })
        .toBuffer()

    // Sanitize filename: remove non-ascii, replace spaces with dashes, add timestamp
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '-')}.jpg`

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, compressedBuffer, {
            contentType: 'image/jpeg',
            upsert: false
        })

    if (error) {
        throw new Error(`Image upload failed: ${error.message}`)
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

    return publicUrl
}

// --- Categories ---

/**
 * Creates a new category with optional image
 * @param formData - Form data containing name_en, name_ar, and optional image file
 * @returns Success status or error message
 */
export async function createCategory(formData: FormData) {
    const supabase = await createClient()

    const nameEn = formData.get('name_en') as string
    const nameAr = formData.get('name_ar') as string
    const imageFile = formData.get('image') as File

    let imageUrl = null
    if (imageFile && imageFile.size > 0) {
        try {
            imageUrl = await uploadImage(imageFile, 'categories')
        } catch (e) {
            return { error: e instanceof Error ? e.message : 'Image upload failed' }
        }
    }

    const { error } = await supabase
        .from('categories')
        .insert({
            name_en: nameEn,
            name_ar: nameAr,
            image_url: imageUrl,
            is_active: true
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/categories')
    revalidatePath('/')
    revalidatePath('/category/[id]', 'page')
    return { success: true }
}

/**
 * Deletes a category by ID (only if no products are associated)
 * @param id - The category ID to delete
 * @returns Success status or error message if products exist
 */
export async function deleteCategory(id: number) {
    const supabase = await createClient()

    // Check if products exist
    const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', id)

    if (count && count > 0) {
        return { error: 'Cannot delete category with existing products.' }
    }

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/categories')
    revalidatePath('/')
    revalidatePath('/category/[id]', 'page')
    return { success: true }
}

// --- Products ---

export async function createProduct(formData: FormData) {
    const supabase = await createClient()

    const nameEn = formData.get('name_en') as string
    const nameAr = formData.get('name_ar') as string
    const descEn = formData.get('desc_en') as string
    const descAr = formData.get('desc_ar') as string
    const price = parseFloat(formData.get('price') as string)
    const inStock = formData.get('in_stock') === 'on' // New toggle logic
    const categoryId = parseInt(formData.get('category_id') as string)
    const imageFile = formData.get('image') as File

    let imageUrl = null
    if (imageFile && imageFile.size > 0) {
        try {
            imageUrl = await uploadImage(imageFile, 'products')
        } catch (e) {
            return { error: e instanceof Error ? e.message : 'Image upload failed' }
        }
    }

    const { error } = await supabase
        .from('products')
        .insert({
            name_en: nameEn,
            name_ar: nameAr,
            desc_en: descEn,
            desc_ar: descAr,
            price: price,
            in_stock: inStock, // Changed from stock_quantity
            category_id: categoryId,
            image_url: imageUrl,
            is_active: true
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/products')
    revalidatePath('/')
    revalidatePath('/product/[id]', 'page')
    revalidatePath('/category/[id]', 'page')
    return { success: true }
}

export async function updateCategory(formData: FormData) {
    const supabase = await createClient()

    const id = parseInt(formData.get('id') as string)
    const nameEn = formData.get('name_en') as string
    const nameAr = formData.get('name_ar') as string
    const imageFile = formData.get('image') as File

    const updates: Record<string, string> = {
        name_en: nameEn,
        name_ar: nameAr,
    }

    if (imageFile && imageFile.size > 0) {
        try {
            const imageUrl = await uploadImage(imageFile, 'categories')
            updates.image_url = imageUrl
        } catch (e) {
            return { error: e instanceof Error ? e.message : 'Image upload failed' }
        }
    }

    const { error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/categories')
    revalidatePath('/')
    revalidatePath('/category/[id]', 'page')
    return { success: true }
}

export async function updateProduct(formData: FormData) {
    const supabase = await createClient()

    const id = parseInt(formData.get('id') as string)
    const nameEn = formData.get('name_en') as string
    const nameAr = formData.get('name_ar') as string
    const descEn = formData.get('desc_en') as string
    const descAr = formData.get('desc_ar') as string
    const price = parseFloat(formData.get('price') as string)
    const inStock = formData.get('in_stock') === 'on'
    const categoryId = parseInt(formData.get('category_id') as string)
    const imageFile = formData.get('image') as File

    const updates: Record<string, string | number | boolean> = {
        name_en: nameEn,
        name_ar: nameAr,
        desc_en: descEn,
        desc_ar: descAr,
        price: price,
        in_stock: inStock,
        category_id: categoryId,
    }

    if (imageFile && imageFile.size > 0) {
        try {
            const imageUrl = await uploadImage(imageFile, 'products')
            updates.image_url = imageUrl
        } catch (e) {
            return { error: e instanceof Error ? e.message : 'Image upload failed' }
        }
    }

    const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/products')
    revalidatePath('/')
    revalidatePath('/product/[id]', 'page')
    revalidatePath('/category/[id]', 'page')
    return { success: true }
}

export async function deleteProduct(id: number) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/products')
    revalidatePath('/')
    revalidatePath('/product/[id]', 'page')
    revalidatePath('/category/[id]', 'page')
    return { success: true }
}

// --- Orders ---

export async function getAllOrders() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            user:users(email, full_name),
            items:order_items(
                id,
                quantity,
                price_at_purchase,
                product:products(id, name_en, name_ar, image_url)
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        return { error: error.message, orders: [] }
    }

    return { orders: data || [] }
}

export async function updateOrderStatus(orderId: number, status: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/orders')
    return { success: true }
}

export async function approvePaymentProof(orderId: number) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('orders')
        .update({ status: 'processing' })
        .eq('id', orderId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/orders')
    return { success: true }
}

export async function rejectPaymentProof(orderId: number, reason?: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('orders')
        .update({ 
            status: 'cancelled',
            payment_proof_url: null
        })
        .eq('id', orderId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/orders')
    return { success: true }
}

export async function cancelOrderByAdmin(orderId: number, reason?: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/orders')
    return { success: true }
}

/**
 * Updates store settings in the database
 * @param formData - Form data containing the settings to update
 * @returns Success or error object
 */
export async function updateStoreSettings(formData: FormData) {
    const supabase = await createClient()

    const storeName = formData.get('store_name') as string
    const description = formData.get('description') as string
    const phone = formData.get('phone') as string
    const supportEmail = formData.get('support_email') as string
    const address = formData.get('address') as string
    const deliveryFee = parseFloat(formData.get('delivery_fee') as string)
    const freeDeliveryThreshold = formData.get('free_delivery_threshold') as string
    const facebookUrl = formData.get('facebook_url') as string
    const instagramUrl = formData.get('instagram_url') as string
    const twitterUrl = formData.get('twitter_url') as string
    const linkedinUrl = formData.get('linkedin_url') as string

    // Validation
    if (!storeName || !phone || !supportEmail || !address || isNaN(deliveryFee)) {
        return { error: 'Please fill in all required fields' }
    }

    const { error } = await supabase
        .from('store_settings')
        .update({
            store_name: storeName,
            description: description,
            phone: phone,
            support_email: supportEmail,
            address: address,
            delivery_fee: deliveryFee,
            free_delivery_threshold: freeDeliveryThreshold ? parseFloat(freeDeliveryThreshold) : null,
            facebook_url: facebookUrl || null,
            instagram_url: instagramUrl || null,
            twitter_url: twitterUrl || null,
            linkedin_url: linkedinUrl || null,
            updated_at: new Date().toISOString(),
        })
        .eq('id', 1)

    if (error) {
        return { error: error.message }
    }

    // Revalidate all pages that use settings
    revalidatePath('/', 'layout')
    revalidatePath('/admin/settings')
    revalidatePath('/checkout')
    revalidatePath('/not-found')
    
    return { success: true }
}
