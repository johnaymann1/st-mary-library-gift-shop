/**
 * Products Service
 * Centralized data access for all product-related operations.
 * This abstracts the database layer from server actions.
 */
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types'

export interface ProductFilters {
    categoryId?: number
    inStock?: boolean
    isActive?: boolean
    limit?: number
    offset?: number
}

export interface CreateProductData {
    name_en: string
    name_ar: string
    desc_en?: string | null
    desc_ar?: string | null
    price: number
    in_stock: boolean
    category_id: number
    image_url?: string | null
    is_active?: boolean
}

export interface UpdateProductData extends Partial<CreateProductData> { }

/**
 * Retrieves all products with optional filtering
 */
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
    const supabase = await createClient()

    let query = supabase
        .from('products')
        .select('*, categories(name_en)')
        .order('created_at', { ascending: false })

    if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId)
    }
    if (filters?.inStock !== undefined) {
        query = query.eq('in_stock', filters.inStock)
    }
    if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive)
    }
    if (filters?.limit) {
        query = query.limit(filters.limit)
    }
    if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
        return []
    }

    return data as Product[]
}

/**
 * Retrieves a single product by ID
 */
export async function getProductById(id: number): Promise<Product | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select('*, categories(name_en)')
        .eq('id', id)
        .single()

    if (error) {
        return null
    }

    return data as Product
}

/**
 * Creates a new product
 */
export async function createProduct(data: CreateProductData): Promise<{ product?: Product; error?: string }> {
    const supabase = await createClient()

    const { data: product, error } = await supabase
        .from('products')
        .insert({
            name_en: data.name_en,
            name_ar: data.name_ar,
            desc_en: data.desc_en,
            desc_ar: data.desc_ar,
            price: data.price,
            in_stock: data.in_stock,
            category_id: data.category_id,
            image_url: data.image_url,
            is_active: data.is_active ?? true
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    return { product: product as Product }
}

/**
 * Updates an existing product
 */
export async function updateProduct(id: number, data: UpdateProductData): Promise<{ product?: Product; error?: string }> {
    const supabase = await createClient()

    const { data: product, error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    return { product: product as Product }
}

/**
 * Deletes a product by ID
 */
export async function deleteProduct(id: number): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export interface ProductStats {
    totalProducts: number
    activeProducts: number
    outOfStock: number
}

/**
 * Gets product statistics for dashboard
 */
export async function getProductStats(): Promise<ProductStats> {
    const supabase = await createClient()

    const [total, active, outOfStock] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', false)
    ])

    return {
        totalProducts: total.count || 0,
        activeProducts: active.count || 0,
        outOfStock: outOfStock.count || 0
    }
}

/**
 * Gets recent products with category info
 */
export async function getRecentProducts(limit: number = 5): Promise<Product[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select(`*, categories(name_en)`)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        return []
    }

    return data as Product[]
}

/**
 * Searches products by name (EN or AR)
 */
export async function searchProducts(query: string, limit: number = 20): Promise<Product[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select('*, categories(name_en)')
        .eq('is_active', true)
        .or(`name_en.ilike.%${query}%,name_ar.ilike.%${query}%`)
        .limit(limit)

    if (error) {
        return []
    }

    return data as Product[]
}

export interface SearchFilters {
    query?: string
    categoryId?: number
    sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'name'
    offset?: number
    limit?: number
}

/**
 * Searches products with count for pagination
 */
export async function searchProductsWithCount(filters: SearchFilters): Promise<{ products: Product[]; count: number }> {
    const supabase = await createClient()

    let query = supabase
        .from('products')
        .select('*, categories(name_en)', { count: 'exact' })
        .eq('is_active', true)

    // Apply search filter
    if (filters.query) {
        query = query.or(`name_en.ilike.%${filters.query}%,name_ar.ilike.%${filters.query}%,desc_en.ilike.%${filters.query}%,desc_ar.ilike.%${filters.query}%`)
    }

    // Apply category filter
    if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId)
    }

    // Apply sorting
    switch (filters.sortBy) {
        case 'price-asc':
            query = query.order('price', { ascending: true })
            break
        case 'price-desc':
            query = query.order('price', { ascending: false })
            break
        case 'name':
            query = query.order('name_en', { ascending: true })
            break
        case 'newest':
        default:
            query = query.order('created_at', { ascending: false })
    }

    // Apply pagination
    const limit = filters.limit || 12
    const offset = filters.offset || 0
    query = query.range(offset, offset + limit - 1)

    const { data, count, error } = await query

    if (error) {
        return { products: [], count: 0 }
    }

    return { products: data as Product[], count: count || 0 }
}

