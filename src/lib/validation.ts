import { z } from 'zod'

// Egyptian phone number format: 01xxxxxxxxx (11 digits starting with 01)
const egyptianPhoneRegex = /^01[0-9]{9}$/

// User Registration Schema
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
    phone: z.string().regex(egyptianPhoneRegex, 'Phone must be 11 digits starting with 01 (e.g., 01012345678)').optional()
})

// Login Schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
})

// Address Schema
export const addressSchema = z.object({
    label: z.string().min(2, 'Label is required (e.g., Home, Work)').max(50, 'Label is too long'),
    address: z.string().min(10, 'Address must be at least 10 characters').max(500, 'Address is too long'),
    is_default: z.boolean().optional()
})

// Phone Update Schema
export const phoneSchema = z.object({
    phone: z.string().regex(egyptianPhoneRegex, 'Phone must be 11 digits starting with 01 (e.g., 01012345678)')
})

// Checkout Schema
export const checkoutSchema = z.object({
    delivery_type: z.enum(['delivery', 'pickup']),
    address: z.string().min(10, 'Address is required for delivery').max(500, 'Address is too long').optional(),
    phone: z.string().regex(egyptianPhoneRegex, 'Phone must be 11 digits starting with 01').optional(),
    payment_method: z.enum(['cash', 'instapay']),
    proof_image: z.any().optional() // File validation done separately
}).refine(
    (data) => {
        // If delivery type is delivery, address and phone are required
        if (data.delivery_type === 'delivery') {
            return !!data.address && !!data.phone
        }
        return true
    },
    {
        message: 'Address and phone are required for home delivery',
        path: ['address']
    }
).refine(
    (data) => {
        // If payment method is instapay, proof image is required (checked in action)
        return true
    },
    {
        message: 'Payment proof is required for InstaPay',
        path: ['proof_image']
    }
)

// Product Schema (Admin)
export const productSchema = z.object({
    name_en: z.string().min(2, 'English name is required').max(200, 'Name is too long'),
    name_ar: z.string().min(2, 'Arabic name is required').max(200, 'Name is too long'),
    desc_en: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description is too long'),
    desc_ar: z.string().min(10, 'Arabic description must be at least 10 characters').max(2000, 'Description is too long'),
    price: z.number().min(0.01, 'Price must be greater than 0').max(1000000, 'Price is too high'),
    in_stock: z.boolean(),
    category_id: z.number().int('Invalid category').min(1, 'Category is required'),
    image: z.any().optional() // File validation
})

// Category Schema (Admin)
export const categorySchema = z.object({
    name_en: z.string().min(2, 'English name is required').max(100, 'Name is too long'),
    name_ar: z.string().min(2, 'Arabic name is required').max(100, 'Name is too long'),
    image: z.any().optional() // File validation
})

// Order Status Update Schema (Admin)
export const orderStatusSchema = z.object({
    status: z.enum([
        'pending_payment',
        'payment_confirmation_pending',
        'processing',
        'wrapping',
        'out_for_delivery',
        'completed',
        'cancelled'
    ]),
    admin_notes: z.string().max(500, 'Notes are too long').optional()
})

// Search & Filter Schema
export const searchSchema = z.object({
    q: z.string().max(200, 'Search query is too long').optional(),
    category: z.string().optional(),
    sort: z.enum(['newest', 'price-asc', 'price-desc', 'name']).optional(),
    page: z.string().regex(/^\d+$/, 'Invalid page number').optional()
})

// Helper function to validate FormData
export function validateFormData<T>(schema: z.ZodSchema<T>, formData: FormData): {
    success: boolean
    data?: T
    errors?: Record<string, string>
} {
    const rawData: Record<string, unknown> = {}

    // Convert FormData to object
    formData.forEach((value, key) => {
        // Handle checkboxes (boolean values)
        if (value === 'on') {
            rawData[key] = true
        } else if (key.includes('is_') || key.includes('in_')) {
            rawData[key] = value === 'true' || value === 'on'
        }
        // Handle numbers
        else if (key === 'price' || key === 'category_id') {
            rawData[key] = parseFloat(value as string)
        }
        // Handle files (keep as-is for file validation)
        else if (value instanceof File) {
            rawData[key] = value
        }
        // Regular strings
        else {
            rawData[key] = value
        }
    })

    const result = schema.safeParse(rawData)

    if (result.success) {
        return {
            success: true,
            data: result.data
        }
    } else {
        const errors: Record<string, string> = {}
        result.error.issues.forEach((err) => {
            const path = err.path.join('.')
            errors[path] = err.message
        })
        return {
            success: false,
            errors
        }
    }
}

// Helper for image file validation
export function validateImageFile(file: File | null): {
    valid: boolean
    error?: string
} {
    if (!file || file.size === 0) {
        return { valid: true } // Optional file
    }

    // Max 5MB
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'Image must be less than 5MB'
        }
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Image must be JPG, PNG, or WebP'
        }
    }

    return { valid: true }
}

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type PhoneInput = z.infer<typeof phoneSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ProductInput = z.infer<typeof productSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type OrderStatusInput = z.infer<typeof orderStatusSchema>
export type SearchInput = z.infer<typeof searchSchema>
