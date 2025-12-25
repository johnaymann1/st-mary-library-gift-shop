/**
 * Products Repository
 * Pure database operations for product management.
 * Zero business logic - only CRUD operations.
 */
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types'

/**
 * Product creation data
 */
export interface CreateProductEntity {
    name_en: string
    name_ar: string
    desc_en?: string | null
    desc_ar?: string | null
    price: number
    sale_price?: number | null
    sale_end_date?: string | null
    in_stock: boolean
    category_id: number
    image_url?: string | null
    is_active?: boolean
}

/**
 * Product update data
 */
export interface UpdateProductEntity extends Partial<CreateProductEntity> {}

/**
 * Query filters for product listing
 */
export interface ProductQueryFilters {
    categoryId?: number
    inStock?: boolean
    isActive?: boolean
    limit?: number
    offset?: number
    sortBy?: 'created_at' | 'price' | 'name_en'
    sortOrder?: 'asc' | 'desc'
}

const PRODUCT_SELECT_QUERY = '*, categories(name_en, name_ar)'

/**
 * Finds all products with optional filtering
 */
export async function findAllProducts(filters?: ProductQueryFilters): Promise<Product[]> {
    const supabase = await createClient()

    let query = supabase
        .from('products')
        .select(PRODUCT_SELECT_QUERY)

    // Apply filters
    if (filters?.categoryId !== undefined) {
        query = query.eq('category_id', filters.categoryId)
    }
    if (filters?.inStock !== undefined) {
        query = query.eq('in_stock', filters.inStock)
    }
    if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive)
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'created_at'
    const sortOrder = filters?.sortOrder || 'desc'
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    if (filters?.limit !== undefined) {
        query = query.limit(filters.limit)
    }
    if (filters?.offset !== undefined && filters?.limit !== undefined) {
        query = query.range(filters.offset, filters.offset + filters.limit - 1)
    }

    const { data, error } = await query

    if (error) throw new Error(`Failed to fetch products: ${error.message}`)

    return data as Product[]
}

/**
 * Finds a single product by ID
 */
export async function findProductById(id: number): Promise<Product | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select(PRODUCT_SELECT_QUERY)
        .eq('id', id)
        .maybeSingle()

    if (error) throw new Error(`Failed to fetch product: ${error.message}`)

    return data as Product | null
}

/**
 * Creates a new product
 */
export async function createProduct(entity: CreateProductEntity): Promise<Product> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .insert({
            name_en: entity.name_en,
            name_ar: entity.name_ar,
            desc_en: entity.desc_en || null,
            desc_ar: entity.desc_ar || null,
            price: entity.price,
            sale_price: entity.sale_price || null,
            sale_end_date: entity.sale_end_date || null,
            in_stock: entity.in_stock,
            category_id: entity.category_id,
            image_url: entity.image_url || null,
            is_active: entity.is_active ?? true
        })
        .select(PRODUCT_SELECT_QUERY)
        .single()

    if (error) throw new Error(`Failed to create product: ${error.message}`)

    return data as Product
}

/**
 * Updates an existing product
 */
export async function updateProduct(id: number, entity: UpdateProductEntity): Promise<Product> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .update(entity)
        .eq('id', id)
        .select(PRODUCT_SELECT_QUERY)
        .single()

    if (error) throw new Error(`Failed to update product: ${error.message}`)

    return data as Product
}

/**
 * Deletes a product by ID
 */
export async function deleteProduct(id: number): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) throw new Error(`Failed to delete product: ${error.message}`)
}

/**
 * Searches products by text query (name or description)
 */
export async function searchProducts(
    query: string,
    limit: number = 20
): Promise<Product[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select(PRODUCT_SELECT_QUERY)
        .eq('is_active', true)
        .or(`name_en.ilike.%${query}%,name_ar.ilike.%${query}%,desc_en.ilike.%${query}%,desc_ar.ilike.%${query}%`)
        .limit(limit)

    if (error) throw new Error(`Failed to search products: ${error.message}`)

    return data as Product[]
}

/**
 * Searches products with total count for pagination
 */
export async function searchProductsWithCount(
    query?: string,
    categoryId?: number,
    sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'name',
    offset?: number,
    limit?: number
): Promise<{ products: Product[]; count: number }> {
    const supabase = await createClient()

    let queryBuilder = supabase
        .from('products')
        .select(PRODUCT_SELECT_QUERY, { count: 'exact' })
        .eq('is_active', true)

    // Apply text search
    if (query) {
        queryBuilder = queryBuilder.or(
            `name_en.ilike.%${query}%,name_ar.ilike.%${query}%,desc_en.ilike.%${query}%,desc_ar.ilike.%${query}%`
        )
    }

    // Apply category filter
    if (categoryId) {
        queryBuilder = queryBuilder.eq('category_id', categoryId)
    }

    // Apply sorting
    switch (sortBy) {
        case 'price-asc':
            queryBuilder = queryBuilder.order('price', { ascending: true })
            break
        case 'price-desc':
            queryBuilder = queryBuilder.order('price', { ascending: false })
            break
        case 'name':
            queryBuilder = queryBuilder.order('name_en', { ascending: true })
            break
        case 'newest':
        default:
            queryBuilder = queryBuilder.order('created_at', { ascending: false })
    }

    // Apply pagination
    const paginationLimit = limit || 12
    const paginationOffset = offset || 0
    queryBuilder = queryBuilder.range(
        paginationOffset,
        paginationOffset + paginationLimit - 1
    )

    const { data, count, error } = await queryBuilder

    if (error) throw new Error(`Failed to search products: ${error.message}`)

    return {
        products: data as Product[],
        count: count || 0
    }
}

/**
 * Counts total products
 */
export async function countProducts(filters?: Pick<ProductQueryFilters, 'isActive' | 'inStock'>): Promise<number> {
    const supabase = await createClient()

    let query = supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

    if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive)
    }
    if (filters?.inStock !== undefined) {
        query = query.eq('in_stock', filters.inStock)
    }

    const { count, error } = await query

    if (error) throw new Error(`Failed to count products: ${error.message}`)

    return count || 0
}

/**
 * Gets recent products (dashboard widget)
 */
export async function findRecentProducts(limit: number = 5): Promise<Product[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select(PRODUCT_SELECT_QUERY)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw new Error(`Failed to fetch recent products: ${error.message}`)

    return data as Product[]
}

/**
 * Checks if a product is in stock
 */
export async function isProductInStock(productId: number): Promise<boolean> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select('in_stock')
        .eq('id', productId)
        .single()

    if (error) throw new Error(`Failed to check product stock: ${error.message}`)

    return data.in_stock
}

/**
 * Bulk updates stock status
 */
export async function bulkUpdateStock(productIds: number[], inStock: boolean): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('products')
        .update({ in_stock: inStock })
        .in('id', productIds)

    if (error) throw new Error(`Failed to bulk update stock: ${error.message}`)
}
