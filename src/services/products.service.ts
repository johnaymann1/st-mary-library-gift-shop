/**
 * Products Service
 * Business logic layer for product operations.
 * Uses products repository for data access.
 */
import * as productsRepo from './repositories/products.repository'
import type { Product } from '@/types'

/**
 * Service result type
 */
export interface ServiceResult<T = void> {
    success: boolean
    data?: T
    error?: string
}

/**
 * Product filters for public-facing queries
 */
export interface ProductFilters {
    categoryId?: number
    inStock?: boolean
    limit?: number
    offset?: number
}

/**
 * Admin product filters (includes isActive)
 */
export interface AdminProductFilters extends ProductFilters {
    isActive?: boolean
}

/**
 * Product creation data
 */
export interface CreateProductData {
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
export interface UpdateProductData extends Partial<CreateProductData> {}

/**
 * Gets all products (public) - only active products
 */
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
        return await productsRepo.findAllProducts({
            ...filters,
            isActive: true
        })
    } catch (error) {
        console.error('Get products error:', error)
        return []
    }
}

/**
 * Gets all products (admin) - includes inactive
 */
export async function getAdminProducts(filters?: AdminProductFilters): Promise<Product[]> {
    try {
        return await productsRepo.findAllProducts(filters)
    } catch (error) {
        console.error('Get admin products error:', error)
        return []
    }
}

/**
 * Gets a single product by ID
 */
export async function getProductById(id: number): Promise<Product | null> {
    try {
        return await productsRepo.findProductById(id)
    } catch (error) {
        console.error('Get product error:', error)
        return null
    }
}

/**
 * Creates a new product
 */
export async function createProduct(data: CreateProductData): Promise<ServiceResult<Product>> {
    try {
        // Validate price
        if (data.price <= 0) {
            return { success: false, error: 'Price must be positive' }
        }

        // Validate sale price if provided
        if (data.sale_price !== undefined && data.sale_price !== null) {
            if (data.sale_price >= data.price) {
                return { success: false, error: 'Sale price must be less than regular price' }
            }
        }

        const product = await productsRepo.createProduct(data)
        return { success: true, data: product }
    } catch (error) {
        console.error('Create product error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create product'
        }
    }
}

/**
 * Updates an existing product
 */
export async function updateProduct(
    id: number,
    data: UpdateProductData
): Promise<ServiceResult<Product>> {
    try {
        // Validate price if provided
        if (data.price !== undefined && data.price <= 0) {
            return { success: false, error: 'Price must be positive' }
        }

        // Validate sale price if provided
        if (data.sale_price !== undefined && data.sale_price !== null && data.price) {
            if (data.sale_price >= data.price) {
                return { success: false, error: 'Sale price must be less than regular price' }
            }
        }

        const product = await productsRepo.updateProduct(id, data)
        return { success: true, data: product }
    } catch (error) {
        console.error('Update product error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update product'
        }
    }
}

/**
 * Deletes a product
 */
export async function deleteProduct(id: number): Promise<ServiceResult> {
    try {
        await productsRepo.deleteProduct(id)
        return { success: true }
    } catch (error) {
        console.error('Delete product error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete product'
        }
    }
}

/**
 * Searches products by text query
 */
export async function searchProducts(query: string, limit?: number): Promise<Product[]> {
    try {
        if (!query || query.trim().length === 0) {
            return []
        }

        return await productsRepo.searchProducts(query, limit)
    } catch (error) {
        console.error('Search products error:', error)
        return []
    }
}

/**
 * Search filters for advanced search
 */
export interface SearchFilters {
    query?: string
    categoryId?: number
    sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'name'
    offset?: number
    limit?: number
}

/**
 * Searches products with pagination
 */
export async function searchProductsWithCount(
    filters: SearchFilters
): Promise<{ products: Product[]; count: number }> {
    try {
        return await productsRepo.searchProductsWithCount(
            filters.query,
            filters.categoryId,
            filters.sortBy,
            filters.offset,
            filters.limit
        )
    } catch (error) {
        console.error('Search products with count error:', error)
        return { products: [], count: 0 }
    }
}

/**
 * Gets product statistics for dashboard
 */
export interface ProductStats {
    totalProducts: number
    activeProducts: number
    outOfStock: number
}

export async function getProductStats(): Promise<ProductStats> {
    try {
        const [total, active, outOfStock] = await Promise.all([
            productsRepo.countProducts(),
            productsRepo.countProducts({ isActive: true }),
            productsRepo.countProducts({ inStock: false })
        ])

        return {
            totalProducts: total,
            activeProducts: active,
            outOfStock: outOfStock
        }
    } catch (error) {
        console.error('Get product stats error:', error)
        return {
            totalProducts: 0,
            activeProducts: 0,
            outOfStock: 0
        }
    }
}

/**
 * Gets recent products for dashboard
 */
export async function getRecentProducts(limit: number = 5): Promise<Product[]> {
    try {
        return await productsRepo.findRecentProducts(limit)
    } catch (error) {
        console.error('Get recent products error:', error)
        return []
    }
}

/**
 * Checks if product is in stock
 */
export async function isProductInStock(productId: number): Promise<boolean> {
    try {
        return await productsRepo.isProductInStock(productId)
    } catch (error) {
        console.error('Check stock error:', error)
        return false
    }
}

/**
 * Bulk updates stock status
 */
export async function bulkUpdateStock(
    productIds: number[],
    inStock: boolean
): Promise<ServiceResult> {
    try {
        if (!productIds || productIds.length === 0) {
            return { success: false, error: 'No products selected' }
        }

        await productsRepo.bulkUpdateStock(productIds, inStock)
        return { success: true }
    } catch (error) {
        console.error('Bulk update stock error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update stock'
        }
    }
}
